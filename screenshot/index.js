const puppeteer = require('puppeteer');
(async () => {
  const browser = await (puppeteer.launch({   // 启动浏览器实例
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    executablePath: 'D:/app/chromium/chrome-win32/chrome.exe',
    //设置超时时间
    timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 打开headless模式, 会关闭浏览器
    headless: true
  }));
  const page = await browser.newPage();      // 创建一个新页面
  await page.goto('https://www.baidu.com');  // 进入指定网页
  await page.screenshot({                    // page.screenshot
    path: 'baidu.png',
    type: 'png',
    // quality: 100, 只对jpg有效
    // fullPage: true
    // 指定区域截图，clip和fullPage两者只能设置一个
    clip: {
      x: 0,
      y: 0,
      width: 1000,
      height: 40
    }
  });

  await browser.close();
})();