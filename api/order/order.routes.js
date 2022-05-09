const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware.js')
const { log } = require('../../middlewares/logger.middleware')
const {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
} = require('./order.controller')

const router = express.Router()

router.get('/', getOrders) 
router.get('/:id', getOrderById)
router.post('/', addOrder) 
router.put('/', updateOrder)
router.delete('/:id', removeOrder)

module.exports = router
