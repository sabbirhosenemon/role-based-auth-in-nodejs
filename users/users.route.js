const authorize = require("../helpers/authorize");
const express = require("express");
const { authenticate, getAll, getById } = require("./users.controller.js");
const router = express.Router();

// routes
router.post("/authenticate", authenticate); // public route
router.get("/", authorize("Admin"), getAll); // admin only
router.get("/:id", authorize(), getById); // all authenticated users

module.exports = router;
