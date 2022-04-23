const puppeteer = require('puppeteer');
const express = require('express');
var location = require('./location.json')
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cache-Control","max-age=120");
  next();
});

var mcache = require('memory-cache');

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}


var router = express.Router()

router.use(function(req, res, next) {
    console.log('Node Server entering the middleware');
    next();
});

router.route('/')
		.get(cache(60), async function(req, res){
  const browser = await puppeteer.launch({ headless: true,args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--deterministic-fetch',
    '--disable-features=IsolateOrigins',
    '--disable-site-isolation-trials',
], });

  const page = await browser.newPage();
  await page.goto('https://www.mohfw.gov.in/');
  await page.waitForSelector('.open-table');
  await page.click('.open-table');
  await page.waitForSelector('tbody');

  let state = await page.evaluate(() => {
    let tableHeaders = ['index','location','totalActive','activeChange','curedCumulative','curedChange','deathsCumulative','deathsChangeDuringDay','deathsChangeReconciled','deathsChangeTotal'];
      let rows = document.body.querySelectorAll('#state-data > div > div > div > div > table > tbody > tr');
      let output = Array.from(rows, row => {
        const columns = row.querySelectorAll('td');
        const tableRow = {};
        for (let i = 0; i < columns.length; i++) {
          if(i==0 && isNaN(columns[i].innerText) && isNaN(parseFloat(columns[i].innerText))) {
            break;
          }
          tableRow[tableHeaders[i]] = "0"
          if(columns[i].innerText !== "" && columns[i].innerText !==" "){
            if((columns[i].innerHTML).includes("down")) {
              tableRow[tableHeaders[i]] = `-${columns[i].innerText}`
            }
            else {
              tableRow[tableHeaders[i]] = columns[i].innerText
            }
          }
        }
        return tableRow;
      });
      const data = output.filter(element => {
        if (Object.keys(element).length !== 0) {
          return true;
        }
        return false;
      });
      const sortedOutput= data.sort((a,b) => (a.location > b.location) ? 1 : ((b.location > a.location) ? -1 : 0));
      return sortedOutput;
  });
    await browser.close();

    let merged = [];
    for(let i=0; i<state.length; i++) {
      merged.push({
       ...state[i], 
       ...(location.find((itmInner) => (state[i].location).includes(itmInner.location)))}
      );
    }
    console.log('Sending Covid Data')
    res.send(merged)
})

app.use('/api',router)

app.listen(8081,()=> {console.log("Node Server Running on PORT:8081")})
