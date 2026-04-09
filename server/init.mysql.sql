CREATE DATABASE IF NOT EXISTS wisata_db;
USE wisata_db;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS destinations;
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Regular',
  facilities JSON,
  operational_hours JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  destination_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

-- Insert dummy data for bookings to see stats immediately
INSERT INTO bookings (user_id, destination_id, total_amount, status, booking_date) VALUES 
(1, 1, 750000, 'paid', '2023-01-15 10:00:00'),
(1, 1, 150000, 'paid', '2023-01-18 14:30:00'),
(1, 1, 300000, 'pending', NOW()),
(1, 1, 500000, 'cancelled', '2023-01-10 09:00:00');

-- Insert dummy admin (password: admin)
INSERT INTO users (email, password, role) VALUES ('admin@wisata.id', '$2b$10$4.odLkQ5et.Aa5orqTr6NuSSJHc5Ush0M.BYW/TqMDOPOMn1HZSWK', 'admin');
