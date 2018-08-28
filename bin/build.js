#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');

// Add scripts.prestart anda scripts.poststop
const path = "../../package.json"
const pathScript = "../react-native-scripts/build/bin/react-native-scripts.js"
if (fs.existsSync(path))
{
	var $package = JSON.parse(fs.readFileSync(path, 'utf8'));
	var $script = fs.readFileSync(pathScript, 'utf8');
	var args = process.argv.slice(2);

	/* Update react-native-scripts */
	var code1    = "// the command is valid"
	var code2    = "";
	var match    = $script.match(new RegExp(code1+"(\s{0,}\n\s{0,}[^\n]+)\n")); // mengambil 1 baris setelah code1
	var $script2 = $script;
	var espCode  = false;
	if (match) {
		if (args[0] == "install") {
			var reg = new RegExp(/(\[.*?\),)/g) // mengambil argument ke 2 dari .sync()
			var tag = match[1].match(reg)
			if (tag) {
				if (!tag[0].match(/esoftplay/)) {
					espCode = match[1].replace(reg, "['./node_modules/.bin/esoftplay', script],") // ganti argument ke 2 menjadi milik esoftplay
					code2 = code1+espCode;
					$script2 = $script.replace(code1, code2) // masukkan code ke dalam script setelah argument ke 2 di ganti ke esoftplay
				}
			}
		}else
		if (args[0] == "uninstall") {
			if (match[1].match(/esoftplay/)) {
				$script2 = $script.replace(match[1], code2) // hapus script dari esoftplay
			}
		}
	}
	if ($script2!=$script) {
		fs.writeFile(pathScript, $script2, (err) => {
		  if (err) throw err;
		  console.log('react-native-scripts has been updated!!');
		});
	}

	/* Create ESP command line */
	var espcli = "/usr/local/bin/esp";
	if (args[0] == "install")
	{
		var scriptCode = "#!/usr/bin/env bash\n\
\n\
if [ ! -f ./node_modules/esoftplay/bin/cli.js ]; then\n\
	echo \"Perintah 'esp' hanya bisa digunakan dalam project react-native dengan package 'esoftplay'\"\n\
else\n\
	node ./node_modules/esoftplay/bin/cli.js $@\n\
fi\n";
		fs.access('/usr/local/bin', fs.constants.W_OK, function(err) {
		  if(!err){
				fs.writeFile(espcli, scriptCode, {mode: 0777}, (err) => {
				  if (err){
				  	console.log(err);
				  }else{
					  console.log('new command "esp" has been installed')
				  }
				});
		  }
		});
	}


	/* Update app.json */
	if (args[0] == "install")
	{
		const appjson = "../../app.json"
		var $app = JSON.parse(fs.readFileSync(appjson, 'utf8'));
		var rewrite = false;
		if (!$package.hasOwnProperty("name"))
		{
			$package.name = "esoftplay"
		}
		var $name = $package.name.toLowerCase().replace(/[^a-z0-9\-]+/g, "");
		if (!$app.expo.hasOwnProperty("name"))
		{
			$app.expo.name = $name;
			rewrite = true;
		}
		if (!$app.hasOwnProperty('config'))
		{
			rewrite = true;
			$app.config = {
				"domain": $name+".com",
				"salt": "CHANGE_INTO_YOUR_OWN_SALT",
				"home": {
					"public": "content",
					"member": "content/member"
				}
			}
		}
		if (rewrite)
		{
			fs.writeFile(appjson, JSON.stringify($app, null, 2), (err) => {
			  if (err) throw err;
			  console.log('app.json has been updated');
			});
		}


		/* Update App.js */
		if (args[0] == "install")
		{
			const AppJS = "import React from 'react';\n\
import { AppLoading, Font } from 'expo';\n\
import { applyMiddleware, createStore } from 'redux';\n\
import thunk from 'redux-thunk';\n\
import { Provider } from 'react-redux'\n\
import esp from 'esoftplay';\n\
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
      <AppLoading />\n\
      :\n\
      <Provider store={store}>\n\
        <this.Home />\n\
      </Provider>\n\
  }\n\
}";
			fs.writeFile("../../App.js", AppJS, (err) => {
			  if (err) throw err;
			  console.log('App.js has been updated');
			});
		}
	}
}else{
	console.log(path+" not found!!")
}
