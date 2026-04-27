import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Alert as MuiAlert,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  LinearProgress
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LockIcon from '@mui/icons-material/Lock';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import { getCitizenStats } from '../api/adminStatsService';

const SCOPE_LEVELS = ['province', 'district', 'neighborhood'];
const SCOPE_LABELS = {
  province: 'İl',
  district: 'İlçe',
  neighborhood: 'Mahalle',
};

const StatCard = ({ icon, label, value, color = 'primary' }) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}.light`,
            color: `${color}.dark`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem', color: `${color}.main` }}>
            {value ?? '—'}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const TopList = ({ title, items, emptyLabel }) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {emptyLabel}
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {items.map((it) => {
            const max = items[0]?.count || 1;
            const pct = Math.round((it.count / max) * 100);
            return (
              <Box key={it.name}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {it.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {it.count}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </CardContent>
  </Card>
);

const AdminCitizenStats = () => {
  const [scope, setScope] = useState({ province: null, district: null, neighborhood: null });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCitizenStats(scope);
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'İstatistikler yüklenemedi.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const activeScopeChips = useMemo(
    () =>
      SCOPE_LEVELS
        .filter((lvl) => scope[lvl])
        .map((lvl) => ({ level: lvl, label: SCOPE_LABELS[lvl], value: scope[lvl] })),
    [scope]
  );

  const handleDrillDown = (level, value) => {
    setScope((prev) => ({ ...prev, [level]: value }));
  };

  const handleClearLevel = (level) => {
    setScope((prev) => {
      const next = { ...prev };
      // Clearing a level also clears any deeper levels.
      const levels = SCOPE_LEVELS;
      const idx = levels.indexOf(level);
      for (let i = idx; i < levels.length; i++) next[levels[i]] = null;
      return next;
    });
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
        >
          Vatandaş İstatistikleri
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            KVKK uyumlu — yalnızca sayısal toplamlar gösterilir, kişi bilgisi paylaşılmaz.
          </Typography>
        </Stack>
      </Box>

      {/* Active scope */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Kapsam:
        </Typography>
        {activeScopeChips.length === 0 ? (
          <Chip label="Tüm Türkiye" size="small" />
        ) : (
          activeScopeChips.map((c) => (
            <Chip
              key={c.level}
              label={`${c.label}: ${c.value}`}
              size="small"
              onDelete={() => handleClearLevel(c.level)}
              deleteIcon={<ClearIcon />}
              color="primary"
              variant="outlined"
            />
          ))
        )}
      </Paper>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </MuiAlert>
      )}

      {loading && !data ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : data ? (
        <>
          {/* Stat cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<RouterIcon />}
                label="Cihaz"
                value={data.gatewayCount}
                color="primary"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<PeopleAltIcon />}
                label="Kayıtlı Kişi"
                value={data.totalCitizens}
                color="info"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<PetsIcon />}
                label="Kayıtlı Hayvan"
                value={data.totalAnimals}
                color="success"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                icon={<MedicalServicesIcon />}
                label="Kronik Hastalığı Olan"
                value={data.withChronicConditions}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Three top-N lists */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TopList
                title="Kronik Hastalıklar"
                items={data.byChronicCondition || []}
                emptyLabel="Bu kapsamda kronik hastalık kaydı yok."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TopList
                title="İlaç Kullanımı"
                items={data.byMedication || []}
                emptyLabel="Bu kapsamda ilaç kullanımı kaydı yok."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TopList
                title="Protez / Engel Durumu"
                items={data.byProsthesis || []}
                emptyLabel="Bu kapsamda protez kaydı yok."
              />
            </Grid>
          </Grid>

          {/* Drill-down breakdown */}
          {data.breakdownLevel && data.breakdown.length > 0 && (
            <Paper
              elevation={0}
              sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight="700">
                  {SCOPE_LABELS[data.breakdownLevel]} Kırılımı
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Daha alt seviyeye inmek için bir satıra tıklayın.
                </Typography>
              </Box>
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{SCOPE_LABELS[data.breakdownLevel]}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Cihaz
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Kişi
                    </TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.breakdown.map((row) => (
                    <TableRow
                      key={row.name}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleDrillDown(data.breakdownLevel, row.name)}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.gatewayCount}</TableCell>
                      <TableCell align="right">{row.citizenCount}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={`${row.name} kapsamına in`}>
                          <IconButton size="small">
                            <ChevronRightIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      ) : null}
    </Box>
  );
};

export default AdminCitizenStats;
