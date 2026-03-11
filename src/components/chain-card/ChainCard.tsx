import { Box, Button, Flex, Skeleton, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AnimatedBalance } from './AnimatedBalance'
import { AddressBadge } from './AddressBadge'

const MotionBox = motion(Box)

export interface ChainConfig {
  name: string
  symbol: string
  ticker: string
  accentColor: string
  accentLight: string
  explorerBase?: string
  decimals?: number
  gradient: string
  glowColor: string
}

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  SOL: {
    name: 'Solana',
    symbol: '◎',
    ticker: 'SOL',
    accentColor: '#9945FF',
    accentLight: '#c084fc',
    gradient: 'linear(135deg, #9945FF 0%, #19fb9b 100%)',
    glowColor: 'rgba(153,69,255,0.25)',
    explorerBase: 'https://solscan.io/account/',
    decimals: 4,
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'Ξ',
    ticker: 'ETH',
    accentColor: '#627EEA',
    accentLight: '#93a8f4',
    gradient: 'linear(135deg, #627EEA 0%, #A78BFA 100%)',
    glowColor: 'rgba(98,126,234,0.25)',
    explorerBase: 'https://etherscan.io/address/',
    decimals: 4,
  },
  BTC: {
    name: 'Bitcoin',
    symbol: '₿',
    ticker: 'BTC',
    accentColor: '#F7931A',
    accentLight: '#fbb44e',
    gradient: 'linear(135deg, #F7931A 0%, #FFD700 100%)',
    glowColor: 'rgba(247,147,26,0.25)',
    explorerBase: 'https://blockstream.info/address/',
    decimals: 6,
  },
}

interface ChainCardProps {
  chain: 'SOL' | 'ETH' | 'BTC'
  address: string | null
  balance: number | null
  isLoading?: boolean
  isConnecting?: boolean
  isAvailable?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  delay?: number
  children?: ReactNode
}

export const ChainCard = ({
  chain,
  address,
  balance,
  isLoading,
  isConnecting,
  isAvailable = true,
  onConnect,
  onDisconnect,
  delay = 0,
  children,
}: ChainCardProps) => {
  const config = CHAIN_CONFIGS[chain]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      flex={1}
      minW={{ base: '100%', md: '260px' }}
      maxW={{ base: '100%', md: '380px' }}
    >
      <Box
        layerStyle="card"
        overflow="hidden"
        _hover={{ borderColor: config.accentColor + '60' }}
        sx={{ transition: 'border-color 0.2s' }}
        h="100%"
      >
      {/* Top accent line */}
      <Box h="3px" bg={config.accentColor} />

      <VStack align="stretch" p={5} spacing={4}>
        {/* Chain header */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Flex
              w={9}
              h={9}
              borderRadius="lg"
              bg={config.accentColor + '22'}
              border="1px solid"
              borderColor={config.accentColor + '44'}
              align="center"
              justify="center"
              fontSize="lg"
              flexShrink={0}
              color={config.accentLight}
            >
              {config.symbol}
            </Flex>
            <Box>
              <Text fontWeight="bold" fontSize="md" color="brand.textPrimary" lineHeight={1.3}>
                {config.name}
              </Text>
              <Text fontSize="xs" color="brand.textMuted" lineHeight={1}>
                {config.ticker}
              </Text>
            </Box>
          </Flex>
          {onDisconnect && address && (
            <Button
              size="xs"
              variant="ghost"
              color="brand.textMuted"
              _hover={{ color: 'red.400', bg: 'red.900' }}
              onClick={onDisconnect}
              fontSize="2xs"
            >
              Disconnect
            </Button>
          )}
        </Flex>

        {/* Content */}
        {address ? (
          <>
            <Box>
              <Text textStyle="label" mb={1}>
                Address
              </Text>
              <AddressBadge
                address={address}
                explorerUrl={config.explorerBase ? `${config.explorerBase}${address}` : undefined}
                accentColor={config.accentColor}
              />
            </Box>

            <Box>
              <Text textStyle="label" mb={1}>
                Balance
              </Text>
              {isLoading ? (
                <Skeleton h="28px" w="160px" borderRadius="md" startColor="brand.border" endColor="brand.borderStrong" />
              ) : balance !== null ? (
                <AnimatedBalance
                  value={balance}
                  decimals={config.decimals ?? 4}
                  suffix={config.ticker}
                  fontSize="2xl"
                  color="brand.textPrimary"
                  suffixColor={config.accentLight}
                />
              ) : (
                <Text textStyle="muted">—</Text>
              )}
            </Box>

            {children}
          </>
        ) : (
          <Box py={3} textAlign="center">
            {!isAvailable ? (
              <Text textStyle="muted">
                Not available
              </Text>
            ) : (
              <VStack spacing={2}>
                <Text fontSize="xs" color="brand.textSecondary">
                  Not connected
                </Text>
                <Button
                  size="sm"
                  bg={config.accentColor}
                  color="white"
                  _hover={{ bg: config.accentLight, transform: 'translateY(-1px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  borderRadius="lg"
                  fontWeight="semibold"
                  isLoading={isConnecting}
                  loadingText="Connecting…"
                  onClick={onConnect}
                  px={6}
                  transition="all 0.15s"
                >
                  Connect {config.name}
                </Button>
              </VStack>
            )}
          </Box>
        )}
      </VStack>
      </Box>
    </MotionBox>
  )
}
