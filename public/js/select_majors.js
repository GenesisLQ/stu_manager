$(function () {
  // 根据专业名称来选择展示相关专业
  $('#mtype').change(function () {
    let data = $(this).val()
    $.post('/sel_majors_name', {mtype: data}, function (data) {
      let arr = data.data
      $('#mname').empty()
      for (let i = 0; i < arr.length; i++) {
        $('#mname').append(`<option value="${arr[i]}">${arr[i]}</option>`)
      }
    })
  })

  // 添加专业
  $('#select-majors').on('submit', function (e) {
    e.preventDefault()
    let mtype = $('#mtype').val()
    if (mtype === '-- 请选择 --') {
      return
    }
    let formData = $(this).serialize()
    $.post('/sch_select_majors', formData, function (data) {
      if (data.res_code === 7) {
        window.location.href = '/select_majors'
      } else if (data.res_code === 8) {
        $('.show-msg').css('display', 'block')
        setTimeout(function () {
          $('.show-msg').css('display', 'none')
        }, 1200)
      }
    })
  })
})