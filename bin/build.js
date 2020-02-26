#!/usr/bin/env node
/* EXECUTED ON INSTALL THIS ESOFTPLAY MODULE */
const { spawn } = require('child_process');
const fs = require('fs');

const DIR = "../../"
const packjson = DIR + "package.json"
const appjson = DIR + "app.json"
const confjson = DIR + "config.json"
const babelrc = DIR + ".babelrc"
const gitignore = DIR + ".gitignore"
const tsconfig = DIR + "tsconfig.json"
const appjs = DIR + "App.js"
const appts = DIR + "App.tsx"
const store = DIR + "store.ts"
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
		let stringExist = ''
		let stringToBe = ''
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
				stringExist = `"start": "expo start"`
				stringToBe = `"start": "esp start && expo start"`
				// $package.scripts.start = "esp start && expo start"
			} else {
				if (!$package.scripts.start.match(/esp start/)) {
					rewrite = true
					stringExist = `"start": "expo start"`
					stringToBe = `"start": "esp start && expo start"`
					// $package.scripts.start = "esp start && " + $package.scripts.start
				}
			}
		} else
			if (args[0] == "uninstall") {
				if ($package.scripts.start.match(/esp start/)) {
					rewrite = true
					stringExist = `"start": "esp start && expo start"`
					stringToBe = `"start": "expo start"`
					// $package.scripts.start = $package.scripts.start.replace(/esp start(\s+&&\s+)/ig, "");
				}
			}
		if (rewrite) {
			fs.readFile(packjson, 'utf8', function (err, data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(stringExist, stringToBe);

				fs.writeFile(packjson, result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
			});
			// console.log("Please change scripts.start in package.json into '" + $package.scripts.start + "'")
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
		var $config = {}
		if (fs.existsSync(confjson))
			$config = JSON.parse(fs.readFileSync(confjson, 'utf8')) || {};
		rewrite = false;
		if (!$config.hasOwnProperty('config')) {
			rewrite = true;
			$config.config = {
				"domain": "domain.com",
				"errorReport": {
					"telegramIds": [
						"-1001212227631",
					]
				},
				"salt": "CHANGE_INTO_YOUR_OWN_SALT",
				"home": {
					"public": "content/index",
					"member": "content/index"
				}
			}
		}
		if (rewrite) {
			fs.writeFile(confjson, JSON.stringify($config, null, 2), (err) => {
				if (err) throw err;
				console.log('config.json has been created');
			});
		}
		var $appjson = {}
		if (fs.existsSync(appjson))
			$appjson = JSON.parse(fs.readFileSync(appjson, 'utf8')) || {};
		rewrite = false;
		if (!$appjson.expo.hasOwnProperty('android')) {
			rewrite = true;
			$appjson.expo.android = {
				"package": "com.domain",
				"versionCode": 1,
				"intentFilters": [
					{
						"action": "VIEW",
						"data": {
							"scheme": "http",
							"host": "*.domain.com"
						},
						"category": [
							"BROWSABLE",
							"DEFAULT"
						]
					},
					{
						"action": "VIEW",
						"data": {
							"scheme": "http",
							"host": "domain.com"
						},
						"category": [
							"BROWSABLE",
							"DEFAULT"
						]
					}
				]
			}
			$appjson.expo.ios = {
				"bundleIdentifier": "com.domain",
				"buildNumber": "1",
				"supportsTablet": true,
				"associatedDomains": [
					"applinks:*.domain.com",
					"applinks:domain.com"
				]
			}
			if (rewrite) {
				fs.writeFile(appjson, JSON.stringify($appjson, null, 2), (err) => {
					if (err) throw err;
					console.log('app.json has been updated');
				});
			}
		}
		/* Update App.js */
		const TSconfig = `{\n\
	"compilerOptions": {\n\
		"allowSyntheticDefaultImports": true,\n\
		"experimentalDecorators": true,\n\
		"forceConsistentCasingInFileNames": true,\n\
		"importHelpers": true,\n\
		"jsx": "react-native",\n\
		"lib": [\n\
			"es2017"\n\
		],\n\
		"module": "es2015",\n\
		"moduleResolution": "node",    \n\
		"noEmitHelpers": true,\n\
		"noImplicitReturns": true,\n\
		"noUnusedLocals": true,\n\
		"sourceMap": false,\n\
		"strict": true,\n\
		"target": "es2017"\n\
	},\n\
	"exclude": [\n\
		"node_modules"\n\
	]\n\
}`
		fs.writeFile(tsconfig, TSconfig, (err) => {
			if (err) throw err;
			console.log('tsconfig has been created');
		});

		const GitIgnore = `
.expo*/\n\
index.d.ts\n\
config.json\n\
node_modules/\n\
npm-debug.*\n\
package-lock.json\n\
yarn.lock\n\
			`

		fs.writeFile(gitignore, GitIgnore, (err) => {
			if (err) throw err;
			console.log('.gitignore has been created');
		});

		const AppJS = `import React, { useEffect, useMemo } from 'react';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { esp, _global } from 'esoftplay';
import * as ErrorReport from 'esoftplay/error'
import * as ErrorRecovery from 'expo-error-recovery';

_global.store = createStore(esp.reducer())
_global.persistor = persistStore(_global.store)

export default function App(props: any) {
	const Home = useMemo(() => esp.home(), [])

	useEffect(() => {
		ErrorRecovery.setRecoveryProps(props)
		ErrorReport.getError(props.exp.errorRecovery)
	}, [])

	return (
		<Provider store={_global.store}>
			<PersistGate loading={null} persistor={_global.persistor}>
				<Home />
			</PersistGate>
		</Provider>
	)
}`
			;
		var bashScript = 'cd ../../ && expo install ';
		var expoLib = [
			"expo-av",
			"expo-linear-gradient",
			"expo-blur",
			"expo-image-manipulator",
			"expo-camera",
			"expo-image-picker",
			"expo-permissions",
			"expo-sqlite",
			"lodash",
			"expo-file-system",
			"expo-constants",
			"expo-font",
			"expo-error-recovery",
			"@react-native-community/netinfo",
			"react-native-gesture-handler",
			"react-native-reanimated",
			"expo-document-picker",
			'react-native-webview',
			"@expo/vector-icons",
			"buffer",
			"firebase",
			"immutability-helper",
			"moment",
			"moment-timezone",
			"native-base",
			"react-native-modal",
			"react-native-screens",
			"@react-navigation/native",
			"@react-navigation/stack",
			"@react-native-community/masked-view",
			"react-native-safe-area-context",
			"react-redux",
			"recyclerlistview",
			"redux",
			"redux-persist",
			"shorthash",
			"react-native-picker-scrollview"
		]
		for (let i = 0; i < expoLib.length; i++) {
			const element = expoLib[i];
			bashScript += element + ' '
		}
		// bashScript += ' && npm install react-native-gesture-handler@1.0.14'
		bashScript += ' && npm install --save-dev @types/expo__vector-icons @types/node @types/react @types/react-native @types/react-redux babel-preset-expo react-native-typescript-transformer tslib typescript'
		fs.writeFile(appts, AppJS, (err) => {
			if (err) throw err;
			fs.unlink(appjs, (err) => { })
			const exec = require('child_process').exec;
			var yourscript = exec(
				bashScript,
				(error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					if (error !== null) {
						console.log(`exec error: ${error}`);
					}
				});

			console.log('App.js has been replace to App.tsx');
			console.log('Please wait until process finished...');
		});
	}
} else {
	console.log(packjson + " not found!!")
}
