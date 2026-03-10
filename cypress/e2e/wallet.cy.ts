describe('Explorer Lite E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the page successfully', () => {
    cy.contains('Explorer').should('be.visible')
  })

  it('displays connect wallet button', () => {
    cy.get('[data-testid="wallet-connect-btn"]').should('be.visible')
    cy.get('[data-testid="wallet-connect-btn"]').should('contain', 'Connect Wallet')
  })

  it('shows disconnect message when wallet not connected', () => {
    cy.contains('Connect your wallet to view account information').should('be.visible')
    cy.contains('Connect your wallet to view transactions').should('be.visible')
  })

  it('page has correct title', () => {
    cy.contains('Explorer').should('be.visible')
    cy.contains('Wallet Hub').should('be.visible')
  })

  it('button is not disabled', () => {
    cy.get('[data-testid="wallet-connect-btn"]').should('not.be.disabled')
  })

  it('shows header with title', () => {
    cy.contains('Explorer').should('be.visible')
    cy.get('img[alt="Explorer Logo"]').should('be.visible')
  })
})
