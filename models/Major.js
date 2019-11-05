/**
 * 专业集合
 * @type {majors}
 */

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/stu_info')

const Schema = mongoose.Schema

let majorSchema = new Schema({
  mname: { // 专业名称
    type: String,
    required: true
  },
  mtype: { // 专业类别
    type: String,
    required: true
  }
})

var Major = mongoose.model('Major', majorSchema)

return module.exports = Major