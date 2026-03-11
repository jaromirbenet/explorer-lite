import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      bg: '#0d0d12',          // page / row background
      bgHover: '#111118',     // row hover background
      surface: '#14141c',     // card / panel background
      border: '#1c1c28',      // subtle borders, dividers, interactive hover bg
      borderStrong: '#252535',// card borders
      borderHover: '#35354a', // border on hover / focus
      textPrimary: '#e8e8f0', // main text
      textSubtle: '#a0a0c0',  // secondary text
      textSecondary: '#7878a0',// tertiary / label text
      textMuted: '#4a4a6a',   // muted / placeholder text
      inactive: '#3a3a50',    // inactive indicator dots
    },
  },
  layerStyles: {
    card: {
      bg: 'brand.surface',
      borderRadius: 'xl',
      border: '1px solid',
      borderColor: 'brand.borderStrong',
    },
    row: {
      bg: 'brand.bg',
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'brand.border',
      transition: 'all 0.15s',
    },
  },
  textStyles: {
    label: {
      fontSize: '2xs',
      color: 'brand.textMuted',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    muted: {
      fontSize: 'sm',
      color: 'brand.textMuted',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.bg',
        color: 'brand.textPrimary',
      },
      '*': {
        borderColor: 'brand.borderStrong',
      },
    },
  },
  components: {
    Tabs: {
      variants: {
        unstyled: {
          tab: {
            color: 'brand.textSecondary',
            _selected: { color: 'brand.textPrimary' },
          },
        },
      },
    },
  },
})

export default theme
