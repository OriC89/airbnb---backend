const express = require('express')
const { getStatistics, getStatisticsByCity } = require('./statistics.controller')

const router = express.Router()

router.get('/', getStatistics)
router.get('/:cityName', getStatisticsByCity)

module.exports = router
