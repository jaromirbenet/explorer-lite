import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ChainCard } from '../ChainCard'
import theme from '../../../theme'

vi.mock('framer-motion', () => ({
  motion: (Component: React.ComponentType<Record<string, unknown>>) =>
    ({ initial: _i, animate: _a, transition: _t, ...rest }: Record<string, unknown>) =>
      <Component {...rest} />,
}))

const renderCard = (props: Parameters<typeof ChainCard>[0]) =>
  render(
    <ChakraProvider theme={theme}>
      <ChainCard {...props} />
    </ChakraProvider>
  )

describe('ChainCard', () => {
  it('renders Solana chain name, ticker and symbol', () => {
    renderCard({ chain: 'SOL', address: null, balance: null })
    expect(screen.getByText('Solana')).toBeInTheDocument()
    expect(screen.getByText('SOL')).toBeInTheDocument()
    expect(screen.getByText('◎')).toBeInTheDocument()
  })

  it('renders Ethereum chain info', () => {
    renderCard({ chain: 'ETH', address: null, balance: null })
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('renders Bitcoin chain info', () => {
    renderCard({ chain: 'BTC', address: null, balance: null })
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('shows Connect button when no address and isAvailable=true', () => {
    const onConnect = vi.fn()
    renderCard({ chain: 'SOL', address: null, balance: null, isAvailable: true, onConnect })
    expect(screen.getByText('Connect Solana')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Connect Solana'))
    expect(onConnect).toHaveBeenCalledOnce()
  })

  it('shows "Not available" when isAvailable is false', () => {
    renderCard({ chain: 'BTC', address: null, balance: null, isAvailable: false })
    expect(screen.getByText('Not available')).toBeInTheDocument()
  })

  it('shows truncated address badge when connected', () => {
    renderCard({ chain: 'ETH', address: '0x1234567890abcdefABCD1234567890abcdefABCD', balance: 1.5 })
    expect(screen.getByText(/0x12345678/)).toBeInTheDocument()
  })

  it('shows Disconnect button when connected with onDisconnect handler', () => {
    const onDisconnect = vi.fn()
    renderCard({
      chain: 'ETH',
      address: '0x1234567890abcdefABCD1234567890abcdefABCD',
      balance: 0,
      onDisconnect,
    })
    const btn = screen.getByText('Disconnect')
    fireEvent.click(btn)
    expect(onDisconnect).toHaveBeenCalledOnce()
  })

  it('does not show Disconnect button when no onDisconnect handler provided', () => {
    renderCard({ chain: 'ETH', address: '0x1234567890abcdef', balance: 0 })
    expect(screen.queryByText('Disconnect')).not.toBeInTheDocument()
  })

  it('shows loading skeleton and hides AnimatedBalance when isLoading is true', () => {
    renderCard({ chain: 'BTC', address: 'bc1qpayment', balance: null, isLoading: true })
    expect(screen.queryByTestId('animated-balance')).not.toBeInTheDocument()
  })

  it('shows "Not connected" when no address', () => {
    renderCard({ chain: 'SOL', address: null, balance: null })
    expect(screen.getByText('Not connected')).toBeInTheDocument()
  })
})
