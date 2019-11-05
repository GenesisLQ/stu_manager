$(function () {
  $('.no').click(function (e) {
    e.preventDefault()
    let no = $(this).html()
    $.get('/get_stu_info', {
      no: no
    }, function (data) {
      $('.address').html(data.address)
      $('.ava-img').attr('src', data.photo)
    })
  })

  let idArr = []
  $('.check').click(function () {
    for (let i = 0; i < $(':checked').length; i++) {
      // 获取 id
      idArr.push($(':checked')[i].value)
    }
    $.post('/check', {
      id: JSON.stringify(idArr)
    }, function (data) {
      if (data.res_code === 13) {
        $('.g-check').css('display', 'none')
        $('.success').css('display', 'block')
        setTimeout(function () {
          window.location.href = '/province-index'
        }, 1000)
      }
    })
  })
})