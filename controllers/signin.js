const signin = (req, res, db, bcrypt) => {
  const { email, password } = req.body; // <-- grab data from user input
  if (!email || !password) {
    return res.status(400).json('incorrect from submission');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      console.log(data);
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));

  // 1st STAGE DEV
  // if (
  //   email === database.users[0].email &&
  //   password === database.users[0].password
  // ) {
  //   res.json(database.users[0]);
  // } else {
  //   res.status(400).json('EROOR logging in');
  // }
  //   res.json('signing'); // <--- === res.send('signing');
};

module.exports = {
  signin: signin,
};
