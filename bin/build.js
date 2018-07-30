#!/usr/bin/env node

const fs = require('fs');

// Add scripts.prestart anda scripts.poststop
const path = "../../../../package.json"
if (fs.existsSync(path)) {
	var result = JSON.parse(fs.readFileSync(path, 'utf8'));
	result.scripts.prestart = "node ./node_modules/esoftplay/bin/cli.js start";
	result.scripts.poststop = "node ./node_modules/esoftplay/bin/cli.js stop";
	fs.writeFile('test.json', JSON.stringify(result, null, 2));
}else{
	console.log(path+" tidak ditemukan!!")
}
console.log("esoftplay/bin/build.js", __dirname)
/*
var Text = "";

Text = '"prestart": "./node_modules/esoftplay/bin/cli.js",'
*/