const express = require('express')
const path = require('path')
const session = require('express-session')
const loginRouter = require('./routes/login')
const provinceRouter = require('./routes/province')
const schoolRouter = require('./routes/school')
const bodyParser = require('body-parser')
const app = express()

// 配置静态文件访问
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/views/', express.static(path.join(__dirname, './views/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
// 配置模板引擎
app.engine('html', require('express-art-template'))
// 配置 body-parser
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())
// 配置 session
app.use(session({
  secret: 'keyboard cat', // 配置加密字符串，能够在原有的加密基础上再加上这个字符串拼接起来去加密
  resave: false,
  saveUninitialized: true // 无论是否使用 session，默认分配一个 cookie
}))

// 挂载路由
app.use(loginRouter)
app.use(provinceRouter)
app.use(schoolRouter)


// 配置处理 404 的中间件
app.use(function (req, res) {
	res.render('404.html')
})

// 配置一个全局错误处理的中间件
app.use(function (err, req, res, next) {
	res.status(500).json({
		res_code: 500,
		message: 'Server error...'
	})
})

app.listen(8000, function () {
	console.log('StudentInfo app is running...')
})

// 学生信息查询：
// 学校（超级管理员和省级看全部）、专业（和学校联动）、入学年、毕业年、身份证号、姓名
// 统计人数：
// 学校、专业、入学年、毕业年、性别、户籍所在地
// 列出限定条件下的学生人数