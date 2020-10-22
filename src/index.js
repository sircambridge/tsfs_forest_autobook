// require('update-electron-app')()
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

require('update-electron-app')()

const webhook = require("webhook-discord")
 
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/768619827732283402/WY98Oo2P7-pdOq-XVoyPJTGBLPLLJNzR5k1UDvgp6Y_ZL4i6-E75p2KyPUcrDKqm2zdg")
var DiscordHook ={}
for (const key of ['info','warn','err','success']) {
  DiscordHook[key] = (a,b) => {
    try {Hook[key](a,b.substring(0, 1024))} 
    catch (error) {console.log(error)}
  }
}



var old_log = console.log;
console.log = function() {
  let new_args = Array.from(arguments);
  var d = new Date();
  new_args.unshift(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
  old_log.apply(null,new_args)
};

var mainWindow = null;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // frame: false,
    width: 330,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true, contextIsolation: true 
    }
  });
  mainWindow.setMenuBarVisibility(false);
  // mainWindow.setTitle("1")
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const puppeteer = require('puppeteer')

async function main(params) {
  let browser = await puppeteer.launch({ 
    headless: false ,
    userDataDir: __dirname +'/tmp',
  })
  const pages = await browser.pages()
  const page = pages[0]
  await page.setViewport({ width: 300, height: 250 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  if(sleepTime) await sleep(sleepTime)
  // let cookies = await page.cookies('https://www.newegg.com/')
}

const {ipcMain} = require('electron');


// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
  console.log(arg);
  if(arg.message == 'login'){
    login()
  }
  if(arg.message == 'search'){
    search(arg.someData)
  }
  // main()
});

// const RemoteEval = class { 
//   constructor() { 
//     this.code = null; 
//     this.resolver = null; 
//     ipcMain.on('code', (event, arg) => {
//       resolver(arg)
//     });
//   } 
  
//   run(code) { 
//     new Promise(function(resolve, reject) {
//       this.resolver = resolve;
//       mainWindow.webContents.send('code', code);
//     });
//   } 
// }; 
let resolver = null;
ipcMain.on('code', (event, arg) => {
  resolver(arg)
});
function evalRemote(code) {
  return new Promise(function(resolve, reject) {
    resolver = resolve;
    mainWindow.webContents.send('code', code);
  });
}

var label2 = {
  setText : (text) => {
    mainWindow.webContents.send('label2', text);
  }
}
var label3 = {
  setText : (text) => {
    mainWindow.webContents.send('label2', text);
  }
}

var bookSuccess = false;

let browser = null;
let page = null;
async function login(params) {
  browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: __dirname +'/tmp3',
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.setViewport({ width: 1000, height: 1000 });
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    if(req.url().includes("code=member")){
      console.log(req.method(),req.url());
      setTimeout(loggedin,200)
      // loggedin();
    }
    if(req.url().includes("code=step2")){
      console.log(req.method(),req.url());
      setTimeout(loggedin,200)
      // loggedin();
    }
    // console.log(req.url());
    req.continue();
  });
  await page.goto("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step1", { waitUntil: 'networkidle2' })


}


//您的帳號為：
// sircambrid
// NEGFbdjz9978
var tough = require('tough-cookie');
const fs = require('fs');
var Cookie = tough.Cookie;
let jar = new tough.CookieJar();
async function loggedin(params) {
  // await sleep(2000)
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  if(page.url().includes("code=step1")){
    return;
  }
  label2.setText("登入成功!");
  DiscordHook.info("LOGIN","登入成功!");
  let cookies = await page.cookies('https://tsfs.forest.gov.tw/')
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
    for (var i = 0; i < cookies.length; i++) {
      jar.setCookie(`${cookies[i].name}=${cookies[i].value}; path=/; Secure`,'https://tsfs.forest.gov.tw/',{secure:true})
    }
    // await sleep(1000)
  await browser.close();
  await submitTOS();
}


