import { Box, Flex, HStack, Image, VStack, Text } from '@chakra-ui/react'
import { WalletConnectButton } from '../wallet/WalletConnectButton'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBitcoin } from '../../contexts/BitcoinContext'
import { useConnection } from 'wagmi'
import explorerLogo from '../../assets/explorer-logo.svg'
import { ChainDot } from './ChainDot'
import { CHAIN_CONFIGS } from '../chain-card/ChainCard'

export const Header = () => {
  const { connected } = useWallet()
  const { btcAddress } = useBitcoin()
  const { isConnected: ethConnected } = useConnection()

  return (
    <Box
      bg="brand.bg"
      borderBottom="1px solid"
      borderColor="brand.border"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex maxW="container.lg" mx="auto" justify="space-between" align="center" px={4} py={3} gap={4}>
        <Flex align="center" gap={3}>
          <Image src={explorerLogo} alt="Explorer Logo" w={9} h={9} />
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" lineHeight={1} color="brand.textPrimary">
              Explorer
            </Text>
            <Text fontSize="xs" color="brand.textMuted" lineHeight={1}>
              Wallet Hub
            </Text>
          </VStack>
        </Flex>

        <HStack spacing={4}>
          <HStack spacing={3} display={{ base: 'none', sm: 'flex' }}>
            <ChainDot connected={connected} color={CHAIN_CONFIGS.SOL.accentColor} label="SOL" />
            <ChainDot connected={!!ethConnected} color={CHAIN_CONFIGS.ETH.accentColor} label="ETH" />
            <ChainDot connected={!!btcAddress} color={CHAIN_CONFIGS.BTC.accentColor} label="BTC" />
          </HStack>
          <WalletConnectButton />
        </HStack>
      </Flex>
    </Box>
  )
}
