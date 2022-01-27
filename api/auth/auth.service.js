const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

async function login(email, phonenumber) {
  logger.debug(`auth.service - login with username: ${email}`)

  const user = await userService.getByUserEmail(email)
  if (!user) return Promise.reject('Invalid email or phone number')
  // TODO: un-comment for real login
  // const match = await bcrypt.compare(phonenumber, user.phonenumber)
  // if (!match) return Promise.reject('Invalid email or phone number')

  delete user.phonenumber
  user._id = user._id.toString()
  return user
}

async function signup(
  username,
  password,
  fullname,
  imgUrl,
  email,
  savedNotifications
) {

  const saltRounds = 10

  logger.debug(`auth.service - signup with username: ${email}`)
  if (!email || !phonenumber || !fullname)
    return Promise.reject('fullname, email and phonenumber are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({
    username,
    phonenumber: hash,
    fullname,
    imgUrl,
    email,
    savedNotifications,
  })
}

module.exports = {
  signup,
  login,
}