const fetchit = require('node-fetch');
const got = require('got')
async function fetch(url,options,timeout=5000) {
  console.log('fetch',url);
  options.headers['user-agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.0 Safari/537.36"
  options.headers['cookie'] = await jar.getCookieString('https://tsfs.forest.gov.tw/')
  console.log("AFTER options.headers['cookie']", options.headers['cookie']);
  // options.headers['referer'] = options.referrer
  options.timeout = timeout;
  options.retry = 3;
  if(options.method == 'GET'){
    delete options.body;
  }
  try {
    response = await got(url,options)
  } catch (error) {
    console.log("ERROR",error);
    DiscordHook.err("ERROR",error.stack.substring(0, 1024));
  }
  response.text = ()=>{
    return response.body;
  }
  
  try{
    // console.log("response.headers.raw()['set-cookie']",response.headers.raw()['set-cookie']);
    let cookies = response.headers.raw()['set-cookie']
    for (var i = 0; i < cookies.length; i++) {
      let newCookie = Cookie.parse(cookies[i])
      console.log(newCookie);
		  delete jar.store.idx['tsfs.forest.gov.tw']['/'][newCookie.key]
      jar.setCookie(cookies[i],'https://tsfs.forest.gov.tw/',{secure : true})
    }
  }catch(e){}

  return response
}

async function read_cookies() {
  jar = new tough.CookieJar();
  let cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'))
  for (var i = 0; i < cookies.length; i++) {
    console.log('read cookie', cookies[i]);
    jar.setCookie(`${cookies[i].name}=${cookies[i].value}; path=/; Secure`,'https://tsfs.forest.gov.tw/',{secure:true})
  }
}
let thetimeout = null;
async function search() {
  clearTimeout(thetimeout)
  label2.setText("...");

  let res = await evalRemote(`var r = {
    year: document.querySelector('#year').value,
    month: document.querySelector('#month').value,
    day: document.querySelector('#day').value,
    autobook: document.querySelector('#autobook').checked,
    retry: document.querySelector('#retry').checked,
  }; r`);
  year = res.year; month = res.month; day = res.day; autobook = res.autobook; retry = res.retry;
  console.log({day,month,year,autobook,retry});
  // let year = dateEdit.date().year();
  // let month = dateEdit.date().month();
  // let day = dateEdit.date().day();
  console.log('search',year,month,day);
  let body = await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step5&year="+year+"&m="+month, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.1730903535.1602153725; _gid=GA1.3.523273009.1602153725; PHPSESSID=vi8r71kuc1javfu0d8mn9kcmo7"
    },
    "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step5",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  console.log(1111);
  let html = await body.text();
  console.log(123123);
  fs.writeFileSync('tmp.html',html)
  //<td cell_index=8 >本日客滿</td>
  // <td cell_index=9 >尚未開放!</td>
  //<td cell_index=5 ><input type='checkbox' name='d[]' value='5' /><br />滑雪山莊:42人<br /> 松雪樓客滿</td>
  try{
    var text = html.split('cell_index='+day)[1].split('</td>')[0];
    // let str = "d><td cell_index=9 ><input type='checkbox' name='d[]' value='9' /><br />滑雪山莊:19人<br /> 松雪樓客滿</td><td cell_index=10 >尚未開放";
  }catch(e){
    label2.setText("請重新登入!")
    return
  }
  if(text.includes('尚未開放')){
    label2.setText(month+'/'+day+'/'+year+' '+'尚未開放')
  }
  if(text.includes('本日客滿')){
    label2.setText(month+'/'+day+'/'+year+' '+'本日客滿')
  }
  if(text.includes('松雪樓客滿')){
    label2.setText(month+'/'+day+'/'+year+' '+'松雪樓客滿')
  }
  let m4 = text.match(/松雪樓:4人套房:[0-9]+間/g);
  if(m4){
    label2.setText(month+'/'+day+'/'+year+' '+m4[0]);
    try {
      fs.writeFileSync('vacacy4.html',html);
    } catch { }
    
    if(autobook){
      await reserve1(month,day,year);
      return
    }
  }
  let m2 = text.match(/松雪樓:景觀2人:[0-9]+間/g);
  if(m2){
    label2.setText(month+'/'+day+'/'+year+' '+m2[0]);
    try {
      fs.writeFileSync('vacacy2.html',html);
    } catch { }
    if(autobook){
      await reserve1(month,day,year);
      return
    }
  }
  // 松雪樓:景觀2人:17間<br />
// 松雪樓:精緻冷杉林2人房:7間<br />
  // let m3 = text.match(/滑雪山莊:[0-9]+人/g);
  // if(m23){
  //   label2.setText(month+'/'+day+'/'+year+' '+m3[0])
  //   if(autocheckout.checkState()==2){
  //     await reserve3(month,day,year);
  //     return
  //   }
  // }
  
  // let json = JSON.parse(html)
  // return json
  console.log(month+'/'+day+'/'+year+' '+text);
  // label2.setText(month+'/'+day+'/'+year+' '+text)
  if(retry){
    if(!bookSuccess){
      thetimeout = setTimeout(()=>{
        search()
      },3000)
    }
  }
  console.log(arguments);
}

