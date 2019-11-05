$(function () {
  // 根据专业名称来选择展示相关专业
  $('#school').change(function () {
    console.log('123')
    let data = $(this).val()
    $.post('/show_majors', {school: data}, function (data) {
      let arr = data.mname
      $('#mname').empty()
      for (let i = 0; i < arr.length; i++) {
        $('#mname').append(`<option value="${arr[i]}">${arr[i]}</option>`)
      }
    })
  })

  // 添加年份
  for (let i = 0; i <= 30; i++) {
    $('#grade').append(`<option value="${2000+i}">${2000+i}</option>`)
  }

  $('.pro-query').click(function (e) {
    e.preventDefault()
    $('.tbody').empty()
    let school = $('#school').val()
    let mname = $('#mname').val()
    let grade = $('#grade').val()
    $.post('/pro_query_stu', {
      school: school,
      mname: mname,
      grade: grade
    }, function (data) {
      let students = data.students
      $('.result').html(`已查询到 ${students.length} 人`)
      for (let i = 0; i < students.length; i++) {
        let no = students[i].no
        let name = students[i].name
        let gender = students[i].gender
        let idcard = students[i].idcard

        let school = students[i].school
        let major_name = students[i].major_name
        let grade = students[i].grade
        let time = students[i].entrance_time.slice(0, 10)
        let status = students[i].status

        $('.tbody').append(`
        <tr>
          <td>${no}</td>
          <td>${name}</td>
          <td>${gender}</td>
          <td>${idcard}</td>
          <td>${school}</td>
          <td>${major_name}</td>
          <td>${grade}</td>
          <td>${time}</td>
        </tr>`)
      }
    })
  })
})