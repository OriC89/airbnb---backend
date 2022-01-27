const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')


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
    console.log('user from user service', user);
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

async function add(email, fullname, phonenumber) {
  console.log('user in add line 87', phonenumber, email, fullname);
  try {
    const userToAdd = {
      phonenumber,
      fullname,
      imgUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${utilService.getRandomIntInclusive(0, 100)}.jpg`,
      email,
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
