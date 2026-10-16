type Role = "admin" | "sales" | "operator";

declare global {
    namespace Cypress {
        interface Chainable {
            loginAs(role: Role): Chainable<void>;
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;
        }
    }
}

Cypress.Commands.add("dataCy", (value: string) => {
    return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add("loginAs", (role: Role) => {
    cy.session(
        role,
        () => {
            cy.fixture("users").then((users) => {
                cy.request("POST", `${Cypress.expose("apiUrl")}/auth/login`, {
                    email: users[role].email,
                    password: users[role].password,
                }).then((res) => {
                    window.localStorage.setItem("accessToken", res.body.data?.accessToken);
                });
            });
        },
        {
            validate() {
                const token = window.localStorage.getItem("accessToken");
                if (!token) throw new Error("No token found in localStorage");
                cy.request({
                    method: "GET",
                    url: `${Cypress.expose("apiUrl")}/auth/profile`,
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        }
    );
});

export {};