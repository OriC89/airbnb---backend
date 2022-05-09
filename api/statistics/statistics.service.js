const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')

async function getStatistics() {
    try {
        let orders = await dbService.getCollection('orderDB')
        const orderStays = await orders.aggregate([
            {
                '$lookup': {
                    'from': 'stayDB',
                    'localField': 'stay._id',
                    'foreignField': '_id',
                    'as': 'string'
                }
            }, {
                '$unwind': {
                    'path': '$string',
                    'includeArrayIndex': 'loc',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'city': '$string.loc.city'
                }
            }, {
                '$group': {
                    '_id': '$city',
                    'count': {
                        '$sum': 1
                    }
                }
            },
        ]).toArray()

        let orderStatisticsByCity = []
        orderStays.forEach(element => {
            const key = element._id
            return orderStatisticsByCity.push([key, element.count])
        })
        return orderStatisticsByCity
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getCityStatistics(city) {
    try {
        let stays = await dbService.getCollection('stayDB')
        const staysStatistics = await stays.aggregate([
            {
                '$match': {
                    'loc.city': `${city}`
                }
            }, {
                '$lookup': {
                    'from': 'orderDB',
                    'localField': '_id',
                    'foreignField': 'stay._id',
                    'as': 'orders'
                }
            }, {
                '$project': {
                    'name': '$name',
                    'orders': {
                        '$size': '$orders'
                    }
                }
            }
        ]).toArray()
        let statistics = []
        staysStatistics.forEach(element => {
            const key = element.name
            if (!element.orders) return
            return statistics.push([key, element.orders])
        })
        return statistics
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

module.exports = {
    getStatistics,
    getCityStatistics
}