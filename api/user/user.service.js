const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  getByUserEmail,
  remove,
  update,
  add,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection('userDB')
    var users = await collection.find(criteria).toArray()
    users = users.map((user) => {
      delete user.password
      user.createdAt = ObjectId(user._id).getTimestamp()
      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  console.log('get by id', userId)
  try {
    const collection = await dbService.getCollection('userDB')
    const user = collection.findOne({ _id: ObjectId(userId) })
    return user
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}

// GET USER BY EMAIL
async function getByUserEmail(email) {
  try {
    const collection = await dbService.getCollection('userDB')
    const user = await collection.findOne({ email })
    return user
  } catch (err) {
    logger.error(`while finding user ${email}`, err)
    throw err
  }
}

// REMOVE USER
async function remove(userId) {
  try {
    const collection = await dbService.getCollection('userDB')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

// UPDATE USER
async function update(user) {
  try {
    const userToSave = {
      ...user,
      _id: ObjectId(user._id),
    }
    const collection = await dbService.getCollection('userDB')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user) {
  try {
    const userToAdd = {
      username: user.username,
      phonenumber: user.phonenumber,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      email: user.email,
      savedNotifications: [],
      likedStays: [],
      isHost: false,
    }
    const collection = await dbService.getCollection('userDB')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    logger.error('cannot insert user', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        email: txtCriteria,
      },
      {
        phonenumber: txtCriteria,
      },
    ]
  }
  return criteria
}
