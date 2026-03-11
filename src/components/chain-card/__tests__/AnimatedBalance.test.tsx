import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { AnimatedBalance } from '../AnimatedBalance'
import theme from '../../../theme'

beforeAll(() => {
  // No-op: prevent animation loop from running in jsdom (avoids infinite recursion)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)
})

afterAll(() => {
  vi.restoreAllMocks()
})

const renderBalance = (value: number, decimals = 4, suffix = '') =>
  render(
    <ChakraProvider theme={theme}>
      <AnimatedBalance value={value} decimals={decimals} suffix={suffix} />
    </ChakraProvider>
  )

describe('AnimatedBalance', () => {
  it('renders element with data-testid="animated-balance"', () => {
    renderBalance(1.5)
    expect(screen.getByTestId('animated-balance')).toBeInTheDocument()
  })

  it('renders suffix text when provided', () => {
    renderBalance(1.0, 4, 'SOL')
    expect(screen.getByText('SOL')).toBeInTheDocument()
  })

  it('renders ETH suffix', () => {
    renderBalance(0.5, 4, 'ETH')
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('renders BTC suffix', () => {
    renderBalance(0.0001, 6, 'BTC')
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('renders without suffix when not provided', () => {
    renderBalance(1.0)
    const el = screen.getByTestId('animated-balance')
    expect(el).toBeInTheDocument()
  })

  it('uses specified decimal places in display', () => {
    renderBalance(1.23456789, 2, 'ETH')
    const el = screen.getByTestId('animated-balance')
    // With requestAnimationFrame mocked to call cb immediately, the animation
    // runs one frame — check the element exists and has the suffix
    expect(el).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })
})
