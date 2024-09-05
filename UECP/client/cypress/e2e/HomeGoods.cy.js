describe('When Home Goods category is clicked', () => {
  it('should load filters for Home Goods category', () => {
    cy.visit('/')
    cy.get('a').contains('Home Goods').click()
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}filtering`)
  })
})