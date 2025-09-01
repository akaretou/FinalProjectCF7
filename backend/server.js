const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); 

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

const USERS = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('123', 10)
  }
];


function authRequired(req, res, next) {
  if (!req.session.userId) return res.sendStatus(401);
  next();
}

function findUser(username) {
  return USERS.find(u => u.username === username);
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = findUser(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.regenerate(err => {
    if (err) return res.sendStatus(500);
    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.sendStatus(500);
    res.clearCookie('sid');
    res.sendStatus(204);
  });
});


app.get('/me', async (req, res) => {
  const user = USERS.find(u => u.id === req.session.userId);

  if (!user) return res.status(401).json({ message: 'User not found' });

  res.json({ id: user.id, username: user.username });
});


const listings = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro',
    description: '256GB, Titanium Black, 6.1" OLED display, A17 Pro chip.',
    address: 'Warehouse A1, Athens',
    geolocation: {
      lat: 37.9838,
      lng: 23.7275
    },
    status: 1,
    image: 'https://picsum.photos/80?random=11',
    category: 1,
    availableUntil: '10/01/2025'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Noise-canceling wireless headphones with 30h battery.',
    address: 'Warehouse B3, Thessaloniki',
    geolocation: {
      lat: 40.6401,
      lng: 22.9444,
    },
    status: 1,
    image: 'https://picsum.photos/80?random=12',
    category: 2,
    availableUntil: '10/01/2025'
  },
  {
    id: 3,
    title: 'Samsung 55" QLED 4K TV',
    description: 'Smart TV with HDR, 120Hz refresh rate, Dolby Atmos.',
    address: 'Warehouse C2, Patras',
    geolocation: {
      lat: 38.2466, 
      lng: 21.7346,
    },
    status: 3,
    image: 'https://picsum.photos/80?random=13',
    category: 3,
    availableUntil: '10/01/2025'
  },
  {
    id: 4,
    title: 'Nike Air Max 270',
    description: 'Comfortable and stylish sneakers in white/red colorway.',
    address: 'Warehouse D1, Heraklion',
    geolocation: {
      lat: 35.3387,
      lng: 25.1442
    },
    status: 1,
    image: 'https://picsum.photos/80?random=14',
    category: 2,
    availableUntil: '10/01/2025'
  },
  {
    id: 5,
    title: 'Adidas Performance T-Shirt',
    description: 'Breathable sports T-shirt, quick dry technology.',
    address: 'Warehouse E5, Volos',
    geolocation: {
      lat: 39.3610,
      lng: 22.9425,
    },
    status: 2,
    image: 'https://picsum.photos/80?random=15',
    category: 2,
    availableUntil: '10/01/2025'
  }
];

app.get('/listings', authRequired, (req, res) => {
  res.json(listings);
});

app.get('/listing/:id', authRequired, (req, res) => {
  const listing = listings.find(l => l.id === Number(req.params.id));
  if (!listing) return res.status(404).json({ message: 'Not found' });
  res.json(listing);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
