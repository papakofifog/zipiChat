const { IdTokenClient } = require("google-auth-library")

context("GET /register a new user", ()=>{
    it("register a user", () => {
        cy.request("POST", "/api/login").then((response) => {
            expect(response.status).to.eq(200)
            expect(response.status).length.to.be.greaterThan(1)
        })
    })
})