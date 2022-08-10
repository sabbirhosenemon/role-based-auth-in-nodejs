const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const secret = "secret";

const createUser = async (req, res) => {
  try {
    const createUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      },
    });
    res.json(createUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authenticate = async (req, res) => {
  try {
    const allUser = await prisma.user.findMany();
    const user = allUser.find((u) => u.username === req.body.username);
    if (user) {
      const token = jwt.sign({ sub: user.id, role: user.role }, secret, {
        expiresIn: "1h",
      });
      const { password, ...userWithoutPassword } = user;
      return res.json({
        ...userWithoutPassword,
        token,
      });
    }
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  console.log(req.user);
  try {
    const allUser = await prisma.user.findMany();
    res.json(allUser.sort((a, b) => a.id - b.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  const singleUser = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  const currentUser = singleUser;
  const id = parseInt(req.params.id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!singleUser) return;
  const { password, ...userWithoutPassword } = singleUser;
  res.json(userWithoutPassword);
};

module.exports = {
  authenticate,
  createUser,
  getAll,
  getById,
};
