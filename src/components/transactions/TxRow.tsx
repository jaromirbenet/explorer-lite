import { Badge, Box, Flex, Link, Text } from '@chakra-ui/react'

export interface TxRowProps {
  hash: string
  date?: string
  status?: 'confirmed' | 'failed' | 'pending'
  amount?: string
  explorerUrl: string
  accentColor: string
}

export const TxRow = ({ hash, date, status, amount, explorerUrl, accentColor }: TxRowProps) => (
  <Flex
    layerStyle="row"
    align="center"
    justify="space-between"
    py={2.5}
    px={3}
    _hover={{ borderColor: accentColor + '44', bg: 'brand.bgHover' }}
    gap={3}
  >
    <Box flex={1} minW={0}>
      <Link
        href={explorerUrl}
        isExternal
        fontSize="xs"
        fontFamily="mono"
        color={accentColor}
        _hover={{ color: 'white' }}
        isTruncated
        display="block"
      >
        {hash.slice(0, 12)}…{hash.slice(-8)}
      </Link>
      {date && (
        <Text fontSize="2xs" color="brand.textMuted" mt={0.5}>{date}</Text>
      )}
    </Box>
    <Flex align="center" gap={2} flexShrink={0}>
      {amount && (
        <Text fontSize="xs" color="brand.textSubtle">{amount}</Text>
      )}
      {status && (
        <Badge
          fontSize="2xs"
          colorScheme={status === 'confirmed' ? 'green' : status === 'failed' ? 'red' : 'yellow'}
          borderRadius="full"
          px={2}
          variant="subtle"
        >
          {status}
        </Badge>
      )}
    </Flex>
  </Flex>
)
