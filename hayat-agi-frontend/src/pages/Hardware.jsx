import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Button,
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { alpha, useTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import Navbar from '../components/Navbar'

const featureCards = [
  {
    id: 'long-range',
    title: 'Uzun Mesafeli İletişim',
    description:
      'LoRa E22 modülleri ile şehir içi 8 km’ye kadar çift yönlü haberleşme. Mesh ağ ile çoklu atlama senaryoları.',
    icon: <PublicIcon fontSize="large" />,
  },
  {
    id: 'low-power',
    title: 'Düşük Enerji Tüketimi',
    description:
      'ESP32 tabanlı gateway’ler düşük güç modları ve batarya destekli kullanım ile afet senaryolarında günlerce aktif kalır.',
    icon: <RestartAltIcon fontSize="large" />,
  },
  {
    id: 'modular',
    title: 'Modüler Mimari',
    description:
      'Sensör, GPS ve LTE modülleri tak-çıkar tasarım ile hızlı konfigürasyon sağlar. Açık kaynak donanım şemalarıyla geliştirilebilir.',
    icon: <StarBorderIcon fontSize="large" />,
  },
]

const Hardware = () => {
  const theme = useTheme()
  const heroCopy = useMemo(
    () => ({
      title: 'Hayat Ağı Cihazları',
      description:
        "LOLIN ESP32 ve LoRa E22'nin teknik olarak yarattığı düşük maliyet ve düşük enerji kullanım avantajlarını birleştirdik. Gateway'lerimiz, afet sahasında sürekli iletişimi mümkün kılar.",
      tagline: 'Tagline',
    }),
    [],
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 520 }}>
            <Typography variant="overline" color="text.secondary">
              {heroCopy.tagline}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
              {heroCopy.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {heroCopy.description}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button variant="contained">Demo Talep Et</Button>
              <Button variant="outlined">Teknik Doküman</Button>
            </Stack>
          </Box>

          <Stack spacing={3} sx={{ flex: 1, width: '100%' }}>
            {featureCards.map((card, idx) => (
              <Paper
                key={card.id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  bgcolor:
                    idx === 0
                      ? alpha(theme.palette.primary.main, 0.05)
                      : idx === 1
                        ? alpha(theme.palette.secondary.main, 0.05)
                        : alpha(theme.palette.info.main, 0.05),
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.common.white, 0.8),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.text.secondary,
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {card.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Hardware

