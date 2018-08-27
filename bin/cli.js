#!/usr/bin/env node

const { spawn } = require('child_process');
var app = require('../watch')
var fs = require('fs')

function execution()
{
	var ret = spawn('node', ['node_modules/esoftplay/bin/router.js'])
	ret.stdout.on('data', function (data) {
	  console.log(data.toString());
	});
	ret.stderr.on('data', function (data) {
	  console.log('stderr: ' + data.toString());
	});
}

var paths = ["./assets/", "./modules/", "./templates/"]
var args = process.argv.slice(2);
switch(args[0]) {
	case "start":
		execution();
		// var nd = spawn('node', ['node_modules/.bin/esoftplay', 'watch']);
		// var nd = spawn('node', ['node_modules/.bin/esoftplay', 'watch']);
		// nd.stdout.on('data', function(data) {
		// 	console.log('stdout (' + nd.pid + '): ' + data);
		// });
		// console.log("sduhfsdfsd sdf ")
		break;
	case "test":
		// execution();
		var nd = spawn('node', ['node_modules/.bin/esoftplay', 'watch'], {
			stdio: 'ignore',
			detached: true
		}).unref();
		break;
	case "watch":
		for (var i = 0; i < paths.length; i++) {
			const path = paths[i]
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			app.watchTree(path, function (f, curr, prev) {
				if (curr!=null || prev!=null) {
					execution()
				}
			})
		}
		break;
	case "stop":
		for (var i = 0; i < paths.length; i++) {
			const path = paths[i]
			app.unwatchTree(path)
		}
		break;
}