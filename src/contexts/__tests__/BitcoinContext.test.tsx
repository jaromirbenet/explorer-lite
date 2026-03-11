import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BitcoinProvider, useBitcoin } from '../BitcoinContext'

const TestConsumer = () => {
  const { btcAddress, btcAddressType, isBtcAvailable, connectBtc, disconnectBtc, btcConnecting } = useBitcoin()
  return (
    <div>
      <span data-testid="address">{btcAddress ?? 'null'}</span>
      <span data-testid="addressType">{btcAddressType ?? 'null'}</span>
      <span data-testid="available">{String(isBtcAvailable)}</span>
      <span data-testid="connecting">{String(btcConnecting)}</span>
      <button onClick={() => connectBtc()}>Connect</button>
      <button onClick={disconnectBtc}>Disconnect</button>
    </div>
  )
}

const renderWithProvider = () =>
  render(
    <BitcoinProvider>
      <TestConsumer />
    </BitcoinProvider>
  )

describe('BitcoinContext', () => {
  beforeEach(() => {
    delete (window as { phantom?: unknown }).phantom
  })

  afterEach(() => {
    delete (window as { phantom?: unknown }).phantom
  })

  it('isBtcAvailable is false when window.phantom is undefined', () => {
    renderWithProvider()
    expect(screen.getByTestId('available').textContent).toBe('false')
  })

  it('isBtcAvailable is true when window.phantom.bitcoin exists', () => {
    ;(window as { phantom?: unknown }).phantom = { bitcoin: { requestAccounts: vi.fn() } }
    renderWithProvider()
    expect(screen.getByTestId('available').textContent).toBe('true')
  })

  it('connectBtc stores the payment account address and addressType', async () => {
    const mockAccounts = [
      { address: 'bc1qordinals', addressType: 'p2tr', publicKey: 'pub2', purpose: 'ordinals' },
      { address: 'bc1qpayment', addressType: 'p2wpkh', publicKey: 'pub1', purpose: 'payment' },
    ]
    ;(window as { phantom?: unknown }).phantom = {
      bitcoin: { requestAccounts: vi.fn().mockResolvedValue(mockAccounts) },
    }
    renderWithProvider()

    fireEvent.click(screen.getByText('Connect'))

    await waitFor(() => expect(screen.getByTestId('address').textContent).toBe('bc1qpayment'))
    expect(screen.getByTestId('addressType').textContent).toBe('p2wpkh')
  })

  it('falls back to first account when no payment account exists', async () => {
    const mockAccounts = [
      { address: 'bc1qfirst', addressType: 'p2tr', publicKey: 'pub1', purpose: 'ordinals' },
    ]
    ;(window as { phantom?: unknown }).phantom = {
      bitcoin: { requestAccounts: vi.fn().mockResolvedValue(mockAccounts) },
    }
    renderWithProvider()

    fireEvent.click(screen.getByText('Connect'))

    await waitFor(() => expect(screen.getByTestId('address').textContent).toBe('bc1qfirst'))
    expect(screen.getByTestId('addressType').textContent).toBe('p2tr')
  })

  it('disconnectBtc clears address and addressType', async () => {
    const mockAccounts = [
      { address: 'bc1qpayment', addressType: 'p2wpkh', publicKey: 'pub1', purpose: 'payment' },
    ]
    ;(window as { phantom?: unknown }).phantom = {
      bitcoin: { requestAccounts: vi.fn().mockResolvedValue(mockAccounts) },
    }
    renderWithProvider()

    fireEvent.click(screen.getByText('Connect'))
    await waitFor(() => expect(screen.getByTestId('address').textContent).toBe('bc1qpayment'))

    fireEvent.click(screen.getByText('Disconnect'))
    expect(screen.getByTestId('address').textContent).toBe('null')
    expect(screen.getByTestId('addressType').textContent).toBe('null')
  })

  it('handles connectBtc error gracefully, leaving address null', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(window as { phantom?: unknown }).phantom = {
      bitcoin: { requestAccounts: vi.fn().mockRejectedValue(new Error('User rejected')) },
    }
    renderWithProvider()

    fireEvent.click(screen.getByText('Connect'))

    await waitFor(() => expect(screen.getByTestId('connecting').textContent).toBe('false'))
    expect(screen.getByTestId('address').textContent).toBe('null')
    consoleSpy.mockRestore()
  })
})
