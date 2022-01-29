// const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(email, phonenumber) {
  logger.debug(`auth.service - login with username: ${email}`)
  const user = await userService.getByUserEmail(email)
  if (!user) return Promise.reject('Invalid email or phone number')
  // TODO: un-comment for real login
  if (user.phonenumber !== phonenumber) return Promise.reject('Wrong credentials')
  user._id = user._id.toString()
  return user
}

async function signup(
  email,
  fullname,
  phonenumber,
) {

  const saltRounds = 10

  logger.debug(`auth.service - signup with username: ${email}`)
  if (!email || !phonenumber || !fullname)
    return Promise.reject('fullname, email and phonenumber are required!')

  return userService.add(email, fullname, phonenumber)
}

module.exports = {
  signup,
  login,
}
