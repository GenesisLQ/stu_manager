$(function () {
  // 生成省市县三级数据
  new Select()
  $('.select-plugin').hide()

  // 点击选择按钮同时触发选择文件的按钮
  $(".upload").click(function () {
    $('.select_file').click()
  })

  // 头像预览
  $('.select_file').on('change', function () {
    var src = window.URL.createObjectURL($('.select_file')[0].files[0])
    $('.ava-img').attr('src', src)
  })

  // 根据专业名称来选择展示相关专业
  $('#mtype').change(function () {
    let data = $(this).val()
    $.post('/show_majors_name', {mtype: data}, function (data) {
      let arr = data.data
      $('#mname').empty()
      for (let i = 0; i < arr.length; i++) {
        $('#mname').append(`<option value="${arr[i]}">${arr[i]}</option>`)
      }
    })
  })

  let flag = false
  $('.select_file').on('change', function () {
    flag = true
  })

  // 提交数据
  $('#add-stu').on('submit', function (e) {
    e.preventDefault()
    // 检验数据
    let noExp = /^\d{10}$/
    let nameExp = /^[\u4e00-\u9fa5]{2,4}$/
    let idcardExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    let addrExp = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/

    let no = $('#no').val()
    let name = $('#name').val()
    let idcard = $('#idcard').val()
    let address = $('#address').val()
    let grade = $('#grade').val()
    let entrance_time = $('#entrance_time').val()

    let province = $('#province').val()
    let major = $('#mtype').val()

    if (!noExp.test(no)) {
      $('#no').val('学号必须为 10 位数字')
      setFailCss($('#no'), $('.g-no'))
      return
    } else {
      setSuccessCss($('#no'), $('.g-no'))
    }
    if (!nameExp.test(name)) {
      $('#name').val('姓名必须是 2 到 4 位汉字')
      setFailCss($('#name'), $('.g-name'))
      return
    } else {
      setSuccessCss($('#name'), $('.g-name'))
    }
    if (!idcardExp.test(idcard)) {
      $('#idcard').val('身份证号不正确！')
      setFailCss($('#idcard'), $('.g-idcard'))
      return
    } else {
      setSuccessCss($('#idcard'), $('.g-idcard'))
    }
    if (province === '-- 请选择 --') {
      $('#province').css({
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 5px #d9534f',
        'border-color': '#d9534f'
      })
      return
    } else {
      setSuccessCss($('#province'), $('.g-addr'))
    }
    if (!addrExp.test(address)) {
      $('#address').val('地址不能含有特殊字符')
      setFailCss($('#address'), $('.g-addr-details'))
      return
    } else {
      setSuccessCss($('#address'), $('.g-addr-details'))
    }
    if (major === '-- 请选择 --') {
      $('#mtype').css({
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 5px #d9534f',
        'border-color': '#d9534f'
      })
      return
    } else {
      setSuccessCss($('#mtype'), $('.g-major'))
    }
    if (!grade || grade < 1970 || grade > 2050) {
      $('#grade').val('年级不正确！')
      setFailCss($('#grade'), $('.g-grade'))
      return
    } else {
      setSuccessCss($('#grade'), $('.g-grade'))
    }
    if (!entrance_time) {
      setFailCss($('#entrance_time'), $('.g-time'))
      return
    } else {
      setSuccessCss($('#entrance_time'), $('.g-time'))
    }
    if (!flag) {
      $('.ava-img').css({
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 5px #d9534f',
        'border-color': '#d9534f'
      })
      return
    } else {
      $('.ava-img').css({
        'box-shadow': 'none',
        'border-color': ''
      })
    }

    $.ajax({
      url: '/add_stu',
      method: 'post',
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      data: new FormData($('#add-stu')[0]),
      dataType: 'json',
      success: function (data) {
        if (data.res_code === 9) {
          $('.g-success').css('display', 'block')
          $('.add-text').css('display', 'none')
          $('.suc').css('display', 'block')
          setTimeout(function () {
            window.location.href = '/sch_unchecked'
          }, 1500)
        } else if (data.res_code === 10) {
          $('#no').val('学号已存在')
          setFailCss($('#no'), $('.g-no'))
        } else if (data.res_code === 11) {
          $('#idcard').val('身份证号已存在')
          setFailCss($('#idcard'), $('.g-idcard'))
        }
      }
    })
  })

  /**
   * 设置输入错误的样式
   * @param input 输入框
   * @param icon 对勾
   */

  function setFailCss(input, icon) {
    input.css({
      'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 5px #d9534f',
      'border-color': '#d9534f'
    })
    icon.css('display', 'none')
    setTimeout(function () {
      input.val('')
    }, 1500)
  }

  /**
   * 设置输入正确的样式
   * @param input 输入框
   * @param icon 对勾
   */

  function setSuccessCss(input, icon) {
    input.css({
      'box-shadow': 'none',
      'border-color': ''
    })
    icon.css('display', 'block')
  }
})

