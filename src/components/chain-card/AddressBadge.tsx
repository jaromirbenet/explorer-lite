import { Flex, HStack, IconButton, Text, Tooltip, useClipboard } from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'

interface AddressBadgeProps {
  address: string
  explorerUrl?: string
  accentColor?: string
}

export const AddressBadge = ({ address, explorerUrl, accentColor = '#7878a0' }: AddressBadgeProps) => {
  const { hasCopied, onCopy } = useClipboard(address)

  const short = `${address.slice(0, 10)}…${address.slice(-8)}`

  return (
    <Flex
      align="center"
      bg="brand.bg"
      borderRadius="lg"
      px={3}
      py={1.5}
      gap={2}
      border="1px solid"
      borderColor="brand.borderStrong"
    >
      <HStack flex={1} minW={0} spacing={0}>
        <Text
          fontSize="xs"
          fontFamily="mono"
          color="brand.textSubtle"
          isTruncated
          title={address}
          cursor={explorerUrl ? 'pointer' : 'default'}
          onClick={explorerUrl ? () => window.open(explorerUrl, '_blank') : undefined}
          _hover={explorerUrl ? { color: accentColor } : {}}
          transition="color 0.15s"
        >
          {short}
        </Text>
      </HStack>
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} placement="top" hasArrow>
        <IconButton
          aria-label="Copy address"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          size="xs"
          variant="ghost"
          onClick={onCopy}
          color={hasCopied ? 'green.400' : 'brand.textMuted'}
          _hover={{ color: 'brand.textSubtle', bg: 'brand.border' }}
          minW={5}
          h={5}
        />
      </Tooltip>
    </Flex>
  )
}
