/**
 * 用户集合
 * @type {users}
 */

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/stu_info')

const Schema = mongoose.Schema

let userSchema = new Schema({
	role: { // 角色
		type: Number,
		required: true
	},
	email: { // 邮箱
		type: String,
		required: true
	},
	name: { // 角色名称
		type: String,
		required: true
	},
	password: { // 密码
		type: String,
		required: true
	}
})

var User = mongoose.model('User', userSchema)

return module.exports = User