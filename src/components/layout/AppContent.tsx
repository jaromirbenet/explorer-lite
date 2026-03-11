import { Box, Container, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { ChainCards } from '../chain-card/ChainCards'
import { MultiChainTransactions } from '../transactions/MultiChainTransactions'

const MotionBox = motion(Box)

export const AppContent = () => {
  return (
    <Box
      minH="100vh"
      bg="brand.bg"
      color="brand.textPrimary"
    >
      <Header />
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <ChainCards />
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <MultiChainTransactions />
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}
