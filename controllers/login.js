const loginRouter = require('express').Router()

const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  if (username == null || password == null) {
    return res.status(400).json({ error: 'Missing username or password' })
  }

  const user = await User.findOne({ username })
  if (user == null) {
    return res.status(401).json({ error: 'Invalid username' })
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)
  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ username, id: user._id }, process.env.SECRET, {
    expiresIn: 60 * 15 // 15 minutes
  })
  return res.status(200).json({ token, username, id: user._id })
})

module.exports = loginRouter
