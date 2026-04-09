-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- Nullable for Google Auth users
  role VARCHAR(50) DEFAULT 'customer', -- 'admin' or 'customer'
  google_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default admin user (password: admin123)
-- Hash generated for 'admin123' using bcrypt (just for initial setup, usually we register via API)
-- INSERT INTO users (email, password, role) VALUES ('admin@wisata.id', '$2b$10$YourHashedPasswordHere', 'admin');
