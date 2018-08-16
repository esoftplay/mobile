#!/usr/bin/env node

const { spawn } = require('child_process');
var app = require('../watch')
var fs = require('fs')

var paths = ["./assets/", "./modules/", "./templates/"]
var args = process.argv.slice(2);
function execution() {
	var ret = spawn('node', ['node_modules/esoftplay/bin/router.js'])
	ret.stdout.on('data', function (data) {
	  console.log(data.toString());
	});
	ret.stderr.on('data', function (data) {
	  console.log('stderr: ' + data.toString());
	});
	// ret.on('exit', function (code) {
	//   console.log('child process exited with code ' + code.toString());
	// });
}
if (args[0] == "start") {
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
	execution()
}else
if (args[0] == "stop") {
	for (var i = 0; i < paths.length; i++) {
		const path = paths[i]
		app.unwatchTree(path)
	}
}