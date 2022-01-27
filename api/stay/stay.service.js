//backend service

const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection('stayDB')
    var stays = await collection.find(criteria).toArray()
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  let criteria = {}
  if (filterBy.loc) {
    const txtCriteria = { $regex: filterBy.loc, $options: 'i' }
    criteria = {
      ...criteria,
      "loc.address": txtCriteria
    }
  }
  return criteria
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stayDB')
    const stay = collection.findOne({ _id: ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stayDB')
    await collection.deleteOne({ _id: ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay, user) {
  try {
    const collection = await dbService.getCollection('stayDB')
    await collection.insertOne(stay)
    return stay
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}
async function update(stay) {
  try {
    var id = ObjectId(stay._id)
    delete stay._id
    const collection = await dbService.getCollection('stayDB')
    await collection.updateOne({ _id: id }, { $set: { ...stay } })
    return stay
  } catch (err) {
    logger.error(`cannot update stay `, err)
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
