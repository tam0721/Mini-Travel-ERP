-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `customer_email` VARCHAR(191) NULL,
    ADD COLUMN `total_price` DOUBLE NOT NULL DEFAULT 0;
