import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import type { Mock } from 'vitest'
import { WalletConnectButton } from '../WalletConnectButton'
import theme from '../../../theme'

vi.mock('@solana/wallet-adapter-react', () => ({ useWallet: vi.fn() }))
vi.mock('@solana/wallet-adapter-react-ui', () => ({ useWalletModal: vi.fn() }))
vi.mock('../../../contexts/BitcoinContext', () => ({ useBitcoin: vi.fn() }))

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useBitcoin } from '../../../contexts/BitcoinContext'

const mockUseWallet = useWallet as Mock
const mockUseWalletModal = useWalletModal as Mock
const mockUseBitcoin = useBitcoin as Mock

const renderButton = () =>
  render(
    <ChakraProvider theme={theme}>
      <WalletConnectButton />
    </ChakraProvider>
  )

describe('WalletConnectButton', () => {
  const setVisible = vi.fn()
  const disconnect = vi.fn().mockResolvedValue(undefined)
  const connect = vi.fn().mockResolvedValue(undefined)
  const disconnectBtc = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWallet.mockReturnValue({ wallet: null, connect, disconnect, connecting: false, connected: false })
    mockUseWalletModal.mockReturnValue({ setVisible })
    mockUseBitcoin.mockReturnValue({ disconnectBtc })
  })

  it('renders the wallet connect button', () => {
    renderButton()
    expect(screen.getByTestId('wallet-connect-btn')).toBeInTheDocument()
  })

  it('shows "Connect Wallet" label when not connected', () => {
    renderButton()
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('opens wallet modal when no wallet is selected', () => {
    renderButton()
    fireEvent.click(screen.getByTestId('wallet-connect-btn'))
    expect(setVisible).toHaveBeenCalledWith(true)
  })

  it('calls connect when wallet is selected but not yet connected', () => {
    mockUseWallet.mockReturnValue({
      wallet: { adapter: { name: 'Phantom' } },
      connect,
      disconnect,
      connecting: false,
      connected: false,
    })
    renderButton()
    fireEvent.click(screen.getByTestId('wallet-connect-btn'))
    expect(connect).toHaveBeenCalledOnce()
  })

  it('calls disconnect and disconnectBtc when wallet is connected', () => {
    mockUseWallet.mockReturnValue({
      wallet: { adapter: { name: 'Phantom' } },
      connect,
      disconnect,
      connecting: false,
      connected: true,
    })
    renderButton()
    fireEvent.click(screen.getByTestId('wallet-connect-btn'))
    expect(disconnectBtc).toHaveBeenCalledOnce()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('shows "Disconnect" label when connected', () => {
    mockUseWallet.mockReturnValue({
      wallet: { adapter: { name: 'Phantom' } },
      connect,
      disconnect,
      connecting: false,
      connected: true,
    })
    renderButton()
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
  })

  it('does not open modal when wallet is already selected', () => {
    mockUseWallet.mockReturnValue({
      wallet: { adapter: { name: 'Phantom' } },
      connect,
      disconnect,
      connecting: false,
      connected: false,
    })
    renderButton()
    fireEvent.click(screen.getByTestId('wallet-connect-btn'))
    expect(setVisible).not.toHaveBeenCalled()
  })
})
