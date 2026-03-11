import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { AddressBadge } from '../AddressBadge'
import theme from '../../../theme'

const { mockOnCopy } = vi.hoisted(() => ({ mockOnCopy: vi.fn() }))

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react') as object
  return {
    ...actual,
    useClipboard: (_value: string) => ({ hasCopied: false, onCopy: mockOnCopy }),
  }
})

const renderBadge = (address: string, explorerUrl?: string) =>
  render(
    <ChakraProvider theme={theme}>
      <AddressBadge address={address} explorerUrl={explorerUrl} />
    </ChakraProvider>
  )

const FULL_ADDRESS = '0x1234567890abcdefABCDEFGH12345678'

describe('AddressBadge', () => {
  it('displays truncated address (first 10 + last 8 chars)', () => {
    renderBadge(FULL_ADDRESS)
    const short = `${FULL_ADDRESS.slice(0, 10)}…${FULL_ADDRESS.slice(-8)}`
    expect(screen.getByText(short)).toBeInTheDocument()
  })

  it('renders copy address button', () => {
    renderBadge(FULL_ADDRESS)
    expect(screen.getByLabelText('Copy address')).toBeInTheDocument()
  })

  it('calls onCopy when copy button is clicked', () => {
    renderBadge(FULL_ADDRESS)
    fireEvent.click(screen.getByLabelText('Copy address'))
    expect(mockOnCopy).toHaveBeenCalledOnce()
  })

  it('works without explorerUrl', () => {
    renderBadge(FULL_ADDRESS)
    expect(screen.getByText(`${FULL_ADDRESS.slice(0, 10)}…${FULL_ADDRESS.slice(-8)}`)).toBeInTheDocument()
  })

  it('title attribute contains the full address', () => {
    renderBadge(FULL_ADDRESS)
    const addressText = screen.getByText(`${FULL_ADDRESS.slice(0, 10)}…${FULL_ADDRESS.slice(-8)}`)
    expect(addressText).toHaveAttribute('title', FULL_ADDRESS)
  })
})
