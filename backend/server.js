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
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
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

app.get('/logout', authRequired, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.sendStatus(500);
    res.clearCookie('sid');
    res.sendStatus(204);
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
