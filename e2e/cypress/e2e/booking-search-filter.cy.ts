describe("Booking - Search, Filter & Pagination", () => {
    before(() => {
        cy.task("db:seed");
    });

    beforeEach(() => {
        cy.loginAs("admin");
        cy.visit("/bookings");
        cy.dataCy("booking-row").should("have.length.greaterThan", 0);
    });

    it("tìm kiếm theo từ khóa chính xác", () => {
        cy.get("#search-input").clear().type("Customer 20");
        cy.dataCy("booking-row").should("have.length", 1);
        cy.dataCy("booking-row").should("contain.text", "Customer 20");
    });

    it("tìm kiếm không có kết quả hiện trạng thái trống", () => {
        cy.get("#search-input").clear().type("KhachHangKhongTonTai_9999");
        cy.dataCy("booking-row").should("not.exist");
        cy.contains("No booking found.").should("be.visible");
    });

    it("lọc theo trạng thái PENDING", () => {
        cy.get("#status-filter").select("PENDING");
        cy.dataCy("booking-row").should("have.length.greaterThan", 0);
        cy.dataCy("booking-row").each(($row) => {
            cy.wrap($row).find(".badge").should("contain.text", "Pending");
        });
    });

    it("phân trang - chuyển sang trang 2 hiển thị dữ liệu tiếp theo", () => {
        cy.dataCy("booking-row").should("have.length", 10);
        cy.get(".pagination").contains("2").click();
        cy.dataCy("booking-row").should("have.length", 10);
        cy.get(".page-info").should("contain.text", "Trang 2/2");
    });

    it("kết hợp tìm kiếm và lọc trạng thái", () => {
        cy.intercept("GET", "**/api/bookings*").as("filterBookings");
        cy.get("#search-input").clear().type("Tour A");
        cy.wait("@filterBookings");
        cy.get("#status-filter").select("CONFIRMED");
        cy.wait("@filterBookings");

        cy.dataCy("booking-row").should("have.length.greaterThan", 0);
        cy.dataCy("booking-row").each(($row) => {
            cy.wrap($row).should("contain.text", "Tour A");
            cy.wrap($row).find(".badge").should("contain.text", "Confirmed");
        });
    });
});