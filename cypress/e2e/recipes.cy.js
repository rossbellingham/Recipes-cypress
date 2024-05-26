describe('Recipe app', () => {
    beforeEach(() => {
      cy.visit('/')
    })

  it('Populates with recipes on initial load', () => {
    cy.get('#mealList').should('be.visible.and.have.length', 1) //checking parent div is visible and only one exists
    cy.get('#mealList').children().should('have.length.least', 1) //checking parent div has multiple children
    cy.get('.meal-item').first().find('h3').should('contain.text', 'Chicken') //asserting on h3 of first .meal-item div to contain text
    cy.get('.meal-item').eq(1).children().should('contain.text', 'Chicken') //asserting child elements inside second .meal-item div to contain text (The img alt prop contains the text, which is why the assertion on that child element is satisfied)
  })

  it('Loads images for recipes', () => {
    cy.get('#mealList').should('be.visible.and.have.length', 1)
    cy.get('#mealList').children().should('have.length.least', 1)
    cy.get('.meal-item').first().find('img').should('contain.prop', 'src') //checking <img> has appropriate properties
    cy.get('.meal-item').first().find('img').should('contain.prop', 'alt')
    cy.get('.meal-item').first().find('img').should('be.visible') //checking <img> is visible, with previous properties supplied we can be certain it shows an image
    cy.get('.meal-item').nextAll().find('img').should('contain.prop', 'src')
    cy.get('.meal-item').nextAll().find('img').should('contain.prop', 'alt')
    cy.get('.meal-item').nextAll().find('img').should('be.visible') //checking <img> elements for all meal-items on page
  })

  it('Searches for recipes with text in search box', () => {

    const ingredient = 'beef'

    cy.get('#searchInput').clear().type(`${ingredient}{enter}`) //sometimes this can fail, and not press enter
    cy.get('#mealList').should('be.visible.and.have.length', 1) 
    cy.get('#mealList').children().should('have.length.least', 1) 
    cy.get('.meal-item').first().find('img').click() //clicking first returned recipe card
    cy.get('.modal-container').should('be.visible') //clicking image presents a modal with recipe instructions
    cy.get('.recipe-instruct').should('contain.text', ingredient) //asserting the modal contains the term that was searched
  })

  it('Displays correct text when no recipes found', () => {
    cy.get('#searchInput').clear().type('prawn{enter}')
    cy.get('#mealList').children().should('have.length', 1) //checking that there is only one element in the meal list
    cy.get('#mealList').find('div').should('have.length', 0) //making sure none of those are <div> elements
    cy.get('#mealList').find('p').should('contain.text','No meals found. Try another ingredient.') //asserting the correct error message is displayed within <p> tag
  })

  it('Displays correct modal for the recipe clicked', () => {
    cy.get('#searchInput').clear().type('noodles{enter}')
    cy.get('#mealList').should('be.visible.and.have.length', 1) 
    cy.get('#mealList').children().should('have.length.least', 1) 
    cy.get('.meal-item').first().find('h3').then(($cardTitle) => {

      const cardTitle = $cardTitle.text() //storing the recipe title from the <h3> element

      cy.get('.meal-item').first().find('img').click()
      cy.get('.modal-container').should('be.visible') //displaying the modal so that we can check the titles match
      cy.get('.recipe-title').then(($modalTitle) => {

        const modalTitle = $modalTitle.text() //storing modal title
        expect(cardTitle).to.eq(modalTitle) //asserting the title from the modal and parent meal-item match
      })
    })
  })

  it('Provides a link on the video tutorial button', () => {
    cy.get('#searchInput').clear().type('noodles{enter}')
    cy.get('#mealList').should('be.visible.and.have.length', 1) 
    cy.get('#mealList').children().should('have.length.least', 1)
    cy.get('.meal-item').first().find('img').click()
    cy.get('.modal-container').should('be.visible')
    cy.get('.recipe-video').find('a').should('have.attr', 'href') //aserting the <a> tag has a href attribute
  })

  it('closes modal on clicking correct element', () => {
    cy.get('#searchInput').clear().type('noodles{enter}')
    cy.get('#mealList').should('be.visible.and.have.length', 1) 
    cy.get('#mealList').children().should('have.length.least', 1)
    cy.get('.meal-item').first().find('img').click()
    cy.get('.modal-container').should('be.visible')
    cy.get('.close-button').click() //clicking the close button on displayed modal
    cy.get('.modal-container').should('not.be.visible') //asserting the modal is hidden
  })
})