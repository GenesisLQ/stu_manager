$('#login_form').on('submit', function (e) {
	e.preventDefault()
	var formData = $(this).serialize()
	$.ajax({
		url: '/login',
		type: 'post',
		data: formData,
		dataType: 'json',
		success: function (data) {
			if (data.res_code === 3) {
				window.alert('登录成功')
				window.location.href = '/school-index'
			} else if (data.res_code === 4){
				window.alert('密码错误，请重试')
			} else if (data.res_code === 5){
				window.alert('邮箱错误，您是否还没有注册？')
			} else if (data.res_code === 6){
				window.alert('登录成功')
				window.location.href = '/province-index'
			} else if (data.res_code === 500){
				window.alert('服务器正忙，请稍后再试')
			}
		}
	})
})


$('#register_form').on('submit', function (e) {
	e.preventDefault()
	var formData = $(this).serialize()
	let email = $('input[name=email]').val()
	let name = $('input[name=name]').val()
	let password = $('input[name=password]').val()
	if (!email) {
		$('.email').popover('show')
		hide()
		return
	}
	if (!name) {
		$('.name').popover('show')
		hide()
		return
	}
	if (!password) {
		$('.pwd').popover('show')
		hide()
		return
	}
	$.ajax({
		url: '/register',
		type: 'post',
		data: formData,
		// 如果服务端发送的数据是 json 格式，那么解析的时候就需要按照 json 解析
		dataType: 'json',
		success: function (data) {
			if (data.res_code === 0) {
				window.alert('注册成功')
				// 对于异步请求，服务端重定向无效，只有通过客户端重定向到登录页面
				window.location.href = '/login'
			} else if (data.res_code === 1) {
				window.alert('学校邮箱已存在')
			} else if (data.res_code === 2) {
				window.alert('学校名称已存在')
			} else if (data.res_code === 500) {
				window.alert('服务器正忙，请稍后再试')
			}
		}
	})
})

function hide() {
	setTimeout(function () {
		$('.email').popover('hide')
		$('.name').popover('hide')
		$('.pwd').popover('hide')
	}, 1300)
}