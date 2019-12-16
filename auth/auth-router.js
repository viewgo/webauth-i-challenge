const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not register user" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user.username);
        res
          .status(200)
          .json({ message: `Logged in as ${user.username}`, token });
      } else {
        res.status(401).json({ error: "You shall not pass!" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not log in" });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = { expiresIn: "1d" };

  return jwt.sign(payload, secret, options);
}



module.exports = router;
