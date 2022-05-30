import bcrypt from "bcrypt";
import { token } from "../lib/token";
import express from "express";
import { PrismaClient } from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient()

router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) throw new Error('User not found. Please retry with a correct email address.');
    if (!await bcrypt.compare(password, user.password)) throw new Error('Incorrect password. Please retry with a correct password.');

    return res.status(200).json({ 
      acessToken: token({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      }), 
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      }
    })
  } catch (err) {
    if (err.message.includes("User not found") || err.message.includes("Incorrect password")) return res.status(400).json({ error: err.message })
    return res.status(500).json({ error: "Error occured. Please try again later." })
  }
});

export default router;