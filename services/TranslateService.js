const Puppeteer = require(path.join(__dirname,'../library/Puppeteer'));

class TranslateService extends Puppeteer {

    async input(input_data) {
        await that.page.waitForSelector('#source', {visible: true})
        const data = await that.page.type('textarea[id=source]', input_data, {delay: 0})
        await that.page.waitFor(500);
        return data;
    }

    async clickShowListInputLang() {
        return await that.page.evaluate(()=>document.querySelector('.sl-more').click(),{delay: 300})
    }

    async clickChooseLangInput(inputLang) {
        let tagLangInputHtml = '.sl_list_'+ inputLang +'_checkmark';
        return await that.page.evaluate((tagLangInputHtml, inputLang) => {
            document.querySelector('.language_list_item_wrapper-'+ inputLang +' '+tagLangInputHtml).click(),{delay: 300}
        }, tagLangInputHtml, inputLang);
    }

    async clickShowListOutputLang() {
        return await that.page.evaluate(() => document.querySelector('.tl-more').click(),{delay: 300})
    }
    
    async clickChooseLangOutput(outputLang) {
        let tagLangOutputHtml =  '.tl_list_'+ outputLang +'_checkmark';
        
        return await that.page.evaluate((tagLangOutputHtml, outputLang) => {
            document.querySelector('.language_list_item_wrapper-'+ outputLang +' '+ tagLangOutputHtml).click(),{ delay: 300 }
        }, tagLangOutputHtml, outputLang)
    }

    async resultTranslate() {
        const isLoadingSucceeded = await that.page.$('.result-shield-container .tlid-translation span'). then (res =>!! res);
        // if it matches the input language, it will not be able to span
        await that.page.waitFor(500);
        if (!isLoadingSucceeded) {
            await that.page.waitForSelector('.result-shield-container .tlid-translation', {visible: true});
            return await that.page.evaluate(() => document.querySelector('.result-shield-container .tlid-translation').innerText);
        } else {
            await that.page.waitForSelector('.result-shield-container .tlid-translation span', {visible: true});
            return await that.page.evaluate(() => document.querySelector('.result-shield-container .tlid-translation span').innerText);
        }
    }

    async getDetectedLang() {
        let textDetectedLang = "";
        await that.page.waitForSelector('.sl-sugg-button-container .jfk-button-collapse-right:nth-child(1)', {visible: true});
        await that.page.waitFor(200);
        textDetectedLang = await that.page.evaluate(() => document.querySelector('.sl-sugg-button-container .jfk-button-collapse-right:nth-child(1)').innerText);

        return textDetectedLang;
    }
    
    async clickChooseAutoDetected() {
        return await that.page.evaluate(() => document.querySelector('.language_list_item_wrapper-auto .sl_list_auto_checkmark').click(),{delay: 300})
    }

    async clickChooseAutoDetectedData() {
        let textDetectedLang = "";
        // await that.page.waitForSelector('.language_list_item_wrapper-auto .sl_list_auto_checkmark', {visible: true});
        await that.page.waitFor(500);
        textDetectedLang = await that.page.evaluate(() => document.querySelector('.sl-sugg-button-container .jfk-button-checked').innerText);

        return textDetectedLang;
    }

    async beforeClearValue() {
        await that.page.evaluate(function() {
            document.querySelector('textarea[id=source]').value = ''
        })
    }
}

module.exports = TranslateService;