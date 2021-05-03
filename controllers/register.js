const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body; // <-- grab data from user input
  if (!email || !name || !password) {
    return res.status(400).json('incorrect from submission');
  }

  // To hash a password: Technique 2 (auto-gen a salt and hash):
  //   bcrypt.hash(password, saltRounds, function (err, hash) {
  //     console.log(hash);
  //     console.log(password);
  //     // Store hash in your password DB.
  //   });

  // 1st DEV STAGE
  // database.users.push({
  //   id: '125',
  //   name: name,
  //   email: email,
  //   // password: password,
  //   entries: 0,
  //   joined: new Date(),
  // });
  //res.json(database.users[database.users.length - 1]);

  // 2nd DEV STAGE -- sending data from backend to database
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister: handleRegister,
};
