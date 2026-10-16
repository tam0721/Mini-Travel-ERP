describe("Auth", () => {
    before(() => {
        cy.task("db:seed");
    });
    
    beforeEach(() => cy.visit("/login"));

    it("logs in with valid credentials", () => {
        cy.fixture("users").then((u) => {
            cy.dataCy("login-email").type(u.admin.email);
            cy.dataCy("login-password").type(u.admin.password, { log: false });
            cy.dataCy("login-submit").click();
            cy.url().should("not.include", "/login");
        });
    });

    it("shows error with wrong password", () => {
        cy.dataCy("login-email").type("admin@test.com");
        cy.dataCy("login-password").type("wrong-password");
        cy.dataCy("login-submit").click();
        cy.url().should("include", "/login");
    });
});