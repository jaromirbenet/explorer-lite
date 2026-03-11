import { Box, HStack, Text } from '@chakra-ui/react'

export const ChainDot = ({ connected, color, label }: { connected: boolean; color: string; label: string }) => (
  <HStack spacing={1.5}>
    <Box
      w="7px"
      h="7px"
      borderRadius="full"
      bg={connected ? color : 'brand.borderStrong'}
      boxShadow={connected ? `0 0 6px ${color}88` : 'none'}
      transition="all 0.3s"
    />
    <Text fontSize="xs" color={connected ? 'brand.textSubtle' : 'brand.inactive'} transition="color 0.3s">
      {label}
    </Text>
  </HStack>
)
