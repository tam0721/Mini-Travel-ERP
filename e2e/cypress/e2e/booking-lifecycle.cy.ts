describe("Booking lifecycle", () => {
    before(() => cy.task("db:seed"));
    it("SALES creates a booking", () => {
        cy.loginAs("sales");
        cy.visit("/bookings");
        cy.dataCy("booking-create").click();
        cy.dataCy("booking-customerName").type("Nguyen Van A");
        cy.dataCy("booking-customerPhone").type("0901234567");
        cy.dataCy("booking-customerEmail").type("nguyenvana@test.com");
        cy.dataCy("booking-tourName").type("Tour Da Lat");
        cy.get("#travelDate").type("20/12/2026{enter}");
        cy.get("#totalPrice").type("5000000");
        cy.dataCy("booking-submit").click();
        cy.contains("Nguyen Van A").should("be.visible");
    });
});
