var domain = "//localhost:5500";

describe('load page', () => {
  it('passes', () => {
    cy.visit(`${domain}`);
  })
})

describe('hello world', () => {
  it('passes', () => {
    cy.visit(`${domain}`);
    cy.get("#clear").click();
    cy.get('#codearea').type('++++++++++[>+++++++>++++++++++>+++<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.');
    cy.get('#run').click();
    cy.get('#result').should('have.text', 'Hello World!');
  })
})

describe('basic input', () => {
  it('passes', () => {
    cy.visit(`${domain}`);
    cy.get("#clear").click();
    cy.get('#codearea').type(',.');
    cy.window().then(function(prompt) {
      cy.stub(prompt, "prompt").returns("97");
    });
    cy.get('#run').click();
    cy.get('#result').should('have.text', 'a');
  })
})

describe('unmatched bracket', () => {
  it('passes', () => {
    cy.visit(`${domain}`);
    cy.get("#clear").click();
    cy.get('#codearea').type('++++[++++<>+');
    cy.get('#run').click();
    cy.on('uncaught:exception', (err, runnable) => { return false;});
    cy.get('#result').should('have.text', 'SYNTAX ERROR: Unmatched bracket at position 12');
  })
})
