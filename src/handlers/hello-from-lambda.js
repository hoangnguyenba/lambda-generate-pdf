const chromium = require('chrome-aws-lambda');

/**
 * A Lambda function that returns a static string
 */
exports.helloFromLambdaHandler = async () => {
    // If you change this message, you will need to change hello-from-lambda.test.js
    const pdfBuffer = await createPDF('https://sparksuite.github.io/simple-html-invoice-template/')
    // All log statements are written to CloudWatch
    // console.info(`${message}`);
    
    return pdfBuffer.toString();
}

const createPDF = async (url) => {
    // launch a new chrome instance
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
  
    // create a new page
    const page = await browser.newPage()
  
    // set your html as the pages content
    // const html = fs.readFileSync(`${__dirname}/template.html`, 'utf8')
    // await page.setContent(html, {
    //   waitUntil: 'domcontentloaded'
    // })
  
    await page.goto(url, {
      waitUntil:[ 'load', 'networkidle0'], // wait for page to load completely
    });
  
    // create a pdf buffer
    const pdfBuffer = await page.pdf({
      format: 'A4'
    })
  
    // close the browser
    await browser.close()
  
    return pdfBuffer
}