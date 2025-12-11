import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import { getAllIssues, getIssueById, updateIssueStatus } from '../services/issueService';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('tr');

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'default'
};

const statusLabels = {
  pending: 'Beklemede',
  in_progress: 'İnceleniyor',
  resolved: 'Çözüldü',
  closed: 'Kapatıldı'
};

const statusIcons = {
  pending: <HourglassEmptyIcon />,
  in_progress: <EditIcon />,
  resolved: <CheckCircleIcon />,
  closed: <CancelIcon />
};

const ReportedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadIssues();
  }, [statusFilter]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = statusFilter === 'all' ? null : statusFilter;
      const response = await getAllIssues(status);
      setIssues(response.issues || []);
    } catch (err) {
      console.error('Sorunlar yüklenirken hata:', err);
      // 401 hatası durumunda özel mesaj göster
      if (err.response?.status === 401 || err.message?.includes('Yetkisiz') || err.message?.includes('token')) {
        setError('Oturum süreniz dolmuş olabilir. Lütfen sayfayı yenileyin veya tekrar giriş yapın.');
      } else {
        setError(err.message || err.response?.data?.message || 'Sorunlar yüklenirken bir hata oluştu');
      }
      setIssues([]); // Hata durumunda boş liste göster
    } finally {
      setLoading(false);
    }
  };

  const handleIssueClick = async (issueId) => {
    try {
      const response = await getIssueById(issueId);
      setSelectedIssue(response.issue);
      setDetailDialogOpen(true);
    } catch (err) {
      alert(err.message || 'Sorun detayı yüklenirken bir hata oluştu');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !newStatus) return;

    try {
      setUpdating(true);
      await updateIssueStatus(selectedIssue._id, newStatus, adminNotes);
      await loadIssues();
      setStatusDialogOpen(false);
      setDetailDialogOpen(false);
      setSelectedIssue(null);
      setNewStatus('');
      setAdminNotes('');
      alert('Sorun durumu başarıyla güncellendi');
    } catch (err) {
      alert(err.message || 'Durum güncellenirken bir hata oluştu');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenStatusDialog = () => {
    if (selectedIssue) {
      setNewStatus(selectedIssue.status);
      setAdminNotes(selectedIssue.adminNotes || '');
      setStatusDialogOpen(true);
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const getTimeAgo = (date) => {
    return dayjs(date).fromNow();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Başlık */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Bildirilen Sorunlar
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400 }}>
          Kullanıcılar tarafından bildirilen sorunları görüntüleyin ve yönetin
        </Typography>
      </Box>

      {/* Filtre */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Durum Filtresi</InputLabel>
          <Select
            value={statusFilter}
            label="Durum Filtresi"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="pending">Beklemede</MenuItem>
            <MenuItem value="in_progress">İnceleniyor</MenuItem>
            <MenuItem value="resolved">Çözüldü</MenuItem>
            <MenuItem value="closed">Kapatıldı</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Hata Mesajı */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Sorun Listesi */}
      {issues.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: '1px dashed rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}
        >
          <BugReportIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1rem' }}>
            {statusFilter === 'all' ? 'Henüz bildirilen sorun bulunmuyor' : 'Bu durumda sorun bulunmuyor'}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {issues.map((issue) => (
            <Card
              key={issue._id}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => handleIssueClick(issue._id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2.5} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: `${statusColors[issue.status]}.light`,
                      width: 48,
                      height: 48
                    }}
                  >
                    <BugReportIcon sx={{ color: `${statusColors[issue.status]}.main` }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1rem', flex: 1 }}>
                        {issue.title}
                      </Typography>
                      <Chip
                        icon={statusIcons[issue.status]}
                        label={statusLabels[issue.status]}
                        color={statusColors[issue.status]}
                        size="small"
                        sx={{ fontSize: '0.75rem', fontWeight: 600, height: 26 }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {issue.description}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {issue.reportedBy?.name || 'Bilinmeyen'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {getTimeAgo(issue.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Sorun Detay Dialog'u */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedIssue(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        {selectedIssue && (
          <>
            <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
              Sorun Detayı
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 2.5 }}>
              <Stack spacing={3}>
                {/* Başlık ve Durum */}
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.125rem', flex: 1 }}>
                      {selectedIssue.title}
                    </Typography>
                    <Chip
                      icon={statusIcons[selectedIssue.status]}
                      label={statusLabels[selectedIssue.status]}
                      color={statusColors[selectedIssue.status]}
                      sx={{ fontSize: '0.8rem', fontWeight: 600 }}
                    />
                  </Stack>
                </Box>

                <Divider />

                {/* Açıklama */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, fontSize: '0.9rem' }}>
                    Sorun Açıklaması
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {selectedIssue.description}
                  </Typography>
                </Box>

                <Divider />

                {/* Bildiren Kullanıcı Bilgileri */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                    Bildiren Kullanıcı
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {selectedIssue.reportedBy?.name || 'Bilinmeyen'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {selectedIssue.reportedBy?.email || 'Bilinmeyen'}
                      </Typography>
                    </Stack>
                    {selectedIssue.reportedBy?.phoneNumber && (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {selectedIssue.reportedBy.phoneNumber}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Divider />

                {/* Tarih Bilgileri */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                    Tarih Bilgileri
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          Bildirilme Tarihi
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {formatDate(selectedIssue.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>
                    {selectedIssue.updatedAt && selectedIssue.updatedAt !== selectedIssue.createdAt && (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            Son Güncelleme
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {formatDate(selectedIssue.updatedAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                {/* Admin Notları */}
                {selectedIssue.adminNotes && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, fontSize: '0.9rem' }}>
                        Admin Notları
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {selectedIssue.adminNotes}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button
                onClick={() => {
                  setDetailDialogOpen(false);
                  setSelectedIssue(null);
                }}
                color="inherit"
                sx={{
                  px: 2.5,
                  py: 1.25,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Kapat
              </Button>
              <Button
                onClick={handleOpenStatusDialog}
                variant="contained"
                sx={{
                  px: 3.5,
                  py: 1.25,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 2
                }}
              >
                Durumu Güncelle
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Durum Güncelleme Dialog'u */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => {
          setStatusDialogOpen(false);
          setNewStatus('');
          setAdminNotes('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
          Durum Güncelle
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          <Stack spacing={2.5}>
            <FormControl fullWidth>
              <InputLabel>Yeni Durum</InputLabel>
              <Select
                value={newStatus}
                label="Yeni Durum"
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="pending">Beklemede</MenuItem>
                <MenuItem value="in_progress">İnceleniyor</MenuItem>
                <MenuItem value="resolved">Çözüldü</MenuItem>
                <MenuItem value="closed">Kapatıldı</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Admin Notları (İsteğe Bağlı)"
              placeholder="Sorun hakkında notlarınızı buraya yazabilirsiniz..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => {
              setStatusDialogOpen(false);
              setNewStatus('');
              setAdminNotes('');
            }}
            color="inherit"
            sx={{
              px: 2.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={!newStatus || updating}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 2
            }}
          >
            {updating ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportedIssues;

