$(function () {
  // 添加年份
  for (let i = 0; i <= 30; i++) {
    $('#entrance-time').append(`<option value="${2000+i}">${2000+i}</option>`)
  }

  $('.sch-query').click(function (e) {
    e.preventDefault()
    $('.tbody').empty()
    let mtype = $('#mtype').val()
    let mname = $('#mname').val()
    let time = $('#entrance-time').val()
    $.post('/query_stu', {
      mtype: mtype,
      mname: mname,
      entrance_time: time
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