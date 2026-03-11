import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletButtonLabel } from '../WalletButtonLabel'

describe('WalletButtonLabel', () => {
  it('shows "Connecting..." when connecting', () => {
    render(<WalletButtonLabel connecting={true} connected={false} />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('shows "Disconnect" when connected and not connecting', () => {
    render(<WalletButtonLabel connecting={false} connected={true} />)
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
  })

  it('shows "Connect Wallet" when neither connecting nor connected', () => {
    render(<WalletButtonLabel connecting={false} connected={false} />)
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('connecting state takes priority over connected state', () => {
    render(<WalletButtonLabel connecting={true} connected={true} />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
    expect(screen.queryByText('Disconnect')).not.toBeInTheDocument()
  })
})
