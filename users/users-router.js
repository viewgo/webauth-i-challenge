const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json({ error: "Could not retrieve users" }));
});

function restricted(req, res, next) {
  const { username, password } = req.headers;
  console.log(username, password);
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Unexpected error" });
      });
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
}

module.exports = router;
