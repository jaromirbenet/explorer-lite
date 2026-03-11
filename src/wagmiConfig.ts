import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Targets Phantom's Ethereum provider specifically.
// shimDisconnect: true ensures disconnect state persists across reloads.
const phantomEthConnector = injected({
  shimDisconnect: true,
  target: () => ({
    id: 'phantom',
    name: 'Phantom',
    provider: () => window.phantom?.ethereum as never,
  }),
})

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [phantomEthConnector],
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
})
