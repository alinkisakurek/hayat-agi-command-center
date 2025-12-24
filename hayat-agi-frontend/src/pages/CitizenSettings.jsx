import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  Radio, // <--- YENİ EKLENDİ
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Badge as BadgeIcon,
  Info,
  CheckCircle,
  HealthAndSafety,
  ExpandMore,
  Security,
  Save,
  Warning,
  VisibilityOff,
  HearingDisabled,
  VerifiedUser
} from '@mui/icons-material';

const CitizenSettings = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [formData, setFormData] = useState({
    tcNumber: '',
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    bloodType: '',
    height: '',
    weight: '',
    respiration: [],
    heartCirculation: [],
    metabolic: [],
    allergies: [],
    neurological: [],
    demographicRisk: [],
    cognitiveCommunicationSensoryRisk: []
  });

  // Verileri Çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, userRes] = await Promise.all([
          api.get('/metadata/system-options'),
          api.get('/users/me')
        ]);
        setMetadata(metaRes.data);
        const user = userRes.data;
        setFormData({
          ...user,
          // Arrayleri garantiye al
          respiration: user.respiration || [],
          heartCirculation: user.heartCirculation || [],
          metabolic: user.metabolic || [],
          allergies: user.allergies || [],
          neurological: user.neurological || [],
          demographicRisk: user.demographicRisk || [],
          cognitiveCommunicationSensoryRisk: user.cognitiveCommunicationSensoryRisk || []
        });
      } catch (err) {
        console.error("Veri hatası:", err);
        setMessage({ type: 'error', text: 'Veriler yüklenemedi.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Çoklu Seçim (Checkbox) için
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const list = prev[field] || [];
      return list.includes(value)
        ? { ...prev, [field]: list.filter(i => i !== value) }
        : { ...prev, [field]: [...list, value] };
    });
  };

  // Tekli Seçim (Radio) için - YENİ FONKSİYON
  const handleSingleSelectChange = (field, value) => {
    setFormData(prev => {
      // Eğer zaten seçili olana tekrar tıklanırsa seçimi kaldır (Opsiyonel UX)
      if (prev[field]?.includes(value)) {
        return { ...prev, [field]: [] };
      }
      // Değilse, eskiyi sil ve sadece yeniyi ekle
      return { ...prev, [field]: [value] };
    });
  };

  const handleSave = async () => {
    setMessage(null);
    try {
      await api.put('/users/profile', formData);
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Hata oluştu.' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100%', pb: 15, position: 'relative' }}>
      <Box sx={{ maxWidth: '1000px', mx: 'auto', p: { xs: 2, md: 4 } }}>

        {/* PAGE HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Profil ve Sağlık Ayarları
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Acil durum ekipleri için hayati bilgilerinizi güncel tutun. Bu bilgiler 112 ile entegre çalışır.
          </Typography>
          {message && <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>}
        </Box>

        {/* 1. IDENTITY VERIFICATION CARD */}
        <Paper variant="outlined" sx={{ borderRadius: 3, mb: 4, overflow: 'hidden', borderColor: '#e2e8f0' }}>
          <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon sx={{ color: '#0056b2' }} />
              <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">Kimlik Doğrulama</Typography>
            </Box>
            {formData.isVerified ? (
              <Chip icon={<VerifiedUser />} label="Doğrulanmış Hesap" color="success" size="small" variant="outlined" sx={{ bgcolor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0', fontWeight: 'bold' }} />
            ) : (
              <Chip label="Doğrulama Bekliyor" size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 'bold' }} />
            )}
          </Box>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} md={8}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: '#0f172a' }}>TC Kimlik Numarası</Typography>
                <TextField
                  fullWidth
                  placeholder="11 haneli kimlik numaranız"
                  value={formData.tcNumber || ''}
                  onChange={(e) => setFormData({ ...formData, tcNumber: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'start' }}>
                  <Info sx={{ color: '#0056b2', fontSize: 20, mt: 0.2 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    Acil durumda 112 ekiplerinin sizi kesin tanıması için TC kimlik numaranızı ekleyin. Bu işlem profilinize <strong>'Doğrulanmış Hesap'</strong> statüsü kazandırır.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', mt: { md: 3.5 } }}>
                <Button fullWidth variant="outlined" size="large" sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1' }}>
                  E-Devlet ile Doğrula
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* 2. PERSONAL INFO CARD */}
        <Paper variant="outlined" sx={{ borderRadius: 3, mb: 4, borderColor: '#e2e8f0' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">Kişisel Bilgiler</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Ad</Typography>
                <TextField fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Soyad</Typography>
                <TextField fullWidth value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Telefon Numarası</Typography>
                <TextField
                  fullWidth disabled value={formData.phoneNumber || ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                  InputProps={{ endAdornment: <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>E-posta</Typography>
                <TextField fullWidth disabled value={formData.email} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }} />
              </Grid>

              <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Kan Grubu</Typography>
                <Select
                  fullWidth value={formData.bloodType || ''}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  {metadata?.healthOptions?.KAN_GRUBU?.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Boy (cm)</Typography>
                <TextField type="number" fullWidth value={formData.height || ''} onChange={(e) => setFormData({ ...formData, height: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Kilo (kg)</Typography>
                <TextField type="number" fullWidth value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* 3. HEALTH RISK PROFILE */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0', overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">Sağlık Risk Profili</Typography>
              <Typography variant="caption" color="text.secondary">İşaretlediğiniz hastalıklar acil durumda personele gösterilecektir.</Typography>
            </Box>
            <Box sx={{ bgcolor: '#eff6ff', p: 1, borderRadius: 2, color: '#0056b2' }}>
              <HealthAndSafety />
            </Box>
          </Box>

          {/* Dynamic Sections Loop */}
          {[
            { key: 'SOLUNUM', field: 'respiration', color: '#ef4444' },
            { key: 'KALP_DOLASIM', field: 'heartCirculation', color: '#ef4444' },
            { key: 'KANAMA_METABOLIK', field: 'metabolic', color: '#f59e0b' },
            { key: 'NOROLOJIK_YUKSEK_RISK', field: 'neurological', color: '#8b5cf6' },
          ].map((section) => {
            const meta = metadata?.healthOptions?.[section.key];
            if (!meta) return null;

            return (
              <Box key={section.key} sx={{ borderBottom: '1px solid #e2e8f0' }}>
                <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: section.color, mr: 2 }} />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ flexGrow: 1 }}>{meta.kategori}</Typography>
                  <ExpandMore sx={{ color: '#94a3b8' }} />
                </Box>
                <Box sx={{ px: 3, pb: 3, pt: 1 }}>
                  <Grid container spacing={2}>
                    {meta.hastaliklar.map((disease) => (
                      <Grid item xs={12} sm={6} key={disease}>
                        <Box
                          onClick={() => handleCheckboxChange(section.field, disease)}
                          sx={{
                            display: 'flex', alignItems: 'center', p: 1.5,
                            border: '1px solid',
                            borderColor: formData[section.field]?.includes(disease) ? 'primary.main' : '#e2e8f0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: formData[section.field]?.includes(disease) ? '#eff6ff' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Checkbox
                            checked={formData[section.field]?.includes(disease) || false}
                            size="small"
                            sx={{ p: 0.5, mr: 1 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="500">{disease}</Typography>
                            {/* Kritik hastalık uyarısı simülasyonu */}
                            {['KOAH', 'Kalp Yetmezliği', 'Epilepsi'].includes(disease) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Warning sx={{ fontSize: 14, color: '#ef4444' }} />
                                <Typography variant="caption" color="error" fontWeight="bold">Yüksek Risk</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            );
          })}

          {/* DEMOGRAPHIC RISKS (GÜNCELLENDİ - TEKLİ SEÇİM) */}
          {metadata?.demographicRisks && (
            <Box sx={{ bgcolor: '#f1f5f9', p: 3, borderTop: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#64748b', mr: 2 }} />
                <Typography variant="subtitle2" fontWeight="bold">Demografik & Fiziksel Riskler</Typography>
              </Box>
              <Grid container spacing={2}>
                {Object.entries(metadata.demographicRisks).map(([key, obj]) => {
                  // Seçili olup olmadığını kontrol et
                  const isSelected = formData.demographicRisk?.includes(key);

                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box
                        // YENİ FONKSİYONU ÇAĞIRIYORUZ
                        onClick={() => handleSingleSelectChange('demographicRisk', key)}
                        sx={{
                          display: 'flex', alignItems: 'center', p: 2,
                          // Seçiliyse mavi çerçeve, değilse gri
                          border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : '#cbd5e1',
                          // Seçiliyse hafif mavi arka plan
                          bgcolor: isSelected ? '#eff6ff' : 'white',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                      >
                        {/* CHECKBOX YERİNE RADIO KULLANIYORUZ */}
                        <Radio
                          checked={isSelected || false}
                          size="small"
                          sx={{ p: 0, mr: 1.5 }}
                        />

                        <Box>
                          <Typography variant="body2" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>
                            {obj.etiket}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {obj.aciklama}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* COGNITIVE / SENSORY RISKS */}
          {metadata?.sensoryRisks?.hastaliklar && (
            <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b', mr: 2 }} />
                <Typography variant="subtitle2" fontWeight="bold">Bilişsel ve Duyusal Durumlar</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {metadata.sensoryRisks.hastaliklar.map((risk) => (
                  <Box
                    key={risk}
                    onClick={() => handleCheckboxChange('cognitiveCommunicationSensoryRisk', risk)}
                    sx={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      p: 2, border: '1px solid #e2e8f0', borderRadius: 2,
                      borderColor: formData.cognitiveCommunicationSensoryRisk?.includes(risk) ? 'primary.main' : '#e2e8f0',
                      bgcolor: formData.cognitiveCommunicationSensoryRisk?.includes(risk) ? '#eff6ff' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 1, color: '#64748b' }}>
                        {risk.includes('Görme') ? <VisibilityOff /> : risk.includes('İşitme') ? <HearingDisabled /> : <Warning />}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{risk}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {risk.includes('Görme') ? 'Sesli yanıt sistemi önceliklendirilecektir.' : 'Operatörler yazılı iletişim kuracaktır.'}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Switch Görünümlü Checkbox Simülasyonu */}
                    <Box sx={{
                      width: 44, height: 24, borderRadius: 12, position: 'relative', transition: '0.3s',
                      bgcolor: formData.cognitiveCommunicationSensoryRisk?.includes(risk) ? '#0056b2' : '#cbd5e1'
                    }}>
                      <Box sx={{
                        width: 20, height: 20, borderRadius: '50%', bgcolor: 'white', position: 'absolute', top: 2,
                        left: formData.cognitiveCommunicationSensoryRisk?.includes(risk) ? 22 : 2, transition: '0.3s'
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* STICKY FOOTER */}
      <Box sx={{ position: 'fixed', bottom: 20, left: { md: '256px', xs: 12 }, right: { md: 20, xs: 12 }, zIndex: 1400 }}>
        <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0, borderRadius: 3, boxShadow: '0 10px 30px rgba(2,6,23,0.06)', bgcolor: 'transparent' }}>
          <Box sx={{ width: '100%', maxWidth: 640, display: 'flex', justifyContent: 'center', gap: 1, p: 1, bgcolor: 'transparent', borderRadius: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="text"
              onClick={() => window.history.back()}
              sx={{ width: { xs: '100%', sm: 'auto' }, color: '#64748b', textTransform: 'none', borderRadius: 2 }}
            >
              İptal
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<Save />}
              sx={{ width: { xs: '100%', sm: 'auto' }, ml: { sm: 1 }, background: 'linear-gradient(90deg,#0066ff,#0044cc)', boxShadow: '0 8px 24px rgba(0,86,178,0.18)', '&:hover': { opacity: 0.95 }, textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 'bold' }}
            >
              Değişiklikleri Kaydet
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CitizenSettings;