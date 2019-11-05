/**
 * 学生集合
 * @type {student}
 */

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/stu_info')

const Schema = mongoose.Schema

let stuSchema = new Schema({
  no: { // 学号
    type: Number,
    required: true
  },
  name: { // 姓名
    type: String,
    required: true
  },
  gender: { // 性别
    type: Number,
    required: true
  },
  idcard: { // 身份证号
    type: String,
    required: true
  },
  address: { // 家庭住址
    type: String,
    required: true
  },
  major_type: { // 专业类别
    type: String,
    required: true
  },
  major_name: { // 专业名称
    type: String,
    required: true
  },
  grade: { // 年级
    type: Number,
    required: true
  },
  entrance_time: { // 入学时间
    type: Date,
    required: true
  },
  stu_photo: { // 学生照片
    type: String,
    required: true
  },
  school: { // 学校名称
    type: String,
    required: true
  },
  status: { // 注册状态
    type: Number,
    default: 0
  },
})

var Student = mongoose.model('Student', stuSchema)

return module.exports = Student