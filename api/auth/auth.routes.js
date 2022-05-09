const express = require('express')
const { login, signup, logout,loginWithGoogle } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/google-login', loginWithGoogle)
router.post('/signup', signup)
router.post('/logout', logout)

module.exports = router
