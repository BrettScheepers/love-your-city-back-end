import bcrypt from "bcrypt";
import { token } from "../lib/token";
import express from "express";
import { PrismaClient } from '@prisma/client'
import { validToken } from "../middleware/validate";

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

    return res.status(200).json({ 
      accessToken: token({
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

router.get("/:id", validToken, async (req, res) => {
  try {
    const campaigns = await prisma.$queryRaw`
      WITH donation_sums as (
          SELECT 
            campaign_id, 
            sum(item_quantity) as donations_item_quantity
          FROM donations
          GROUP BY campaign_id
        ), campaign_item_sums as (
          SELECT 
            campaign_id, 
            sum(campaign_item_quantity) as campaign_items_item_quantity
          FROM campaign_items
          GROUP BY campaign_id
        )

      SELECT 
        campaigns.campaign_id, campaigns.campaign_title, campaigns.campaign_desc, campaigns.end_date, 
        campaign_item_sums.campaign_items_item_quantity,
        donation_sums.donations_item_quantity
      FROM campaigns
        JOIN donation_sums
          ON campaigns.campaign_id = donation_sums.campaign_id
        JOIN campaign_item_sums
          ON campaigns.campaign_id = campaign_item_sums.campaign_id
      WHERE campaigns.campaign_owner_id = ${req.params.id}
    `

    return res.status(200).json({ campaigns: campaigns })
  } catch (error) {
    return res.status(500).json({ error: "Error occured. Please try again later." })
  }
})

export default router