import { Button } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useBitcoin } from '../../contexts/BitcoinContext'
import { WalletButtonLabel } from './WalletButtonLabel'

export const WalletConnectButton = () => {
  const { wallet, connect, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { disconnectBtc } = useBitcoin()

  const handleClick = async () => {
    if (!wallet) {
      setVisible(true)
    } else if (connected) {
      disconnectBtc()
      await disconnect()
    } else {
      await connect()
    }
  }

  return (
    <Button
      onClick={handleClick}
      isLoading={connecting}
      colorScheme={connected ? 'green' : 'blue'}
      size="sm"
      borderRadius="xl"
      fontWeight="semibold"
      data-testid="wallet-connect-btn"
    >
      <WalletButtonLabel connecting={connecting} connected={connected} />
    </Button>
  )
}
