const express = require('express');
// CORS
const cors = require('cors');

// BCRYPT
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const imageSearch = require('./controllers/image');

// KNEX -- connecting database
/*
1st create database in postgres with 2 tables user&login

CREAETE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);

CREATE TABLE login (
	id serial PRIMARY KEY,
	hash varchar(100) NOT NULL,
	email text UNIQUE NOT NULL
);
*/

const knex = require('knex');
const { response } = require('express');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'RehrF3096',
    database: 'smart-brain',
  },
});

db.select('*')
  .from('users')
  .then((data) => console.log(data));
const app = express();

app.use(express.json());
app.use(cors());

// DATABASE USER

// const database = {
//   users: [
//     {
//       id: '123',
//       name: 'John',
//       email: 'john@gmail.com',
//       password: 'cookies',
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: '124',
//       name: 'Sally',
//       email: 'Sally@gmail.com',
//       password: 'cracker',
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
//   login: [
//     {
//       id: '987',
//       hash: '',
//       email: 'john@gmail.com',
//     },
//   ],
// };

app.get('/', (req, res) => {
  //   res.send('this is working');
  res.send(database.users);
});

// SIGNING POST
app.post('/signin', (req, res) => {
  signin.signin(req, res, db, bcrypt);
});

// REGISTER
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// GET USER
app.get('/profile/:id', (req, res) => {
  // /profile/:id === /profile/24024 or any number
  const { id } = req.params;
  // 2nd STAGE DEV
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('Not found');
    })
    .catch((err) => res.status(400).json('Error getting user'));
  // 1st STAGE DEV
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     return res.json(user);
  //   }
  // });
  // if (!found) res.status(400).json('not found');
});

// IMAGE USER  ENTRIES UPDATE
app.put('/image', (req, res) => imageSearch.handleImage(req, res, db));
app.post('/imageurl', (req, res) => imageSearch.handleApiCall(req, res));

app.listen(process.env.PORT || 8080, () => {
  console.log(`app is running on PORT ${process.env.PORT}`);
});

/*

/--> res = this is working

/signin --> POST  success/fail

/register --> POST = user

/profile/:userId --> GET = user

/image --> PUT = user

*/
