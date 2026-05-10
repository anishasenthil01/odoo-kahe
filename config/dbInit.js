import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'traveloop';

async function initializeDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log(`Creating database ${DB_NAME} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    
    await connection.query(`USE \`${DB_NAME}\`;`);
    
    console.log('Creating tables...');
    
    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255),
        role ENUM('user', 'admin') DEFAULT 'user',
        language_preference VARCHAR(20) DEFAULT 'en',
        theme_preference ENUM('light', 'dark') DEFAULT 'light',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Trips Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        cover_image VARCHAR(255),
        is_public BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Trip Stops Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trip_stops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        city_name VARCHAR(100) NOT NULL,
        country VARCHAR(100),
        start_date DATE,
        end_date DATE,
        order_index INT,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Activities Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stop_id INT,
        trip_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        type VARCHAR(50),
        cost DECIMAL(10, 2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        duration_minutes INT,
        rating DECIMAL(3, 2),
        image_url VARCHAR(255),
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
        FOREIGN KEY (stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE
      )
    `);

    // Budgets Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Packing Lists Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS packing_lists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        item_name VARCHAR(150) NOT NULL,
        category VARCHAR(50),
        is_packed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Notes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Saved Destinations Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS saved_destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        city_name VARCHAR(100) NOT NULL,
        country VARCHAR(100),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialization completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDB();
