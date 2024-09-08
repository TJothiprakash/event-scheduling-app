const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const swaggerJSDoc = require("swagger-jsdoc");

const router = express.Router();

// Register
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerUser);

// Login
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

// Logout
/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout a user
 *     security:
 *       - bearerAuth: []  // If you're using bearer token for authorization
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", logoutUser);


module.exports = router;
