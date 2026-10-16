import { defineConfig } from "cypress";
import { execSync } from "child_process";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        expose: {
            apiUrl: "http://localhost:3000/api",
        },
        video: false,
        screenshotOnRunFailure: true,
        setupNodeEvents(on) {
            on("task", {
                "db:seed"() {
                execSync("node prisma/seeders/seed.test.js", {
                    cwd: "../",        // chạy từ root project
                    stdio: "inherit",
                });
                return null;
                },
            });
        },
    },
});