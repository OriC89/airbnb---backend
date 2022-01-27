const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware.js')
const { log } = require('../../middlewares/logger.middleware')
const {
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
} = require('./stay.controller')
const router = express.Router()


router.get('/', getStays) 
router.get('/:id', getStayById)
router.post('/', addStay) 
router.put('/', updateStay)
router.delete('/:id', removeStay)

module.exports = router
