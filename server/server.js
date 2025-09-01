import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'
import connectDB from './configs/mongodb.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// app config
const PORT = process.env.PORT || 4000
const app = express()
await connectDB()

// middlewares
app.use(express.json())
app.use(cors())

const upload = multer({ storage: multer.memoryStorage() })

// health
app.get('/', (req, res) => res.send('API Working'))

// create payment order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'rcpt_' + Date.now() } = req.body || {}
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      return res.status(400).json({ error: 'Missing Razorpay keys' })
    }
    const razorpay = new Razorpay({ key_id, key_secret })
    const order = await razorpay.orders.create({ amount: Math.round(amount), currency, receipt })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// verify payment signature
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body || {}
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_secret) return res.status(400).json({ error: 'Missing Razorpay key secret' })
    const expected = crypto.createHmac('sha256', key_secret).update(order_id + '|' + payment_id).digest('hex')
    const valid = expected === signature
    res.json({ valid })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// remove background via remove.bg (requires env REMOVE_BG_API_KEY)
app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return res.status(400).json({ error: 'REMOVE_BG_API_KEY not set' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    const form = new FormData()
    form.append('image_file', req.file.buffer, { filename: req.file.originalname || 'image.png' })
    form.append('size', 'auto')
    form.append('format', 'png')

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
      headers: {
        ...form.getHeaders(),
        'X-Api-Key': apiKey,
      },
      responseType: 'arraybuffer',
      timeout: 60000,
    })

    res.setHeader('Content-Type', 'image/png')
    res.status(200).send(Buffer.from(response.data))
  } catch (err) {
    const status = err.response?.status || 500
    const message = err.response?.data?.errors?.[0]?.title || err.message || 'Error removing background'
    res.status(status).json({ error: message })
  }
})

app.listen(PORT, () => console.log('Server running on port', PORT))
