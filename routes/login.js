/**
 * 用户注册、登录、退出路由
 * @type {router}
 */

const express = require('express')
const md5 = require('blueimp-md5')
const User = require('../models/User')

const router = express()

router.get('/register', function (req, res) {
  res.render('register.html')
})

router.get('/login', function (req, res) {
  res.render('login.html')
})

router.post('/register', function (req, res, next) {
  const body = req.body
  const password = md5(md5(body.password))
  User.findOne({
    $or: [{
        email: body.email
      },
      {
        name: body.name
      }
    ]
  }, function (err, result) {
    if (!err) {
      if (!result) {
        let user = new User({
          role: body.role,
          email: body.email,
          name: body.name,
          password: password
        })
        user.save(function (err) {
          if (!err) {
            return res.status(200).json({
              res_code: 0,
              message: 'OK'
            })
          } else {
            next(err)
          }
        })
      } else if (body.email === result.email) {
        return res.status(200).json({
          res_code: 1,
          message: 'Email is already exist...'
        })
      } else if (body.name === result.name) {
        return res.status(200).json({
          res_code: 2,
          message: 'Name is already exist...'
        })
      }
    } else {
      next(err)
    }
  })
})

router.post('/login', function (req, res, next) {
  const body = req.body
  const password = md5(md5(body.password)) // 加密
  User.findOne({
    email: body.email
  }, function (err, result) {
    if (!err) {
      if (result) {
        if (result.password === password) {
          req.session.user = result
          if (result.role === 0) {
            return res.status(200).json({
              res_code: 6,
              message: 'OK'
            })
          }
          if (result.role === 1) {
            return res.status(200).json({
              res_code: 3,
              message: 'OK'
            })
          }
        } else {
          return res.status(200).json({
            res_code: 4,
            message: 'Password error'
          })
        }
      } else {
        return res.status(200).json({
          res_code: 5,
          message: 'Email error'
        })
      }
    } else {
      next(err)
    }
  })
})

router.get('/logout', function (req, res, next) {
  delete req.session.user
  res.redirect('/login')
})

return module.exports = router