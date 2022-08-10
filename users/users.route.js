const authorize = require("../helpers/authorize");
const express = require("express");
const {
  authenticate,
  createUser,
  getAll,
  getById,
} = require("./users.controller.js");
const router = express.Router();

// routes
router.post("/authenticate", authenticate); // public route
router.post("/create", createUser); // admin route
router.get("/", authorize("admin"), getAll); // admin only
router.get("/:id", authorize(), getById); // all authenticated users

module.exports = router;
