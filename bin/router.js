#!/usr/bin/env node

const fs = require('fs');
var checks = ['./node_modules/esoftplay/modules/', './modules/', './templates/'];
var pathAsset = "./assets";
var tmpDir = "./node_modules/esoftplay/cache/";
var replacer = new RegExp(/(?:\-|\.(?:ios|android))?\.(?:jsx|js)$/);
var Text = "";
/* CREATE DIRECTORY IF NOT EXISTS */
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}
/* FETCH ALL SCRIPTS */
var Modules = {}; // Object semua module/task yang bisa dipanggil
var Reducers = {}; // Object semua reducer yang akan dikumpulkan
var Jsshift = new RegExp("\.js$");
var checkReducer = new RegExp(/\n\s+static\s+reducer\s{0,}[\=\(]/g);
var checkClass = new RegExp(/\n\s{0,}export\s+default\s+connect\\([^\\)]+\\)\\(\s{0,}(.*?)\s{0,}\\)/g);
var Extender = {};
var grabClass = null;
var delReducer = true;
var countLoop = 0;
var countRead = 0;
checks.forEach(modules => {
  if (fs.existsSync(modules)) {
    fs.readdirSync(modules).forEach(module => {
      if (typeof Modules[module] == "undefined") {
        Modules[module] = {};
      }
      if (fs.readdirSync(modules + module)) {
        fs.readdirSync(modules + module).forEach(file => {
          if (Jsshift.test(file)) {
            var name = file.replace(replacer, '');
            var path = modules + module + "/" + name;
            Modules[module][name] = path;
            countLoop++;
            fs.readFile(modules + module + "/" + file, "utf8", function (err, data) {
              if (err) {
                return console.log(err)
              } else {
                var key = module + "_" + name;
                if (checkReducer.test(data)) { // is contains 'reducer'
                  Reducers[key] = path;
                } else { // not contained 'reducer'
                  grabClass = data.match(checkClass);
                  delReducer = true;
                  if (grabClass) { // find MainClass
                    Extender = data.match(new RegExp(/\n\s{0,}class\s+" + grabClass[1] + "\s+extends\s+([^\s]+)/g));
                    if (Extender) { // find ParentClass
                      if (Extender[1] != "Component") { // ParentClass is not Component
                        if (typeof Reducers[key] != "undefined") { // Change Value only if already exists
                          Reducers[key] = path
                          delReducer = false;
                        }
                      }
                    }
                  }
                  if (delReducer && typeof Reducers[key] != "undefined") {
                    delete Reducers[key];
                  }
                }
              }
              countRead++;
            })
          }
        })
      }
    });
  }
});

/* CREATE ASSETS LIST */
var assets = [];
var noFile = [".DS_Store", "Thumbs.db"];
function listDir(path) {
  fs.readdirSync(path).forEach(found => {
    var obj = path + "/" + found;
    var stat = fs.statSync(obj);
    if (stat.isDirectory()) {
      listDir(obj);
    } else {
      found = found.replace(replacer, "");
      if (found != "" && noFile.indexOf(found) == -1) {
        obj = path.substr(2) + "/" + found;
        if (assets.indexOf(obj) == -1) {
          assets.push(obj)
        }
      }
    }
  });
}
listDir(pathAsset);
var Assets = "";
var pLength = pathAsset.length - 1;
assets.forEach(File => {
  Assets += "\t\tcase \"" + File.substr(pLength) + "\":\n" +
    "\t\t\tOut = require(\"../../../" + File + "\");\n" +
    "\t\t\tbreak;\n";
});
Text = 'function assets(File) {' + "\n\t" +
  'var Out = {}' + "\n\t" +
  'switch (File) {' + "\n" +
  Assets + "\t" +
  '}' + "\n\t" +
  'return Out;' + "\n" +
  '}' + "\n" +
  'module.exports = assets;';
fs.writeFile(tmpDir + "assets.js", Text, { flag: 'w' }, function (err) {
  if (err) {
    return console.log(err);
  }
});

/* CREATE REDUCER LIST */
function createReducer() {
  if (countRead >= countLoop) {
    var CodeImporter = "";
    var CodeReducer = "";

    for (const key in Reducers) {
      CodeImporter += "\nimport " + key + " from '../../." + Reducers[key] + "';";
      CodeReducer += "\n\t" + key + ": " + key + ".reducer,";
    }
    if (CodeReducer != "") {
      CodeReducer = CodeReducer.substr(0, CodeReducer.length - 1);
    }
    Text = "import { combineReducers } from 'redux'" + CodeImporter +
      "\n\nconst combiner = combineReducers({" + CodeReducer +
      "\n})\n\n" +
      "const reducers = (state, action) => {" +
      "\n\tif (action.type === 'USER_LOGOUT') {" +
      "\n\t\tstate = undefined" +
      "\n\t}" +
      "\n\treturn combiner(state, action)" +
      "\n}" +
      "\nexport default reducers";
    fs.writeFile(tmpDir + "reducers.js", Text, { flag: 'w' }, function (err) {
      if (err) {
        return console.log(err);
      }
    })
  } else {
    setTimeout(() => {
      lastReducers = Reducers
      createReducer()
    }, 100);
  }
}
createReducer()

/* CREATE ROUTER LIST */
var Task = "";
var nav = "";
var Navigations = [];
for (const module in Modules) {
  for (const task in Modules[module]) {
    nav = module + '/' + task;
    Navigations.push(nav);
    Task += "\t\t" + 'case "' + nav + '":' + "\n\t\t\t" +
      'Out = require("../../.' + Modules[module][task] + '")' + "\n\t\t\t" +
      'break;' + "\n";
  }
}
Text = 'function routers(modtask) {' + "\n\t" +
  'var Out = {}' + "\n\t" +
  'switch (modtask) {' + "\n" +
  Task + "\t" +
  '}' + "\n\t" +
  'return Out;' + "\n" +
  '}' + "\n" +
  'module.exports = routers;';
fs.writeFile(tmpDir + "routers.js", Text, { flag: 'w' }, function (err) {
  if (err) {
    return console.log(err);
  }
});

/* CREATE NAVIGATION LIST */
Text = "export default [\"" + Navigations.join('", "') + "\"]";
fs.writeFile(tmpDir + "navigations.js", Text, { flag: 'w' }, function (err) {
  if (err) {
    return console.log(err);
  }
});
