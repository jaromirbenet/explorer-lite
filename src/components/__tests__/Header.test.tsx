import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { useWallet } from '@solana/wallet-adapter-react'

vi.mock('@solana/wallet-adapter-react')
vi.mock('../WalletConnectButton', () => ({
  WalletConnectButton: () => <button>Mock Connect Button</button>,
}))

const mockUseWallet = useWallet as ReturnType<typeof vi.fn>

describe('Header Component', () => {
  it('renders header with title', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
    })

    render(<Header />)

    expect(screen.getByText('Explorer')).toBeInTheDocument()
    expect(screen.getByText('Wallet Hub')).toBeInTheDocument()
  })

  it('renders wallet connect button', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
    })

    render(<Header />)

    expect(screen.getByText('Mock Connect Button')).toBeInTheDocument()
  })
})
