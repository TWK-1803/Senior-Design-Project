describe('When visiting the site and clicking on New Product', () => {
  it('should open a modal with input fields', () => {
    cy.visit('/')
    cy.get('.btn').contains("New Product").click()
    cy.get('.modal-body').should('be.visible')
  })
})