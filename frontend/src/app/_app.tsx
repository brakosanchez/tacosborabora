import type { Metadata } from 'next'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/theme'

import '@fontsource/bebas-neue'
import '@fontsource/yeseva-one'
import '@fontsource/unbounded'

export const metadata: Metadata = {
  title: 'Tacos Bora Bora',
  description: 'Isla del Sabor - Tacos de alta calidad en Nextlalpan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
