const express = require('express')
const md5 = require('blueimp-md5')
const User = require('../models/User')
const Major = require('../models/Major')
const SchMajor = require('../models/Sch_Major')
const Student = require('../models/Student')

const router = express()

router.get('/', function (req, res) {
  res.redirect('/login')
})

router.get('/province-index', function (req, res, next) {
  const user = req.session.user
  if (user) {
    Student.distinct('school', function (err, result) {
      if (!err) {
        res.render('province-index.html', {
          user: user,
          school: result
        })
      } else {
        next(err)
      }
    })
  } else {
    res.redirect('/login')
  }
})

router.post('/show_majors', function (req, res, next) {
  const body = req.body
  if (body) {
    SchMajor.find({
      sname: body.school
    }, function (err, result) {
      if (!err) {
        let data = []
        for (let i = 0; i < result.length; i++) {
          data.push(result[i].mname)
        }
        res.status(200).json({
          mname: data
        })
      } else {
        next(err)
      }
    })
  }
})

router.get('/checked', function (req, res, next) {
  let user = req.session.user
  if (user) {
    Student.find(function (err, result) {
      if (!err) {
        let entrance_time = []
        for (let i = 0; i < result.length; i++) {
          let time = result[i].entrance_time
          let year = time.getFullYear()
          let timeMonth = time.getMonth() + 1
          let month = timeMonth < 10 ? '0' + timeMonth : timeMonth
          let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
          entrance_time[i] = year + '-' + month + '-' + date
        }
        res.render('checked.html', {
          user: user,
          students: result,
          entrance_time: entrance_time
        })
      } else {
        next(err)
      }
    })
      .sort('idcard')
  } else {
    res.redirect('/login')
  }
})

router.get('/majors', function (req, res) {
  let user = req.session.user
  if (user) {
    Major.find(function (err, result) {
      if (!err) {
        res.render('major.html', {
          user: user,
          majors: result
        })
      } else {
        next(err)
      }
    })
      .sort('mtype')
  } else {
    res.redirect('/login')
  }
})

router.post('/add_majors', function (req, res, next) {
  let body = req.body
  let major = new Major({
    mname: body.mname,
    mtype: body.mtype
  })
  major.save(function (err, result) {
    if (!err) {
      res.redirect('/majors')
    } else {
      next(err)
    }
  })
})

router.get('/get_stu_info', function (req, res, next) {
  Student.findOne({
    no: req.query.no
  }, function (err, result) {
    if (!err) {
      res.status(200).json({
        address: result.address,
        photo: result.stu_photo
      })
    } else {
      next(err)
    }
  })
})

router.post('/check', function (req, res) {
  const body = req.body
  const id = JSON.parse(body.id)
  for (let i = 0; i < id.length; i++) {
    Student.updateOne({
      _id: id[i]
    }, {
      status: 2
    }, function (err, result) {
    })
  }
  res.json({
    res_code: 13,
    message: 'OK'
  })
})

router.post('/pro_query_stu', function (req, res, next) {
  const body = req.body
  if (body.school !== '0' && body.mname !== '0' && body.grade !== '0') {
    Student.find({
      school: body.school,
      major_name: body.mname,
      grade: body.grade,
      status: 2
    }, function (err, result) {
      returnResult(err, result)
    })
  } else if (body.school !== '0' && body.mname !== '0' || body.school !== '0' && body.grade !== '0' || body.mname !== '0' && body.grade !== '0') {
    Student.find({
      $or: [
        {
          school: body.school,
          major_name: body.mname,
          status: 2
        },
        {
          school: body.school,
          grade: body.grade,
          status: 2
        },
        {
          major_name: body.mname,
          grade: body.grade,
          status: 2
        }
      ]
    }, function (err, result) {
      returnResult(err, result)
    })
  } else if (body.school !== '0' || body.mname !== '0' || body.grade !== '0') {
    Student.find({
      $or: [
        {
          school: body.school,
          status: 2
        },
        {
          major_name: body.mname,
          status: 2
        },
        {
          grade: body.grade,
          status: 2
        }
      ]
    }, function (err, result) {
      returnResult(err, result)
    })
  }

  function returnResult(err, result) {
    if (!err) {
      return res.status(200).json({
        students: result
      })
    } else {
      next(err)
    }
  }
})

return module.exports = router