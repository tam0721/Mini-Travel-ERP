describe("RBAC (Role-Based Access Control)", () => {
    before(() => {
        cy.task("db:seed");
    });

    it("chặn khách chưa login truy cập trang quản lý booking", () => {
        cy.visit("/bookings");
        cy.url().should("include", "/login");
    });

    it("ADMIN đăng nhập thấy đúng role ADMIN và các chức năng", () => {
        cy.loginAs("admin");
        cy.visit("/bookings");
        cy.get(".sidebar-user-role").should("contain.text", "ADMIN");
        cy.dataCy("booking-create").should("be.visible");
    });

    it("SALES đăng nhập thấy role SALES và tạo được booking", () => {
        cy.loginAs("sales");
        cy.visit("/bookings");
        cy.get(".sidebar-user-role").should("contain.text", "SALES");
        cy.dataCy("booking-create").should("be.visible");
    });

    it("Non-ADMIN (SALES) không thể đổi trạng thái booking (Backend 403)", () => {
        cy.loginAs("sales");
        cy.visit("/bookings");
        cy.dataCy("booking-row").should("have.length.greaterThan", 0);
        // Mở modal đổi status ở dòng đầu tiên
        cy.dataCy("booking-row").first().within(() => {
            cy.dataCy("booking-status-btn").click();
        });
        cy.get(".modal").should("be.visible");
        cy.get(".modal select").select("CONFIRMED");
        cy.get(".modal button").contains("Save changes").click();
        // Thông báo lỗi 403 hiển thị trong modal
        cy.get(".login-error").should("be.visible").and("contain.text", "Forbidden - Only Admins Allowed");
    });
})