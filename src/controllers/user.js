import models from "../models/index.js";
import jwt from "jsonwebtoken";

const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn });
};

export const signUp = async (req, res) => {
  const input = req.body;
  try {
    const isEmailExists = await models.User.findOne({ email: input?.email, isDeleted: false });
    if (isEmailExists) throw new Error("This email is already in use");
    await models.User.create(input, (err, result) => {
      if (err) throw err;
      else res.status(200).send(true);
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email, password: ", email, password);
  try {
    const user = await models.User.findOne({ email });
    if (user) {
      if (!user.isVerified) throw new Error("Please verify your email");
      if (!(await user.validatePassword(password))) throw new Error("Invalid password or email");
      res.status(200).send({ data: user, token: generateToken(user, "8hr") });
    } else res.status(404).send({ error: "Email does not exist" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await models.User.find({});
    if (user.length > 0) {
      res.status(200).send({ data: user });
    } else res.status(404).send({ error: "No user found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const me = req?.me;
  const input = req.body;
  try {
    let user = await models.User.findById(me?.id);
    if (user.email != input.email) {
      const isEmailExists = await models.User.findOne({ email: input?.email, isDeleted: false });
      if (isEmailExists) throw new Error("This email is already in use");
    }
    user = await models.User.findOneAndUpdate({ _id: me?.id }, input, { new: true });

    if (user) res.status(200).send({ data: user });
    else res.status(404).send({ error: "No user found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const me = req.me;
  try {
    const user = models.User.findByIdAndRemove(me?.id);
    if (user) res.status(200).send({ data: user });
    else res.status(404).send({ error: "No user found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await models.User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    if (user) res.status(200).send("Verify done..");
    else res.status(404).send({ error: "No user found" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
