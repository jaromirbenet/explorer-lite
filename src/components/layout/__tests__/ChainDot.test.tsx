import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ChainDot } from '../ChainDot'
import theme from '../../../theme'

const renderDot = (props: { connected: boolean; color: string; label: string }) =>
  render(
    <ChakraProvider theme={theme}>
      <ChainDot {...props} />
    </ChakraProvider>
  )

describe('ChainDot', () => {
  it('renders the label', () => {
    renderDot({ connected: true, color: '#9945FF', label: 'SOL' })
    expect(screen.getByText('SOL')).toBeInTheDocument()
  })

  it('renders with connected=true', () => {
    renderDot({ connected: true, color: '#627EEA', label: 'ETH' })
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('renders with connected=false', () => {
    renderDot({ connected: false, color: '#F7931A', label: 'BTC' })
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('renders all chain labels', () => {
    const chains = [
      { connected: true, color: '#9945FF', label: 'SOL' },
      { connected: false, color: '#627EEA', label: 'ETH' },
      { connected: false, color: '#F7931A', label: 'BTC' },
    ]
    chains.forEach(({ connected, color, label }) => {
      const { unmount } = renderDot({ connected, color, label })
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })
})
