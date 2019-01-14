#!/usr/bin/env node
/* EXECUTED ON INSTALL THIS ESOFTPLAY MODULE */
const { spawn } = require('child_process');
const fs = require('fs');

const DIR = "../../"
const packjson = DIR + "package.json"
const appjson = DIR + "app.json"
const babelrc = DIR +".babelrc"
const appjs = DIR + "App.tsx"
const pathScript = DIR + "node_modules/react-native-scripts/build/bin/react-native-scripts.js"
if (fs.existsSync(packjson)) {
	var txt = fs.readFileSync(packjson, 'utf8');
	var $package = JSON.parse(txt);
	var rewrite = false;
	var args = process.argv.slice(2);


	/* ADD SCRIPTS.PRESTART AND SCRIPTS.POSTSTOP */
	if (fs.existsSync(pathScript)) {
		var $script = fs.readFileSync(pathScript, 'utf8');

		/* Update react-native-scripts */
		var code1 = "// the command is valid"
		var code2 = "";
		var match = $script.match(new RegExp(code1 + "(\s{0,}\n\s{0,}[^\n]+)\n")); // mengambil 1 baris setelah code1
		var $script2 = $script;
		var espCode = false;
		if (match) {
			if (args[0] == "install") {
				var reg = new RegExp(/(\[.*?\),)/g) // mengambil argument ke 2 dari .sync()
				var tag = match[1].match(reg)
				if (tag) {
					if (!tag[0].match(/esoftplay/)) {
						espCode = match[1].replace(reg, "['./node_modules/.bin/esoftplay', script],") // ganti argument ke 2 menjadi milik esoftplay
						code2 = code1 + espCode;
						$script2 = $script.replace(code1, code2) // masukkan code ke dalam script setelah argument ke 2 di ganti ke esoftplay
					}
				}
			} else
				if (args[0] == "uninstall") {
					if (match[1].match(/esoftplay/)) {
						$script2 = $script.replace(match[1], code2) // hapus script dari esoftplay
					}
				}
		}
		if ($script2 != $script) {
			fs.writeFile(pathScript, $script2, (err) => {
				if (err) throw err;
				console.log('react-native-scripts has been updated!!');
			});
		}
	} else {
		/* Update package.json for latest expo */
		rewrite = false
		if (!$package.hasOwnProperty("scripts")) {
			rewrite = true
			$package.scripts = {
				"start": "esp start && expo start",
				"android": "expo start --android",
				"ios": "expo start --ios",
				"eject": "expo eject"
			};
		}
		if (args[0] == "install") {
			if (!$package.scripts.hasOwnProperty("start")) {
				rewrite = true;
				$package.scripts.start = "esp start && expo start"
			} else {
				if (!$package.scripts.start.match(/esp start/)) {
					rewrite = true
					$package.scripts.start = "esp start && " + $package.scripts.start
				}
			}
		} else
			if (args[0] == "uninstall") {
				if ($package.scripts.start.match(/esp start/)) {
					rewrite = true
					$package.scripts.start = $package.scripts.start.replace(/esp start(\s+&&\s+)/ig, "");
				}
			}
		if (rewrite) {
			console.log("Please change scripts.start in package.json into '" + $package.scripts.start + "'")
			// spawn('node', ['./packager.js', args[0], packjson], { stdio: 'inherit' })
			// fs.writeFile(packjson, JSON.stringify($package, null, 2), (err) => {
			//   if (err) throw err;
			//   console.log('package.json has been updated');
			// });
		}
	}

	/* Create esp command line */
	if (args[0] == "install") {
		spawn('esp', ['start'], { stdio: 'inherit' })
			.on('exit', function (code) {
				console.log(code);
			})
			.on('error', function () {
				console.log("Installing the package 'esoftplay-cli'...");
				spawn('npm', ['install', '--global', '--loglevel', 'error', 'esoftplay-cli'], {
					stdio: ['inherit', 'ignore', 'inherit'],
				}).on('close', function (code) {
					if (code !== 0) {
						console.error('Installing esoftplay-cli failed. You can install it manually with:');
						console.error('  npm install --global esoftplay-cli');
					} else {
						console.log('esoftplay-cli installed. You can run `esp help` for instructions.');
					}
				});
			});
	}

	/* Update app.json */
	if (args[0] == "install") {
		var $app = JSON.parse(fs.readFileSync(appjson, 'utf8'));
		rewrite = false;
		if (!$package.hasOwnProperty("name")) {
			$package.name = "esoftplay"
		}
		var $name = $package.name.toLowerCase().replace(/[^a-z0-9\-]+/g, "");
		if (!$app.expo.hasOwnProperty("name")) {
			$app.expo.name = $name;
			rewrite = true;
		}
		if (!$app.hasOwnProperty('config')) {
			rewrite = true;
			$app.config = {
				"domain": $name + ".com",
				"salt": "CHANGE_INTO_YOUR_OWN_SALT",
				"home": {
					"public": "content/index",
					"member": "content/index"
				}
			}
		}
		if (rewrite) {
			fs.writeFile(appjson, JSON.stringify($app, null, 2), (err) => {
				if (err) throw err;
				console.log('app.json has been updated');
			});
		}


		/* Update App.js */
		if (args[0] == "install") {
			const AppJS = "import React from 'react';\n\
import { AppLoading, Font } from 'expo';\n\
import { applyMiddleware, createStore } from 'redux';\n\
import thunk from 'redux-thunk';\n\
import { Provider } from 'react-redux'\n\
import { esp } from 'esoftplay';\n\
\n\
const middleware = applyMiddleware(thunk)\n\
export const store = createStore(esp.reducer(), middleware)\n\
\n\
export default class App extends React.Component {\n\
  state = {\n\
    loading: true\n\
  }\n\
  Home = esp.home()\n\
\n\
  componentDidMount = async () => {\n\
    await Font.loadAsync({\n\
      'Roboto': require('native-base/Fonts/Roboto.ttf'),\n\
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),\n\
    })\n\
    this.setState({ loading: false })\n\
  }\n\
\n\
  render = () => {\n\
    const { loading } = this.state\n\
    return loading\n\
      ?\n\
			<AppLoading\n\
				onFinish={() => { }}\n\
        autoHideSplash={true}\n\
        onError={() => { }}\n\
        startAsync={async () => { }}\n\
			/>\n\
      :\n\
      <Provider store={store}>\n\
        <this.Home />\n\
      </Provider>\n\
  }\n\
}";
			fs.writeFile(appjs, AppJS, (err) => {
				if (err) throw err;
				console.log('App.tsx has been updated');
			});
		}
	}
} else {
	console.log(packjson + " not found!!")
}
