var TranslateServiceClass = require('../../services/TranslateService');
const TranslateService = new TranslateServiceClass;
const definedLang = require('../../config/lang');

class TranslateController {

    async index(req, res) {
        var outputTranslation = [];
        let dataError = [];
        let textInput = decodeURI(req.params.text);
        textInput = textInput.split("&#37;").join("%");
        let outputLangString = req.params.output_lang;
        let inputLang = req.params.input_lang;
        let outputLang = JSON.parse(outputLangString);
        let dataDetectedLang = "";
        
        await TranslateService.clickShowListInputLang();
        await TranslateService.clickChooseAutoDetected();
        await TranslateService.input(textInput);
        dataDetectedLang = await TranslateService.clickChooseAutoDetectedData();
        dataDetectedLang = dataDetectedLang.split("-")[0];

        // has lang
        if (inputLang != undefined) {
            await TranslateService.clickShowListInputLang();
            await TranslateService.clickChooseLangInput(inputLang);
        }

        for(const element of outputLang) {
           try {
            await TranslateService.clickShowListOutputLang();
            await TranslateService.clickChooseLangOutput(element);
            let textOuput = await TranslateService.resultTranslate();
            
            outputTranslation.push({
                outputlang: element,
                text: textOuput
            })
           } catch (exception) {
                dataError.push(exception.message);
           }
        }

        TranslateService.beforeClearValue();
        definedLang.LangArray.forEach(element => {
            if (element.text == dataDetectedLang.trim()) {
                dataDetectedLang = element.key;
            }
        });
        if (dataError.length > 0) {
            res.status(500).send(
                {
                    result: dataError,
                    fromlang: [
                        'No language detected'
                    ],
                }
            );
        } else {
            res.status(200).send(
                {
                    result: outputTranslation,
                    fromlang: [
                        dataDetectedLang
                    ],
                }
            );
        }
    }
}

module.exports = TranslateController;