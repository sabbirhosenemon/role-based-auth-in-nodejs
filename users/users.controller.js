const jwt = require("jsonwebtoken");
const secret = "secret";

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    role: "Admin",
  },
  {
    id: 2,
    username: "user",
    password: "user",
    role: "User",
  },
];

function authenticate(req, res, next) {
  try {
    const user = users.find(
      (u) =>
        u.username === req.body.username && u.password === req.body.password
    );
    if (user) {
      const token = jwt.sign({ sub: user.id, role: user.role }, secret);
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
    next(err);
  }
}

function getAll(req, res, next) {
  try {
    return res.json(
      users.map((u) => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      })
    );
  } catch (error) {
    next(error);
  }
}

function getById(req, res, next) {
  const currentUser = req.user;
  const id = parseInt(req.params.id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== "Admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
}

module.exports = {
  authenticate,
  getAll,
  getById,
};
