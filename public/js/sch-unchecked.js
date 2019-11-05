$(function () {
  $('#check-all').click(function () {
    if (this.checked) {
      $('.select').prop('checked', true)
    } else {
      $('.select').prop('checked', false)
    }
  })

  let idArr = []
  $('.apply').click(function () {
    for (let i = 0; i < $(':checked').length; i++) {
      // 获取 id
      idArr.push($(':checked')[i].value)
    }
    $.post('/sch_unchecked', {
      id: JSON.stringify(idArr)
    }, function (data) {
      if (data.res_code === 12) {
        window.location.reload()
      }
    })
  })
})