#!/usr/bin/env node
/* EXECUTED IN BUILD.JS ON INSTALLING MODULES */

const { spawn } = require('child_process');
const fs = require('fs');


/* MENAMBAHKAN scrips.start di package.json */
var args = process.argv.slice(2);
const path = args[1] || "../../package.json"

/* Update package.json for latest expo */
if (fs.existsSync(path))
{
	var txt = fs.readFileSync(path, 'utf8');
	var $package = JSON.parse(txt);
	var rewrite = false;
	if (!$package.hasOwnProperty("scripts"))
	{
		rewrite = true
		$package.scripts = {
			"start": "esp start && expo start",
	    "android": "expo start --android",
	    "ios": "expo start --ios",
	    "eject": "expo eject"
			};
	}
	if (args[0] == "install")
	{
		if (!$package.scripts.hasOwnProperty("start"))
		{
			rewrite = true;
			$package.scripts.start = "esp start && expo start"
		}else{
			if (!$package.scripts.start.match(/esp start/))
			{
				rewrite = true
				$package.scripts.start = "esp start && " + $package.scripts.start
			}
		}
	}else
	if (args[0] == "uninstall")
	{
		if ($package.scripts.start.match(/esp start/))
		{
			rewrite = true
			$package.scripts.start = $package.scripts.start.replace(/esp start(\s+&&\s+)/ig, "");
		}
	}
	if (rewrite)
	{
		fs.writeFile(path, JSON.stringify($package, null, 2), (err) => {
		  if (err) throw err;
		  console.log('package.json has been updated');
		});
	}

}