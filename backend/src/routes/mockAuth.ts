import { Router } from 'express';
import { generateToken } from '../middleware/auth';

const router = Router();

// Mock users for testing
const mockUsers = [
  {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: "password123", // In production, this would be hashed
    wallet_address: null,
    role: "user",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    wallet_address: null,
    role: "admin",
    created_at: new Date().toISOString()
  }
];

// Register endpoint
router.post('/register', (req, res) => {
  try {
    const { name, email, password, wallet_address } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password, // In production, hash this password
      wallet_address: wallet_address || null,
      role: "user",
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile endpoint
router.get('/profile', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // For mock purposes, we'll just return a mock user
    // In production, you'd verify the JWT token
    const user = mockUsers[0]; // Return first user for demo

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
