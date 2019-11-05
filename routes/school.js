const express = require('express')
const fs = require('fs')
const multer = require('multer')
const upload = multer({dest: './public/upload/'})
const Major = require('../models/Major')
const SchMajor = require('../models/Sch_Major')
const Student = require('../models/Student')

const router = express()

router.get('/', function (req, res) {
  res.redirect('/login')
})

router.get('/school-index', function (req, res, next) {
  const user = req.session.user
  if (user) {
    const p = new Promise(function (resolve, reject) {
      SchMajor.distinct('mtype', function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          next(err)
        }
      })
    })

    p.then(function (data) {
      SchMajor.distinct('mname', function (err, result) {
        if (!err) {
          res.render('school-index.html', {
            user: user,
            mtype: data,
            mname: result
          })
        } else {
          next(err)
        }
      })
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/add_stu', function (req, res, next) {
  let user = req.session.user
  if (user) {
    SchMajor.distinct('mtype', {
      sname: user.name
    }, function (err, result) {
      if (!err) {
        res.render('add_stu.html', {
          user: user,
          mtype: result
        })
      } else {
        next(err)
      }
    })
  } else {
    res.redirect('/login')
  }
})

router.post('/add_stu', upload.single('avatar'), function (req, res, next) {
  let body = req.body
  let file = req.file
  let address = body.address.join('')
  let newName = body.idcard
  // 给图片重命名
  fs.rename(file.path, file.destination + newName, function (err) {
    if (err) {
      next(err)
    }
  })

  // 数据库查重
  Student.findOne({
    no: body.no
  }, function (err, result) {
    if (!err) {
      if (!result) {
        Student.findOne({
          idcard: body.idcard
        }, function (err, result) {
          if (!err) {
            if (!result) {
              // 插入数据库
              let student = new Student({
                no: body.no,
                name: body.name,
                gender: body.gender,
                idcard: body.idcard,
                address: address,
                major_type: body.major_type,
                major_name: body.major_name,
                grade: body.grade,
                entrance_time: body.entrance_time,
                stu_photo: file.destination + body.idcard,
                school: req.session.user.name
              })
              student.save(function (err, result) {
                if (!err) {
                  return res.json({
                    res_code: 9,
                    message: 'OK'
                  })
                } else {
                  next(err)
                }
              })
            } else {
              return res.json({
                res_code: 11,
                message: 'Idcard already exist'
              })
            }
          } else {
            next(err)
          }
        })
      } else {
        return res.json({
          res_code: 10,
          message: 'No. already exist'
        })
      }
    } else {
      next(err)
    }
  })
})

router.get('/select_majors', function (req, res, next) {
  let user = req.session.user
  if (user) {
    let promise = new Promise(function (resolve, reject) {
      SchMajor.find({
        sname: req.session.user.name
      }, function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
        .sort('mtype')
    })
    promise
      .then(function (data) {
        Major.distinct('mtype', function (err, result) {
          if (!err) {
            res.render('select_majors.html', {
              user: user,
              majors: result,
              s_majors: data
            })
          } else {
            next(err)
          }
        })
      })
  } else {
    res.redirect('/login')
  }
})

router.post('/sel_majors_name', function (req, res, next) {
  show_mnames(Major, {
    mtype: req.body.mtype
  }, req, res, next)
})

router.post('/show_majors_name', function (req, res, next) {
  show_mnames(SchMajor, {
    mtype: req.body.mtype,
    sname: req.session.user.name
  }, req, res, next)
})

router.post('/sch_select_majors', function (req, res, next) {
  let body = req.body
  SchMajor.find({
    mname: body.mname,
    sname: req.session.user.name
  }, function (err, result) {
    if (!err) {
      if (result.length === 0) {
        let sch_major = new SchMajor({
          mname: body.mname,
          mtype: body.mtype,
          sname: req.session.user.name
        })
        sch_major.save(function (err, result) {
          if (!err) {
            res.status(200).json({
              res_code: 7,
              message: 'OK'
            })
          } else {
            next(err)
          }
        })
      } else {
        res.json({
          res_code: 8,
          message: 'Mname already exist...'
        })
      }
    } else {
      next(err)
    }
  })
})

router.get('/sch_unchecked', function (req, res, next) {
  const user = req.session.user
  if (user) {
    Student.find({
      school: req.session.user.name
    }, function (err, result) {
      if (!err) {
        res.render('sch-unchecked.html', {
          user: user,
          students: result
        })
      } else {
        next(err)
      }
    })
      .sort('status')
  } else {
    res.redirect('/login')
  }
})

router.post('/sch_unchecked', function (req, res, next) {
  const body = req.body
  const id = JSON.parse(body.id)
  for (let i = 0; i < id.length; i++) {
    Student.updateOne({
      _id: id[i]
    }, {
      status: 1
    }, function (err, result) {
    })
  }
  res.json({
    res_code: 12,
    message: 'OK'
  })
})

router.post('/query_stu', function (req, res, next) {
  const body = req.body
  if (body.mtype !== '0' && body.mname !== '0' && body.entrance_time !== '0') {
    // 三个字段都不为空
    Student.find({
      major_type: body.mtype,
      major_name: body.mname,
      grade: body.entrance_time,
      school: req.session.user.name,
      status: 2
    }, function (err, result) {
      returnResult(err, result)
    })
  } else if (body.mtype !== '0' && body.mname !== '0' || body.mtype !== '0' && body.entrance_time !== '0' || body.mname !== '0' && body.entrance_time !== '0') {
    // 两个字段不为空
    Student.find({
      $or: [
        {
          major_type: body.mtype,
          major_name: body.mname,
          school: req.session.user.name,
          status: 2
        },
        {
          major_type: body.mtype,
          grade: body.entrance_time,
          school: req.session.user.name,
          status: 2
        },
        {
          major_name: body.mname,
          grade: body.entrance_time,
          school: req.session.user.name,
          status: 2
        }
      ]
    }, function (err, result) {
      returnResult(err, result)
    })
  }  else if (body.mtype !== '0' || body.mname !== '0' || body.entrance_time !== '0') {
    // 一个字段不为空
    Student.find({
      $or: [
        {
          major_type: body.mtype,
          school: req.session.user.name,
          status: 2
        },
        {
          major_name: body.mname,
          school: req.session.user.name,
          status: 2
        },
        {
          grade: body.entrance_time,
          school: req.session.user.name,
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

/**
 * 根据专业类别展示专业名称
 * @param Model 集合
 * @param req
 * @param res
 * @param next
 */
function show_mnames(Model, conditions, req, res, next) {
  let body = req.body
  if (body) {
    Model.find(conditions, function (err, result) {
      if (!err) {
        let data = []
        for (let i = 0; i < result.length; i++) {
          data.push(result[i].mname)
        }
        res.status(200).json({
          data: data
        })
      } else {
        next(err)
      }
    })
  }
}

return module.exports = router