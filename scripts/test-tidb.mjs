import { connect } from '@tidbcloud/serverless';

const url = 'mysql://35hDvHvf5aWjb46.root:694pxbVohLrMM5e2@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test';

async function main() {
  console.log('Connecting to TiDB Cloud Serverless...');
  const conn = connect({ url });
  
  // Test simple query
  const res = await conn.execute('SELECT VERSION() as version, CURRENT_TIMESTAMP as time');
  console.log('Connected successfully to TiDB Cloud!');
  console.log('Server info:', res);

  // Create database
  await conn.execute('CREATE DATABASE IF NOT EXISTS wisata_indonesia');
  console.log('Database wisata_indonesia verified.');

  // Connect to the specific database
  const dbConn = connect({ url: 'mysql://35hDvHvf5aWjb46.root:694pxbVohLrMM5e2@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/wisata_indonesia' });

  // Create destinations table
  await dbConn.execute(`
    CREATE TABLE IF NOT EXISTS destinations (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      rating DECIMAL(3,1) DEFAULT 4.5,
      reviews INT DEFAULT 0,
      image_url TEXT NOT NULL,
      description TEXT,
      category VARCHAR(64),
      features JSON,
      is_popular BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table destinations verified.');

  // Create bookings table
  await dbConn.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(64) PRIMARY KEY,
      booking_code VARCHAR(64) UNIQUE NOT NULL,
      destination_id VARCHAR(64) NOT NULL,
      destination_name VARCHAR(255) NOT NULL,
      destination_location VARCHAR(255) NOT NULL,
      destination_image TEXT,
      user_id VARCHAR(64) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      ticket_date DATE NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      ticket_type VARCHAR(64) DEFAULT 'REGULER',
      total_amount INT NOT NULL,
      status ENUM('pending', 'paid', 'used', 'cancelled') DEFAULT 'paid',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table bookings verified.');

  const tables = await dbConn.execute('SHOW TABLES');
  console.log('Tables in TiDB Cloud (wisata_indonesia):', tables);
}

main().catch(err => {
  console.error('TiDB Connection Error:', err);
  process.exit(1);
});
