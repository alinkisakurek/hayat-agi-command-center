import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import AndroidIcon from '@mui/icons-material/Android'
import AppleIcon from '@mui/icons-material/Apple'
import { alpha, useTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import Navbar from '../components/Navbar'

const platformCards = [
  {
    id: 'android',
    title: 'Android',
    description:
      'Android sürümü düşük enerji tüketimiyle enkaz altında bile uzun süre çalışır. Tek tuşla SOS gönder, sensör verilerini paylaş.',
    icon: <AndroidIcon fontSize="large" />,
  },
  {
    id: 'ios',
    title: 'iOS',
    description:
      'iOS uygulaması düşük güç modu ve offline mesaj kuyruğu ile acil durumlarda iletişimi kesintisiz tutar.',
    icon: <AppleIcon fontSize="large" />,
  },
]

const MobileApp = () => {
  const theme = useTheme()
  const heroContent = useMemo(
    () => ({
      title: 'Mobil Uygulamamız',
      subtitle: 'Deprem sonrası hayatta kalma iletişim kiti',
      description:
        'Deprem sonrasında enkaz altında kalma durumunda Hayat Ağı mobil uygulamasını kullanarak acil yardım ekipleriyle iletişime geçebilir ve acil durum sinyali gönderebilirsin. Telefon şarjının kullanımını minimize ederek uzun süreli kullanım hedeflenir.',
    }),
    [],
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            bgcolor: alpha(theme.palette.primary.light, 0.08),
            px: { xs: 3, md: 8 },
            py: { xs: 5, md: 8 },
            textAlign: 'center',
            boxShadow: `0px 18px 50px ${alpha(theme.palette.primary.dark, 0.15)}`,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="overline" color="text.secondary" letterSpacing={2}>
              TAGLINE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {heroContent.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {heroContent.subtitle}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto' }}>
              {heroContent.description}
            </Typography>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ mt: { xs: 6, md: 8 } }}
        >
          {platformCards.map((platform, index) => (
            <Card
              key={platform.id}
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: 3,
                borderColor: 'divider',
                bgcolor:
                  index === 0
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.secondary.main, 0.1),
              }}
            >
              <CardContent sx={{ minHeight: 320, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.5),
                    borderRadius: 2,
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {platform.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {platform.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {platform.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: 'center',
                    px: 4,
                    borderRadius: 999,
                    boxShadow: '0px 12px 30px rgba(0,0,0,0.12)',
                  }}
                >
                  İndir
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}

export default MobileApp

