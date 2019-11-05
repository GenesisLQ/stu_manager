/**
 * 学校专业集合
 * @type {majors}
 */

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/stu_info')

const Schema = mongoose.Schema

let schMajorSchema = new Schema({
  mname: { // 专业名称
    type: String,
    required: true
  },
  mtype: { // 专业类别
    type: String,
    required: true
  },
  sname: { // 学校名称
    type: String,
    required: true
  }
})

var SchMajor = mongoose.model('SchMajor', schMajorSchema)

return module.exports = SchMajor