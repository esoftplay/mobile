#!/usr/bin/env node
const fs = require('fs');

// Add scripts.prestart anda scripts.poststop
const path = "../../package.json"
if (fs.existsSync(path))
{
	var $package = JSON.parse(fs.readFileSync(path, 'utf8'));
	var args = process.argv.slice(2);
	if (args[0] == "install")
	{
		// $package.scripts.prestart = "node ./node_modules/esoftplay/bin/cli.js start";
		// $package.scripts.poststop = "node ./node_modules/esoftplay/bin/cli.js stop";
		$package.scripts.prestart = "esoftplay start";
		$package.scripts.poststop = "esoftplay stop";
	}else{
		if ($package.scripts.prestart)
		{
			delete $package.scripts.prestart;
		}
		if ($package.scripts.poststop)
		{
			delete $package.scripts.poststop;
		}
	}
	fs.writeFile(path, JSON.stringify($package, null, 2), (err) => {
	  if (err) throw err;
	  console.log('package.json has been updated');
	});
	// Update app.json
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
				"domain" : $name+".com",
				"salt" : "CHANGE_INTO_YOUR_OWN_SALT"
			}
		}
		if (rewrite)
		{
			fs.writeFile(appjson, JSON.stringify($app, null, 2), (err) => {
			  if (err) throw err;
			  console.log('app.json has been updated');
			});
		}
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
      // 'font-name1': esp.asset('fonts/FontName1.otf'),\n\
      // 'font-name2': esp.asset('fonts/FontName2.otf'),\n\
      // 'font-name3': esp.asset('fonts/FontName3.otf'),\n\
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
}else{
	console.log(path+" not found!!")
}
