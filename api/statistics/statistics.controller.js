const statisticsService = require('./statistics.service')
const logger = require('../../services/logger.service')

async function getStatistics(req, res) {
    try {
        const stat = await statisticsService.getStatistics()
        res.json(stat)
    } catch (err) {
        logger.error('Failed to get stat ' + err)
        res.status(401).send({ err: 'Failed to get stat' })
    }
}

async function getStatisticsByCity(req, res) {
    try {
        const stat = await statisticsService.getCityStatistics(req.params.cityName)
        res.json(stat)
    } catch (err) {
        logger.error('Failed to get stat ' + err)
        res.status(401).send({ err: 'Failed to get stat' })
    }
}

module.exports = {
    getStatistics,
    getStatisticsByCity
}