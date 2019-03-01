let request = require('request')
let cheerio = require('cheerio')
let iconv = require('iconv-lite')

request.get({
  url: 'https://www.guazi.com/hz/buy/',
  encoding: null
}, (err, res, body) => {
  if (err) console.log(err)
  let buf = iconv.decode(body, 'utf-8')

  let $ = cheerio.load(buf, {decodeEntities: false})
  let title = $('title').html()
  console.log(title)

})