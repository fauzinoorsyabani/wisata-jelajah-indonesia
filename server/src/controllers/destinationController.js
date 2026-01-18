import { pool } from '../index.js';

export const getAllDestinations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDestinationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDestination = async (req, res) => {
  const { name, location, description, image_url, price, rating } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO destinations (name, location, description, image_url, price, rating) VALUES (?, ?, ?, ?, ?, ?)',
      [name, location, description, image_url, price, rating]
    );
    
    // Fetch the inserted item
    const [newDest] = await pool.query('SELECT * FROM destinations WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newDest[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

