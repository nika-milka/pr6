const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const auth = require('./auth');
const cache = require('./cache');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Настройка сессий
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Маршруты
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    auth.registerUser(username, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = auth.getUser(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.session.user = { username };
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({ 
    username: req.session.user.username,
    message: 'Welcome to your profile'
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

app.get('/data', (req, res) => {
  const cachedData = cache.getCachedData();
  if (cachedData) {
    return res.json({ 
      data: cachedData,
      cached: true,
      timestamp: new Date(cache.getCacheTimestamp()).toISOString()
    });
  }
  
  // Генерация новых данных
  const newData = generateData();
  cache.cacheData(newData);
  
  res.json({ 
    data: newData,
    cached: false,
    timestamp: new Date().toISOString()
  });
});

function generateData() {
  // В реальном приложении здесь может быть запрос к БД или внешнему API
  return {
    items: [
      { id: 1, name: 'Item 1', value: Math.random() },
      { id: 2, name: 'Item 2', value: Math.random() },
      { id: 3, name: 'Item 3', value: Math.random() }
    ],
    updatedAt: new Date().toISOString()
  };
}

// Защита от CSRF (дополнительная мера)
app.use((req, res, next) => {
  if (req.method === 'POST' && !req.session.user) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});