async function step6({month,day,year}) {
  let body = await fetch('https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step6', {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36 Edg/86.0.622.48',
            'Origin': 'https://tsfs.forest.gov.tw',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step5&year=2020&m=11',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': [
                "_ga=GA1.3.94433970.1602145418",
                "PHPSESSID=1v1olgcsqvik3t8gp2a0c453s5",
                "_gid=GA1.3.310648609.1603317937",
                "_gat=1"
            ].join("; ")
        },
        body: [ `year=${year}`, `m=${month}`, "d%5B%5D=18", "x=99", "y=12" ].join("&")
  });
  
  let html = await body.text();
  fs.writeFileSync('step6.html',html);
  
}

async function reserve1(month,day,year) {
  await step6({month,day,year})
  label3.setText('訂房中...');
  let postbody = [
    encodeURIComponent(`room_nums[${year}-${month}-${day}][110]`)+"=1",   
    encodeURIComponent(`room_nums[${year}-${month}-${day}][116]`)+"=0", 
    "x=93",
     "y=14"
    ].join('&')
  console.log('reserve1', postbody);
  let body = await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step7", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5"
      },
      "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step6",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body":postbody,
      "body": "room_nums%5B2020-10-28%5D%5B110%5D=1&room_nums%5B2020-10-28%5D%5B116%5D=0&x=93&y=14",
      "method": "POST",
      "mode": "cors"
    });
  let html = await body.text()
  fs.writeFileSync('reserve1.html',html)
  await reserveconfirm()
  // let json = JSON.parse(html)
  // return json
}
async function reserveconfirm(argument) {
  let body = await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step8", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5; _gat=1"
    },
    "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step7",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "travel_card=1&remarks=&x=679&y=753",
    "method": "POST",
    "mode": "cors"
  });
  let html = await body.text()
  fs.writeFileSync('reserveconfirm.html',html)
  label3.setText('訂房成功!!!!')
  bookSuccess=true;
  // let json = JSON.parse(html)
  // return json
}

async function reserve3(month,day,year) {
  label3.setText('訂房中...');
  let postbody = [
    encodeURIComponent(`room_nums[${year}-${month}-${day}][110]`)+"=0", 
    encodeURIComponent(`room_nums[${year}-${month}-${day}][116]`)+"=1", 
    "x=93",
     "y=14"
    ].join('&')
  console.log('reserve3', postbody);
  let body = await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step7", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5"
      },
      "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step6",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body":postbody,
      // "body": "room_nums%5B2020-10-28%5D%5B110%5D=1&room_nums%5B2020-10-28%5D%5B116%5D=0&x=93&y=14",
      "method": "POST",
      "mode": "cors"
    });
  let html = await body.text()
  fs.writeFileSync('reserve3.html',html)
  await reserveconfirm()
  // let json = JSON.parse(html)
  // return json
}

async function submitTOS(argument) {
  let body = await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step1", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5"
    },
    "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step3", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5"
    },
    "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step2",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "country_no=%7Bcountry_no%7D&country=%7Bcountry_no%7D&country=%7Bcountry_no%7D&country=1&x=62&y=11",
    "method": "POST",
    "mode": "cors"
  });
  await fetch("https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step5", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.94433970.1602145418; _gid=GA1.3.301950299.1602145418; PHPSESSID=8ukfbqgducqctcqkut3s15g4a5; _gat=1"
    },
    "referrer": "https://tsfs.forest.gov.tw/cht/index.php?act=resveration&code=step3",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "hotel=3&x=47&y=8",
    "method": "POST", 
    "mode": "cors"
  });
  let html = await body.text()

}

async function new_func(argument) {
  let body = await null
  let html = await body.text()
  let json = JSON.parse(html)
  return json
}

(async function go(){
  await read_cookies();

  // await search(2020,11,11);
})()
