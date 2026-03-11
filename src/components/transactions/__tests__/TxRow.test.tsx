import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { TxRow } from '../TxRow'
import theme from '../../../theme'

const HASH = 'abc1234567890123456789xyz'
const EXPLORER_URL = `https://solscan.io/tx/${HASH}`

const renderRow = (props: Partial<Parameters<typeof TxRow>[0]> = {}) =>
  render(
    <ChakraProvider theme={theme}>
      <TxRow
        hash={HASH}
        explorerUrl={EXPLORER_URL}
        accentColor="#9945FF"
        {...props}
      />
    </ChakraProvider>
  )

describe('TxRow', () => {
  it('displays first 12 characters of hash', () => {
    renderRow()
    expect(screen.getByText(/abc123456789/)).toBeInTheDocument()
  })

  it('displays last 8 characters of hash', () => {
    renderRow()
    expect(screen.getByText(/789xyz/)).toBeInTheDocument()
  })

  it('shows date when provided', () => {
    renderRow({ date: '2024-01-15' })
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('does not show date when not provided', () => {
    renderRow()
    expect(screen.queryByText(/2024/)).not.toBeInTheDocument()
  })

  it('shows amount when provided', () => {
    renderRow({ amount: '+1.5 SOL' })
    expect(screen.getByText('+1.5 SOL')).toBeInTheDocument()
  })

  it('does not show amount when not provided', () => {
    renderRow()
    expect(screen.queryByText(/SOL/)).not.toBeInTheDocument()
  })

  it('shows confirmed badge', () => {
    renderRow({ status: 'confirmed' })
    expect(screen.getByText('confirmed')).toBeInTheDocument()
  })

  it('shows failed badge', () => {
    renderRow({ status: 'failed' })
    expect(screen.getByText('failed')).toBeInTheDocument()
  })

  it('shows pending badge', () => {
    renderRow({ status: 'pending' })
    expect(screen.getByText('pending')).toBeInTheDocument()
  })

  it('does not show badge when status is not provided', () => {
    renderRow()
    expect(screen.queryByText('confirmed')).not.toBeInTheDocument()
    expect(screen.queryByText('failed')).not.toBeInTheDocument()
    expect(screen.queryByText('pending')).not.toBeInTheDocument()
  })

  it('has correct explorer link href', () => {
    renderRow()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', EXPLORER_URL)
  })

  it('explorer link opens in new tab', () => {
    renderRow()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
