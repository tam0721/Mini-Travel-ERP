describe("Booking API", () => {
    it("rejects requests without token", () => {
        cy.request({
            method: "GET",
            url: `${Cypress.expose("apiUrl")}/bookings`,
            failOnStatusCode: false,
        }).its("status").should("eq", 401);
    });

    it("returns 200 with valid token", () => {
        cy.fixture("users").then((u) => {
        cy.request("POST", `${Cypress.expose("apiUrl")}/auth/login`, {
            email: u.admin.email,
            password: u.admin.password,
        }).then((res) => {
            cy.request({
                method: "GET",
                url: `${Cypress.expose("apiUrl")}/bookings`,
                headers: { Authorization: `Bearer ${res.body.data.accessToken}` },
            }).its("status").should("eq", 200);
        });
        });
    });
});