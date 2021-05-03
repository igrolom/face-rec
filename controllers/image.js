const clarifai = require('clarifai');
//
const app = new Clarifai.App({
  apiKey: '0a946e859c07464880ff1791a6bab90e',
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => console.error(err, 'unable to work with api'));
};
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries))
    .catch((err) => res.status(400).json('unable to get entries'));
  // 1st STAGE DEV
  // let found = false;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries++;
  //     return res.json(user.entries);
  //   }
  // });
  // if (!found) res.status(400).json('not found');
};

module.exports = {
  handleImage: handleImage,
  handleApiCall,
};
