#!/usr/bin/env node
/* EXECUTED ON `ESP START` TO BUILD FILE CACHES */
const fs = require('fs');
var checks = ['./node_modules/esoftplay/modules/', './modules/', './templates/'];
var pathAsset = "./assets";
var tmpDir = "./node_modules/esoftplay/cache/";
var replacer = new RegExp(/(?:\-|\.(?:ios|android))?\.(?:jsx|js|ts|tsx)$/);
var Text = "";

/* CREATE DIRECTORY CACHE IF NOT EXISTS */
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

/* FETCH ALL SCRIPTS */
var Modules    = {}; // Object semua module/task yang bisa dipanggil
var Reducers   = {}; // Object semua reducer yang akan dikumpulkan
var Extender   = {};
var grabClass  = null;
var delReducer = true;
var countLoop  = 0; // jumlah file yang telah dihitung
var countRead  = 0; // jumlah file yang telah di baca
var tmpTask    = {}; // template ModuleTaks yang akan dimasukkan ke index.d.ts
var tmpExp     = ["LibCrypt"]; // nama2 class yang tidak perlu dibuat

checks.forEach(modules => {
  if (fs.existsSync(modules)) {
    fs.readdirSync(modules).forEach(module => {
      if (typeof Modules[module] == "undefined") {
        Modules[module] = {};
      }
      if (fs.statSync(modules + module).isDirectory()) {
        fs.readdirSync(modules + module).forEach(file => {
          if ((new RegExp("\.ts|.tsx|.js$")).test(file)) {
            var name = file.replace(replacer, '');
            var path = modules + module + "/" + name;
            var clsName = module;
            if (name != "index") {
              clsName += " "+name;
            }
            clsName = clsName.toLowerCase().replace(/\b[a-z]/g, function(a) {return a.toUpperCase();});
            clsName = clsName.replace(/\s/g, "");
            Modules[module][name] = path;
            if (typeof tmpTask[clsName]=="undefined") {
              tmpTask[clsName] = {
                "interface": [],
                "class": "",
                "function": {}
              };
            }
            countLoop++;
            fs.readFile(modules + module + "/" + file, "utf8", function (err, data) {
              if (err) {
                return console.log(err)
              } else {
                var isIndexed =  (tmpExp.indexOf(clsName) > -1) ? false : true;
                /* REGEX INTERFACE */
                if (isIndexed) {
                  if (m = data.match(/\n\s{0,}(export\s+interface\s+[a-zA-Z0-9_]+\s{0,}\{[^\}]+\})/g)) {
                    for (var i = 0; i < m.length; i++) {
                      tmpTask[clsName]["interface"].push(m[i].trim());
                    }
                  }
                }
                /* REGEX CLASS NAME */
                if (m = /\n\s{0,}(?:export\s+default\s+)?(class\s+([^\s]+)[^\{]+)/.exec(data)) {
                  if (tmpTask[clsName]["class"]=="") {
                    tmpTask[clsName]["class"] = m[1].replace(m[2], clsName).trim();
                  }
                }
                /* REGEX All Functions */
                if (isIndexed) {
                  var r = /\n(\s+)((?:(?:static|public|private|async)\s+)?[a-zA-Z0-9_]{3,}\s{0,}(?:=\s{0,})?\([^{]+)/g; // 1=spaces 2=FunctionObject
                  if (s = r.exec(data)) {
                    if (m = data.match(r)) {
                      for (var i = 0; i < m.length; i++) {
                        if (S = m[i].match(/\n([^\na-zA-Z0-9_]+)([a-zA-Z0-9_]{3,})/)) {
                          if (S[1]==s[1]) {
                            tmpTask[clsName]["function"][S[2]] = m[i].trim()+";";
                          }
                        }
                      }
                    }
                  }
                }





                /*
                  Grab index.d.ts disini

                  1. grab semua dengan prefix 'export interface' berikut nama dan body sampai dengan kurung tutup '}'
                    - nama interface selalu diawali dengan module-task dan diakhiri dengan 'State' atau 'Props', misal 'LibPickerProps','ContentAudioState'

                  2. ambil nama kelas Component (jika ada) dan ubah sesuai nama path (ModuleTask), sampai dengan SuperClassnya (jika ada), dan (jika ada) sampai dengan interface (yang berada diantara < >).
                     jika didalam sebuah kelas terdapat fungsi misal :(render(), componentDidMount(), constructor() dan lain sebagainya ) maka fungsi tersebut diambil juga dengan syarat seperti no 3 berikut ini;

                  3. mengambil fungsi dilakukan dengan cara mengambil nama fungsi berserta indentitas modifiernya (static, public, private, dll) sampai akhir parameter kecuali body fungsi ditandai dengan '{'

                  sample generate dati file di 'module/content/audio.tsx'

                  ======================================================  START

                    export interface ContentAudioProps {
                      onRef: (ref: any) => void,
                      code: string,
                      onStatusChange: (status: any) => void
                    }

                    export interface ContentAudioState {
                      playbackInstanceName: string,
                      muted: boolean,
                      playbackInstancePosition: any,
                      playbackInstanceDuration: any,
                      shouldPlay: boolean,
                      isPlaying: boolean,
                      isBuffering: boolean,
                      isLoading: boolean,
                      volume: number,
                    }

                    export class eaudio extends Component<ContentAudioProps, ContentAudioState> {
                      constructor(props: ContentAudioProps)
                      componentDidMount()
                      componentWillUnmount(): void
                      async _loadNewPlaybackInstance(playing: boolean)
                      _onPlaybackStatusUpdate(status: any)
                      _onPlayPausePressed()
                      render()
                    }

                  +++++++++++++++++++++++++++++++++++++++++++++++ END

                  sample generate dati file di 'esp.ts'

                  ======================================================

                  export class esp {
                      static asset(path: string): any;
                      static config(param?: string, ...params: string[]): any;
                      static _config(): string | number | boolean;
                      static mod(path: string): any;
                      static reducer(): any;
                      static navigations(): any;
                      static home(): any;
                      static log(message?: any, ...optionalParams: any[]): void;
                      static routes(): any;
                      static getTokenAsync(callback: (token: string) => void): void;
                      static notif(): any;
                    }

                  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ END
                */



                var key = module + "_" + name;
                if ((new RegExp(/\n\s+static\s+reducer\s{0,}[\=\(]/g)).test(data)) { // is contains 'reducer'
                  Reducers[key] = path;
                } else { // not contained 'reducer'
                  grabClass = data.match(new RegExp(/\n\s{0,}export\s+default\s+connect\\([^\\)]+\\)\\(\s{0,}(.*?)\s{0,}\\)/g));
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
if (!fs.existsSync(pathAsset)) {
  fs.mkdirSync(pathAsset);
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

/* CREATE INDEX.D.TS */
function createIndex() {
  var Text = "import { Component, ComponentClass, Ref, ComponentType } from 'react';\n"+
    "declare module esoftplay {\n"+
    "  export class esp {\n"+
    "    static asset(path: string): any;\n"+
    "    static config(param?: string, ...params: string[]): any;\n"+
    "    static _config(): string | number | boolean;\n"+
    "    static mod(path: string): any;\n"+
    "    static reducer(): any;\n"+
    "    static navigations(): any;\n"+
    "    static home(): any;\n"+
    "    static log(message?: any, ...optionalParams: any[]): void;\n"+
    "    static routes(): any;\n"+
    "    static getTokenAsync(callback: (token: string) => void): void;\n"+
    "    static notif(): any;\n"+
    "  }\n";
  for(clsName in tmpTask) {
    if (tmpTask[clsName]["class"]) {
      Text += "\n";
      for (var i = 0; i < tmpTask[clsName]["interface"].length; i++) {
        Text += "\n  "+tmpTask[clsName]["interface"][i].replace(/\n/g, "\n  ");
      }
      Text += "\n  "+tmpTask[clsName]["class"]+" {";
      var isFilled = false;
      for(fun in tmpTask[clsName]["function"]) {
        Text += "\n    "+tmpTask[clsName]["function"][fun];
        isFilled = true;
      }
      if (isFilled) {
        Text += "\n  ";
      }
      Text += "}";
    }
  }
  Text += "\n}";
  fs.writeFile(tmpDir + "index.d.ts", Text, { flag: 'w' }, function (err) {
    if (err) {
      return console.log(err);
    }
  })
}

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
      createReducer();
      createIndex();
    }, 100);
  }
}
createReducer()

/* === */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/* CREATE ROUTER LIST */
var Task = "";
var nav = "";
var staticImport = "export { default as esp } from '../../../node_modules/esoftplay/esp';\n"
var Navigations = [];
for (const module in Modules) {
  for (const task in Modules[module]) {
    nav = module + '/' + task;
    Navigations.push(nav);
    Task += "\t\t" + 'case "' + nav + '":' + "\n\t\t\t" +
      'Out = require("../../.' + Modules[module][task] + '").default;' + "\n\t\t\t" +
      'break;' + "\n";
    staticImport += "export { default as " + capitalizeFirstLetter(module) + capitalizeFirstLetter(task) + " } from '../../." + Modules[module][task] + "';\n";
  }
}
fs.writeFile(tmpDir + 'index.js', staticImport, { flag: 'w' }, function (err) {
  if (err) {
    return console.log(err);
  }
});
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
