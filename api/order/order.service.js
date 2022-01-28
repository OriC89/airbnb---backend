  //backend service

const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('orderDB')
    var orders = await collection.find(criteria).toArray()
    console.log('order in backend service', orders)
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

function _buildCriteria({ userId, isHost }) {
  let criteria = {}
  if (isHost !== 'false') {
    criteria = { 'host._id': userId }
  } else {
    criteria = { 'user._id': userId }
  }
  return criteria
}


async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('orderDB')
    const order = collection.findOne({ _id: ObjectId(orderId) })
    return order
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('orderDB')
    await collection.deleteOne({ _id: ObjectId(orderId) })
    return orderId
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function add(order) {
  try {
    const collection = await dbService.getCollection('orderDB')
    await collection.insertOne(order)
      return order
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

async function update(order) {
  console.log('update orderService in backend line 65')
  try {
    var id = ObjectId(order._id)
    delete order._id
    const collection = await dbService.getCollection('orderDB')
    await collection.updateOne({ _id: id }, { $set: { ...order } })
    return order
  } catch (err) {
    logger.error(`cannot update order ${orderId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}
