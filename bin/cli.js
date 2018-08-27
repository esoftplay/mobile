#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
var app = require('../watch')
var modpath = ["templates/", "modules/", "node_modules/esoftplay/modules/"];
var syspath = ["./assets/", "./modules/", "./templates/"]
var cacheDir = "./node_modules/esoftplay/cache/";
var cachePID = cacheDir+"pid.txt";
var args = process.argv.slice(2);
var action = args[0];

// console.log(modpath, "sdofsjdofjsd")
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
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir);
		}
		fs.writeFile(cachePID, newPID, (err) => {
		  if (err) throw err;
		  // console.log('new PID has been cached');
		});
	}
}
function watchstop() {
	if (fs.existsSync(cachePID)) {
		var oldPID = fs.readFileSync(cachePID, 'utf8').trim();
		if (oldPID) {
			spawn("kill", [oldPID], {stdio: 'ignore', detached: true }, function(stat){
				fs.unlink(cachePID);
			});
		}
	}
}
function getFile(module) {
	var out = '';
	var file;
	for (var i = 0; i < modpath.length; i++) {
		file = modpath[i]+module+'.js';
		if (fs.existsSync('./'+file)) {
			out = file;
			break;
		}
	}
	return out;
}
function getFiles(module) {
	var out = [];
	var file;
	for (var i = 0; i < modpath.length; i++) {
		file = modpath[i]+module+'.js';
		if (fs.existsSync('./'+file)) {
			out.push(file);
		}
	}
	return out;
}
function codeTemplate(ClassName, ClassUpper, ClassImport) {
	var Template = "{$ClassImport$}\
import { View } from 'react-native';\n\
\n\
class {$ClassName$} extends {$ClassUpper$} {\n\
  state = {\n\
\n\
  }\n\
\n\
  render = () =>{\n\
    return (\n\
      <View style={{ flex: 1 }}>\n\
\n\
      </View>\n\
    );\n\
  }\n\
}\n\
modules.exports = {$ClassName$}"
	return Template.replace(/\{\$ClassName\$\}/g, ClassName).replace(/\{\$ClassUpper\$\}/g, ClassUpper).replace(/\{\$ClassImport\$\}/g, ClassImport)
}
function codeReducer(ClassName, ClassUpper, ClassImport) {
	var Template = "{$ClassImport$}\
import { View } from 'react-native';\n\
\n\
class {$ClassName$} extends {$ClassUpper$} {\n\
	/* ------START REDUX------ */\n\
  static initState = {\n\
\n\
  }\n\
  static reducer = (state = {$ClassName$}.initState, action) => {\n\
    switch (action.type) {\n\
      case 'action':\n\
        return {\n\
          ...state,\n\
          \n\
        }\n\
        break;\n\
      default:\n\
        return state\n\
    }\n\
  }\n\
  static action = {\n\
\n\
  }\n\
  static mapStateToProps = (state) => {\n\
    return {\n\
      props: state\n\
    }\n\
  }\n\
  /* ------END REDUX------ */\n\
  state = {\n\
\n\
  }\n\
\n\
  render = () =>{\n\
    return (\n\
      <View style={{ flex: 1 }}>\n\
\n\
      </View>\n\
    );\n\
  }\n\
}\n\
modules.exports = connect({$ClassName$}.mapStateToProps)({$ClassName$});"
	return Template.replace(/\{\$ClassName\$\}/g, ClassName).replace(/\{\$ClassUpper\$\}/g, ClassUpper).replace(/\{\$ClassImport\$\}/g, ClassImport)
}
switch(action) {
	// esoftplay help
	case 'help':
		var Help = "ESP(1)                    BSD General Commands Manual                    ESP(1)\n\
\n\
NAME\n\
  esp -- esoftplay framework command-cli\n\
\n\
SYNOPSIS\n\
  esp [option [module/filename]]\n\
\n\
DESCRIPTION\n\
  The following options are available:\n\
    - test     = rebuild all routers\n\
    - start    = start execution (execute automatically when starting the program)\n\
    - watch    = detect when you've made code changes and then automatically build router\n\
    - stop     = stop watching code changes\n\
    - help     = display help\n\
    - c/create = create new module\n\
    - e/edit   = edit module\n\
    - l/list   = display all possible routing\n\
    - n/new    = create new module along with 'reducer'\n\
    - i/info   = display file priority from the module\n\
    - v/view   = concatenate and print file from any module\n\
\n\
EXAMPLE\n\
  - esp create modulename/taskname [OR] esp c modulename/taskname\n\
  - esp list modulename [OR] esp l modulename\n\
  - esp modulename/taskname\n\
  PS: Do not use any option, if you want to display all routing list\n\
";
		console.log(Help)
		break;
	// esoftplay test
	// esoftplay start
	case "test":
	case "start":
		execution();
		watcher();
		break;
	// esoftplay watch
	case "watch":
		for (var i = 0; i < syspath.length; i++) {
			var path = syspath[i]
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
	// esoftplay stop
	case "stop":
		watchstop();
		for (var i = 0; i < syspath.length; i++) {
			var path = syspath[i]
			app.unwatchTree(path)
		}
		break;
	default:
		var mods = [];
		if (fs.existsSync(cacheDir)) {
			if (fs.existsSync(cacheDir+'navigations.js')) {
				var navs = fs.readFileSync(cacheDir+'navigations.js', 'utf8').trim();
				var m = navs.match(/\[(.*?)\]/)
				var mods = m[1].substr(1, m[1].length-2).split('", "')
			}
		}
		if (!action) {
			if (mods.length > 0) {
				var rmods = [];
				var maxlength = 0;
				for (var i = 0; i < mods.length; i++) {
					if (mods[i].length > maxlength) {
						maxlength = mods[i].length;
					}
				}
				for (var i = 0; i < mods.length; i++) {
					mod = mods[i];
					var r1 = new RegExp("/modules/"+mod+".js");
					var r2 = new RegExp("/"+mod+".js");
					file = getFile(mod)
						.replace(/node_modules\//, '')
						.replace(r1, '')
						.replace(r2, '');
					var j = maxlength-mod.length + 1;
					rmods.push(mod+" ".repeat(j)+" - "+file);
				}
				console.log("Available Modules :\n- "+rmods.join("\n- "))
			}else{
				console.log('the available modules is not rendered yet. please try `esp start` before executing your last command!')
			}
		}else{
			if (action.length == 1 || ['create', 'edit', 'list', 'new', 'info', 'view'].indexOf(action) > -1) {
				var module = args[1];
			}else{
				var module = args[0];
			}
			var modules = module.split('/');
			if (modules.length < 2) {
				modules.push('index');
				module = modules.join('/')
			}
			var output = '';
			switch(action) {
				case 'e':
				case 'edit':
					if (mods.indexOf(module) === -1) {
						output = 'SORRY, "'+module+'" is not available';
					}else{
						var file = getFile(module);
						spawn("code", [file])
						output = 'you can edit "'+file+'" in your editor now'
					}
					break;
				case 'l':
				case 'list':
					var out = [];
					var listmods = [];
					var maxlength = 0;
					for (var i = 0; i < mods.length; i++) {
						mod = mods[i];
						var r = new RegExp("^"+modules[0]);
						if (mod.match(r)) {
							listmods.push(mod);
							if (mod.length > maxlength) {
								maxlength = mod.length;
							}
						}
					}
					for (var i = 0; i < listmods.length; i++) {
						mod = listmods[i];
						var r1 = new RegExp("/modules/"+mod+".js");
						var r2 = new RegExp("/"+mod+".js");
						file = getFile(mod)
							.replace(/node_modules\//, '')
							.replace(r1, '')
							.replace(r2, '');
						var j = maxlength-mod.length + 1;
						out.push(mod+" ".repeat(j)+" - "+file);
					}
					output = "The following modules are available in '"+modules[0]+"':\n- "+out.join("\n- ");
					break;
				case 'c':
				case 'create':
				case 'n':
				case 'new':
					var files = getFiles(module);
					var newFile = '';
					var Cls = (modules[1]=='index') ? modules[0] : modules[1];

					switch(files.length) {
						case 3: // file sudah ada di template
							spawn("code", [files[2]])
							output = '"'+files[2]+'" is already exists, you can edit now'
							break;
						case 2: // file sudah ada di module tp belum ada di template
							newFile = 'templates/'+module+'.js'
							ClassName = 'T'+Cls;
							ClassUpper = 'M'+Cls;
							ClassImport = 'import '+ClassUpper+' from "../../modules/'+module+'";'+"\n";
							break;
						case 1: // file sudah ada di system tp belum ada di module
							newFile = 'modules/'+module+'.js'
							ClassName = 'M'+Cls;
							ClassUpper = 'E'+Cls;
							ClassImport = 'import '+ClassUpper+' from "esoftplay/modules/'+module+'";'+"\n";
							break;
						case 0: // file belum tersedia di manapun
							newFile = 'modules/'+module+'.js'
							ClassName = 'M'+Cls;
							ClassUpper = 'Component';
							ClassImport = 'import React, { Component } from \'react\';'+"\n";
							break;
					}
					if (newFile) {
						output = '"'+newFile+'" has been created, please make changes!'
						var content = '';
						if (action=='n' || action=='new') {
							content = codeReducer(ClassName, ClassUpper, ClassImport);
						}else{
							content = codeTemplate(ClassName, ClassUpper, ClassImport);
						}
						var dirs = newFile.split('/');
						var dir = '';
						var j = dirs.length-1; // index terakhir adalah nama file jd jgn dibuat folder nya
						for (var i = 0; i < j; i++) {
							dir += dirs[i]+'/'
							if (!fs.existsSync(dir)) {
								fs.mkdirSync(dir);
							}
						}
						fs.writeFile(newFile, content, (err) => {
							if (err) throw err;
							spawn("code", [newFile])
						});
					}
					break;
				case 'i':
				case 'info':
					var files = getFiles(module);
					if (files.length > 0) {
						output = "Priority file in '"+module+"':\n- "+files.join("\n- ");
					}else{
						output = "SORRY, '"+module+"' is not available!";
					}
					break;
				case 'v':
				case 'view':
				default:
					var file = getFile(module);
					if (file.length > 0) {
						output = fs.readFileSync('./'+file).toString()+"\n\n## "+file+"\n";
					}else{
						output = "SORRY, '"+module+"' is not available!";
					}
					break;
			}
			if (output) {
				console.log(output);
			}
		}
		break;
}