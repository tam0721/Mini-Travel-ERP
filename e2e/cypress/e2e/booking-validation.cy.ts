describe("Booking Form - Validation", () => {
    beforeEach(() => {
        cy.loginAs("sales");
        cy.visit("/bookings/new");
    });

    it("báo lỗi khi bỏ trống toàn bộ các trường bắt buộc", () => {
        cy.dataCy("booking-submit").click();
        cy.url().should("include", "/bookings/new");
        cy.contains("Customer full name is required").should("be.visible");
        cy.contains("Customer phone is required").should("be.visible");
        cy.contains("Customer email is required").should("be.visible");
        cy.contains("Tour name is required").should("be.visible");
        cy.contains("Travel date is required").should("be.visible");
        cy.contains("Total price is required").should("be.visible");
    });

    it("báo lỗi khi thiếu ngày khởi hành (travelDate)", () => {
        cy.dataCy("booking-customerName").type("Tran Van B");
        cy.dataCy("booking-customerPhone").type("0912345678");
        cy.dataCy("booking-customerEmail").type("b@test.com");
        cy.dataCy("booking-tourName").type("Phu Quoc 3N2D");
        cy.get("#totalPrice").type("5000000");
        cy.dataCy("booking-submit").click();
        cy.contains("Travel date is required").should("be.visible");
        cy.contains("Customer full name is required").should("not.exist");
    });

    it("thành công khi nhập đầy đủ thông tin hợp lệ", () => {
        cy.dataCy("booking-customerName").type("Nguyen Thi Hoa");
        cy.dataCy("booking-customerPhone").type("0988776655");
        cy.dataCy("booking-customerEmail").type("hoa.nguyen@test.com");
        cy.dataCy("booking-tourName").type("Tour Ha Long Bay");
        cy.get("#travelDate").type("25/12/2026{enter}");
        cy.get("#totalPrice").type("8500000");
        cy.dataCy("booking-submit").click();
        cy.url().should("match", /\/bookings$/);
        cy.contains("Nguyen Thi Hoa").should("be.visible");
    });
})