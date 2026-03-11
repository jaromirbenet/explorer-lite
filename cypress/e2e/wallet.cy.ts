describe('Explorer Lite E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the page successfully', () => {
    cy.contains('Explorer').should('be.visible')
  })

  it('shows header with logo and title', () => {
    cy.contains('Explorer').should('be.visible')
    cy.get('img[alt="Explorer Logo"]').should('be.visible')
  })

  it('displays wallet connect button with correct label', () => {
    cy.get('[data-testid="wallet-connect-btn"]').should('be.visible')
    cy.get('[data-testid="wallet-connect-btn"]').should('contain', 'Connect Wallet')
  })

  it('wallet connect button is not disabled', () => {
    cy.get('[data-testid="wallet-connect-btn"]').should('not.be.disabled')
  })

  it('shows Solana chain card with connect button', () => {
    cy.contains('Solana').should('be.visible')
    cy.contains('Connect Solana').should('be.visible')
  })

  it('shows Ethereum chain card with connect button', () => {
    cy.contains('Ethereum').should('be.visible')
    cy.contains('Connect Ethereum').should('be.visible')
  })

  it('shows Bitcoin chain card', () => {
    cy.contains('Bitcoin').should('be.visible')
  })

  it('shows chain status dots in header', () => {
    cy.contains('SOL').should('be.visible')
    cy.contains('ETH').should('be.visible')
    cy.contains('BTC').should('be.visible')
  })

  it('switching to ETH transactions tab shows connect prompt', () => {
    cy.contains('Ξ ETH').click()
    cy.contains('Connect Ethereum wallet').should('be.visible')
  })

  it('switching to BTC transactions tab shows connect prompt', () => {
    cy.contains('₿ BTC').click()
    cy.contains('Connect Bitcoin wallet').should('be.visible')
  })
})
