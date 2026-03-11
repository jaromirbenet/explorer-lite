import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { CHAIN_CONFIGS } from '../chain-card/ChainCard'
import { SolTransactions } from './SolTransactions'
import { EthTransactions } from './EthTransactions'
import { BtcTransactions } from './BtcTransactions'

export const MultiChainTransactions = () => {
  return (
    <Box
      layerStyle="card"
      overflow="hidden"
      w="100%"
    >
      <Tabs variant="unstyled">
        <Box px={4} pt={4} borderBottom="1px solid" borderColor="brand.border">
          <TabList gap={1}>
            {(['SOL', 'ETH', 'BTC'] as const).map((chain) => {
              const cfg = CHAIN_CONFIGS[chain]
              return (
                <Tab
                  key={chain}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.textMuted"
                  px={4}
                  py={2.5}
                  borderRadius="md"
                  _selected={{
                    color: cfg.accentLight,
                    bg: cfg.accentColor + '18',
                  }}
                  _hover={{ color: 'brand.textSubtle', bg: 'brand.border' }}
                  transition="all 0.15s"
                >
                  {cfg.symbol} {chain}
                </Tab>
              )
            })}
          </TabList>
        </Box>

        <TabPanels>
          <TabPanel p={4}><SolTransactions /></TabPanel>
          <TabPanel p={4}><EthTransactions /></TabPanel>
          <TabPanel p={4}><BtcTransactions /></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
