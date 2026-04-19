const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");

const usersFilePath = path.join(__dirname, "..", "data", "users.json");

const isMongoEnabled = () => mongoose.connection.readyState === 1;

const readUsers = async () => {
  try {
    const content = await fs.readFile(usersFilePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const normalizeUser = (user) => ({
  id: String(user._id || user.id),
  name: user.name,
  email: user.email,
  password: user.password,
});

const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();

  if (isMongoEnabled()) {
    const user = await User.findOne({ email: normalizedEmail });
    return user ? normalizeUser(user) : null;
  }

  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail) || null;
};

const createUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();

  if (isMongoEnabled()) {
    const user = await User.create({ name, email: normalizedEmail, password });
    return normalizeUser(user);
  }

  const users = await readUsers();
  const newUser = {
    id: new mongoose.Types.ObjectId().toString(),
    name,
    email: normalizedEmail,
    password,
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
};

const findUserById = async (id) => {
  if (isMongoEnabled()) {
    const user = await User.findById(id).select("-password");
    return user ? normalizeUser(user) : null;
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.id === id);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};
