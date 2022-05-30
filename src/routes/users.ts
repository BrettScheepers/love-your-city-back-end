import bcrypt from "bcrypt";
import { token } from "../lib/token";
import express from "express";
import { PrismaClient } from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.users.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
            }
        })

        console.log('server user',user)

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
        if (err.message.includes('Unique constraint failed on the fields: (`username`)')) {
            return res.status(400).json({ error: 'Username already taken. Please use another.'})
        }
        if (err.message.includes('Unique constraint failed on the fields: (`email`)')) {
            return res.status(400).json({ error: 'Email already taken. Please use another.'})
        }
        return res.status(500).json({ error: "Error occured. Please try again later." })
    }
})

export default router