import { createContext, useContext, useState, type ReactNode } from 'react'

export interface PhantomBitcoinAccount {
  address: string
  addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh'
  publicKey: string
  purpose: 'payment' | 'ordinals'
}

interface PhantomBtcProvider {
  requestAccounts: () => Promise<PhantomBitcoinAccount[]>
}

declare global {
  interface Window {
    phantom?: {
      ethereum?: Record<string, unknown>
      bitcoin?: PhantomBtcProvider
    }
  }
}

interface BitcoinState {
  btcAddress: string | null
  btcAddressType: string | null
  connectBtc: () => Promise<void>
  disconnectBtc: () => void
  isBtcAvailable: boolean
  btcConnecting: boolean
}

const BitcoinContext = createContext<BitcoinState>({
  btcAddress: null,
  btcAddressType: null,
  connectBtc: async () => {},
  disconnectBtc: () => {},
  isBtcAvailable: false,
  btcConnecting: false,
})

export const BitcoinProvider = ({ children }: { children: ReactNode }) => {
  const [btcAddress, setBtcAddress] = useState<string | null>(null)
  const [btcAddressType, setBtcAddressType] = useState<string | null>(null)
  const [btcConnecting, setBtcConnecting] = useState(false)

  const isBtcAvailable = typeof window !== 'undefined' && !!window.phantom?.bitcoin

  const connectBtc = async () => {
    const provider = window.phantom?.bitcoin
    if (!provider) return
    setBtcConnecting(true)
    try {
      const accounts = await provider.requestAccounts()
      const paymentAccount = accounts.find((a) => a.purpose === 'payment') ?? accounts[0]
      if (paymentAccount) {
        setBtcAddress(paymentAccount.address)
        setBtcAddressType(paymentAccount.addressType)
      }
    } catch (e) {
      console.error('BTC connect failed:', e)
    } finally {
      setBtcConnecting(false)
    }
  }

  const disconnectBtc = () => {
    setBtcAddress(null)
    setBtcAddressType(null)
  }

  return (
    <BitcoinContext.Provider
      value={{ btcAddress, btcAddressType, connectBtc, disconnectBtc, isBtcAvailable, btcConnecting }}
    >
      {children}
    </BitcoinContext.Provider>
  )
}

export const useBitcoin = () => useContext(BitcoinContext)
