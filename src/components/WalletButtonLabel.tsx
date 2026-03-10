interface WalletButtonLabelProps {
  connecting: boolean
  connected: boolean
}

export const WalletButtonLabel = ({ connecting, connected }: WalletButtonLabelProps) => {
  if (connecting) {
    return <>Connecting...</>
  }

  if (connected) {
    return <>Disconnect</>
  }

  return <>Connect Wallet</>
}
