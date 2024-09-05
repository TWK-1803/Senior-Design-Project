describe('When hovering over your user name on the top right', () => {
  it('should show a dropdown menu with different options', () => {
      cy.visit('/')
      cy.get('.dropdown-content').then($el => {
      cy.wrap($el).invoke('show').should('be.visible')
    })
  })
})