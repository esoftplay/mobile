#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
var app = require('../watch')
var path = "./node_modules/esoftplay/cache/";
var ppid = path+"pid.txt";

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
function watcher()
{
	watchstop()
	var watch  = spawn('node', ['node_modules/.bin/esoftplay', 'watch'], {stdio: 'ignore', detached: true });
	const newPID = watch.pid;
	watch.unref();
	if (newPID) {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		fs.writeFile(ppid, newPID, (err) => {
		  if (err) throw err;
		  // console.log('new PID has been cached');
		});
	}
}
function watchstop() {
	if (fs.existsSync(ppid)) {
		var oldPID = fs.readFileSync(ppid, 'utf8').trim();
		if (oldPID) {
			spawn("kill", [oldPID], {stdio: 'ignore', detached: true }, function(stat){
				fs.unlinkSync(ppid);
			});
		}
	}
}

var paths = ["./assets/", "./modules/", "./templates/"]
var args = process.argv.slice(2);
switch(args[0]) {
	case "test":
	case "start":
		execution();
		watcher();
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
		watchstop();
		for (var i = 0; i < paths.length; i++) {
			const path = paths[i]
			app.unwatchTree(path)
		}
		break;
}