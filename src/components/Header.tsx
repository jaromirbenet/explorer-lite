import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { WalletConnectButton } from './WalletConnectButton'
import explorerLogo from '../assets/explorer-logo.svg'

export const Header = () => {
  return (
    <Box bg="gray.800" py={4} borderBottom="1px solid" borderColor="gray.700">
      <Flex maxW="container.lg" mx="auto" justifyContent="space-between" alignItems="center" px={4} gap={4}>
        <Flex alignItems="center" gap={3}>
          <Image src={explorerLogo} alt="Explorer Logo" w={12} h={12} />
          <VStack align="start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" lineHeight={1}>
              Explorer
            </Text>
            <Text fontSize="sm" color="gray.400" lineHeight={1}>
              Wallet Hub
            </Text>
          </VStack>
        </Flex>
        <WalletConnectButton />
      </Flex>
    </Box>
  )
}
