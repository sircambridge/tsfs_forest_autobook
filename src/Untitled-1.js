
let html = asdfasdfadsf<h6 class="date">2020/07/06</h6>asdfasddf

let date = html.split('<h6 class="date">')[1].split('</h6>')[0]

console.log(date)