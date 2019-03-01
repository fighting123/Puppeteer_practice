/**
 * Created by huog on 2018/3/21
 */
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await (puppeteer.launch({ // 启动浏览器实例
    executablePath: 'D:/app/chromium/chrome-win32/chrome.exe',
    headless: false
  }))
  const page = await browser.newPage()  // 新建页面
  await page.goto('https://music.163.com/#') // 进入指定页面

  const musicName = '等风来'
  await page.type('.txt.j-flag', musicName, {delay: 0})  // 模拟输入
  await page.keyboard.press('Enter')  // 模拟回车键
  await page.waitFor(2000)
  let iframe = await page.frames().find(f => f.name() === 'contentFrame')  // 获取歌曲列表的iframe
  const SONG_LS_SELECTOR = await iframe.$('.srchsongst')

  const selectedSongHref = await iframe.evaluate(e => {    // 获取歌曲地址
    const songList = Array.from(e.childNodes)
    const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '等风来')
    return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href
  }, SONG_LS_SELECTOR)

  await page.goto(selectedSongHref);

  await page.waitFor(2000)
  iframe = await page.frames().find(f => f.name() === 'contentFrame')   // 获取歌曲页面嵌套的iframe(新打开的页面需要在获取一次iframe)

  const unfoldButton = await iframe.$('#flag_ctrl')     // 点击展开按钮
  await unfoldButton.click()

  const LYRIC_SELECTOR  = await iframe.$('#lyric-content') // 获取歌词内容
  const lyricCtn = await iframe.evaluate(e => {
    return e.innerText
  }, LYRIC_SELECTOR)
  console.log(lyricCtn)

  await page.screenshot({   // 截图
    path: '歌曲.png',
    fullPage: true
  })

  let writerStream = fs.createWriteStream('歌词.txt')  // 写入歌词文件
  writerStream.write(lyricCtn, 'UTF8')
  writerStream.end()

  const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText)  // 获取评论数量
  console.log(commentCount)

  const commentList = await iframe.$$eval('.itm', e => {   // 获取评论列表
    const ctn = e.map(v => {
      return v.innerText.replace(/\s/g, '')
    })
    return ctn
  })
  console.log(commentList)
  // await browser.close();
})();