const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');

module.exports = class Puppeteer {

    async settingRequest() {
        that.browser = await puppeteer.launch({defaultViewport: null, headless: true})
        that.page = await that.browser.newPage();
       
        // Close poppup
        that.page.on('dialog', async dialog => {
            await dialog.dismiss();
        });
        await that.page.setRequestInterception(true);

        that.page.on("request", request => {
            if (["font", "media", "texttrack",
            "object", "beacon", "csp_report",
            "imageset"].indexOf(
                ) !== -1
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    async goToTranslation() {
        let url = process.env.URL_TRANSLATE;

        return await this.goToURL(url);
    }

    async goToURL(url) {
        let object = {
            status: 'success',
            message: ''
        }

        try {
            this.page.setUserAgent(random_useragent.getRandom());
            object.message = await this.page.goto(url, {
                waitUntil: 'networkidle0', 
            });
            await that.page.waitForSelector('textarea[id=source]', {timeout: 3000});
        } catch(exception) {
            return {
                status: 'error',
                message: exception.message
            }
        }

        return object;
    }

    async closePage() {
        return await that.browser.close();
    }

    delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
}