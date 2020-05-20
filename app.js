const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express()
require('dotenv').config()
const axios = require('axios');
require('express-router-group');
const router = express.Router();
const path = require('path');
const PuppeteerNew = require(path.join(__dirname, '/library/Puppeteer'));
const Puppeteer = new PuppeteerNew;
 
global.axios = axios;
global.router = router;
global.fs = fs;
global.path = path;
global.that = Puppeteer;

// start router the first and goto url google.com
(async() => {
	await that.settingRequest();
	let googleTranslate = await that.goToTranslation();
	let checkUrl = await that.page.evaluate(() => location.href);
	
	if (checkUrl != process.env.URL_TRANSLATE) {
		that.closePage();
		await that.settingRequest();
		googleTranslate = await that.goToTranslation();
	}
	if (googleTranslate.status == 'error'
		&& googleTranslate.message.indexOf('ERR_INTERNET_DISCONNECTED') != -1) {
		console.log('The network has experienced a problem');
		process.exit(1);
	}
	if (googleTranslate.status == 'error') {
		console.log('There was an error opening google! Please try it again. '+ googleTranslate.message);
		process.exit(1);
	}
})();

// include router
const routers = require('./routers/router');
app.use('/', routers);

var options = {
	key: fs.readFileSync('server/client-key.pem'),
	cert: fs.readFileSync('server/client-cert.pem')
};

// Create an HTTP service.
http.createServer(app).listen(process.env.PORT_HTTP);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(process.env.PORT_HTTPS, () => {
	console.log(`Server running on port https://localhost:${process.env.PORT_HTTPS}`);
	console.log(`Server running on port http://localhost:${process.env.PORT_HTTP}`);
});