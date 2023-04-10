const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.signUp = async (req, res) => {
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: "User Created Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.signIn = async (req, res) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const comparePassword = await bcrypt.compare(password, user.password);
  const message = comparePassword
    ? "Login successful"
    : "Email or password incorrect";
  const status = comparePassword ? 200 : 401;
  const token = comparePassword
    ? jwt.sign({ email, password }, process.env.JWT_SECRET)
    : "";

  return res
    .status(status)
    .json({ message, data: comparePassword ? user : "", token });
};

module.exports.logout = (req, res) => {
  const token = req.header("Authorization");
  console.log(token);
  jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.deleteOne({ id });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
