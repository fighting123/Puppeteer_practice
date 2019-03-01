/**
 * Created by huog on 2018/3/21
 */
/*
* 只是为了练手，实际这种可以通过request和cheerio模块获取的内容，考虑性能问题，还是不要用puppeteer了
* */
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await (puppeteer.launch({    // 启动浏览器实例
    executablePath: 'D:/app/chromium/chrome-win32/chrome.exe',
    headless: false
  }))
  const page = await browser.newPage()          // 新建页面
  await page.goto('https://www.guazi.com/hz/buy/')  // 进入指定页面

  // 获取汽车标题
  let title = await page.title()
  console.log(title)

  // 获取汽车品牌
  const brands_query = '.dd-all.clearfix.js-brand.js-option-hid-info'
  const brands = await page.evaluate((el) => {
    const ulList = Array.from($(el).find('ul li p a'))
    return ulList.map((item) => {
      return item.innerText.replace(/\s/g, '')
    })
  }, brands_query)
  console.log('汽车品牌：', JSON.stringify(brands))

  // 汽车品牌存到本地
  let writeStream = fs.createWriteStream('car_brands.json')
  writeStream.write(JSON.stringify(brands, undefined, 2), 'UTF8')  // 将对象保存为json，第三个是json格式的缩进对象
  writeStream.end()

  // 获取车源列表
  const car_query = 'ul.carlist'
  const cars = await page.evaluate((el) => {
    const carBoxs =  Array.from($(el).find('li a'))
    return carBoxs.map((item) => {
      const title = $(item).find('h2.t').text();
      const subTitle = $(item).find('div.t-i').text().split('|');
      return {
        title: title,
        year: subTitle[0],
        milemeter: subTitle[1]
      };
    })
  }, car_query)
  console.log(`总共${cars.length}辆汽车数据: `, JSON.stringify(cars, undefined, 2))

  // 将车辆信息写入文件（两种写入文件方法）
  fs.writeFileSync('./car_info_list.json',  JSON.stringify(cars, undefined, 2))

  // 关闭浏览器实例
  browser.close()
})()