const TranslateControllerClass =  require('../app/controllers/TranslateController');
const TranslateController      = new TranslateControllerClass();

router.group("/translation", (router) => {
    router.get('/:text/:output_lang', TranslateController.index);
    router.get('/:text/:output_lang/:input_lang', TranslateController.index);
});

module.exports = router;