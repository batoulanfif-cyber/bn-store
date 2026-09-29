-- BN STORE Database Schema
-- Run this in MySQL to create the database and tables

CREATE DATABASE IF NOT EXISTS `bn_store` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bn_store`;

-- Admin users table
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'manager') DEFAULT 'admin',
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) NULL,
    `stock` INT DEFAULT 0,
    `image` VARCHAR(500) NOT NULL,
    `images` JSON NULL,
    `rating` DECIMAL(3, 2) DEFAULT 0.00,
    `review_count` INT DEFAULT 0,
    `badge` VARCHAR(50) NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `category` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_active` (`is_active`),
    INDEX `idx_category` (`category`),
    INDEX `idx_featured` (`is_featured`),
    INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(50) NOT NULL UNIQUE,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(50) NOT NULL,
    `customer_wilaya` VARCHAR(100) NOT NULL,
    `customer_address` TEXT NOT NULL,
    `customer_notes` TEXT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    `payment_method` ENUM('cod') DEFAULT 'cod',
    `payment_status` ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `confirmed_at` TIMESTAMP NULL,
    `shipped_at` TIMESTAMP NULL,
    `delivered_at` TIMESTAMP NULL,
    `cancelled_at` TIMESTAMP NULL,
    INDEX `idx_status` (`status`),
    INDEX `idx_order_number` (`order_number`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_customer_phone` (`customer_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `product_brand` VARCHAR(100) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT,
    INDEX `idx_order_id` (`order_id`),
    INDEX `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - change in production!)
-- Hash generated with bcrypt cost 12
INSERT IGNORE INTO `admin_users` (`email`, `password_hash`, `name`, `role`) VALUES
('admin@bnstore.dz', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'Admin BN STORE', 'admin');

-- Insert sample products
INSERT IGNORE INTO `products` (`brand`, `name`, `slug`, `description`, `price`, `original_price`, `stock`, `image`, `rating`, `review_count`, `badge`, `category`, `is_active`, `is_featured`) VALUES
('YSL', 'Rouge Pur Couture', 'ysl-rouge-pur-couture', 'Rouge à lèvres iconique au fini satiné. Couleur intense, tenue longue durée.', 6500.00, NULL, 50, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', 4.80, 124, NULL, 'levres', TRUE, TRUE),
('NARS', 'Blush Orgasm', 'nars-blush-orgasm', 'Blush culte au pêche rosé avec reflets dorés. Flatte tous les tons de peau.', 5200.00, NULL, 30, 'https://images.unsplash.com/photo-1596755389378-c34d4767b9ef?w=400&q=80', 4.90, 89, 'BEST SELLER', 'teint', TRUE, TRUE),
('HUDA BEAUTY', 'Faux Filter Foundation', 'huda-faux-filter-foundation', 'Fond de teint couvrance totale, fini mat naturel. 40 teintes.', 7800.00, NULL, 25, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80', 4.70, 203, NULL, 'teint', TRUE, TRUE),
('DIOR', 'Rouge Dior Forever', 'dior-rouge-forever', 'Rouge à lèvres liquide transfert-proof. 16h tenue, confort absolu.', 6900.00, 7500.00, 40, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', 4.80, 156, NULL, 'levres', TRUE, TRUE),
('LANCÔME', 'L\'Absolu Rouge', 'lancome-absolu-rouge', 'Rouge à lèvres soin à la texture crème. Hydratation 18h, couleur vibrante.', 5800.00, NULL, 35, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', 4.60, 98, NULL, 'levres', TRUE, TRUE),
('MAC', 'Ruby Woo', 'mac-ruby-woo', 'Rouge à lèvres mat iconique. Rouge bleu universel, tenue extrême.', 4200.00, NULL, 60, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', 4.90, 312, 'BEST SELLER', 'levres', TRUE, TRUE),
('GUERLAIN', 'KissKiss Shine', 'guerlain-kisskiss-shine', 'Baume à lèvres brillant aux huiles précieuses. Brillance miroir, soin intense.', 5500.00, NULL, 45, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', 4.70, 87, NULL, 'levres', TRUE, FALSE),
('CHANEL', 'Rouge Allure Velvet', 'chanel-rouge-allure-velvet', 'Rouge à lèvres velours mat. Couleur pure, confort seconde peau.', 7200.00, 7800.00, 20, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', 4.80, 145, NULL, 'levres', TRUE, TRUE);