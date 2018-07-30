#!/usr/bin/env node

const { exec } = require('child_process');
var {watchTree} = require('watch')

// Watching assets/, modules/**/*.js, templates/**/*.js
var paths = ["./assets/", "./modules/", "./templates/"]
var args = process.argv.slice(2);
function execution() {
	exec('node "./node_modules/esoftplay/router"')
}
if (args[1] == "start") {
	for (var i = 0; i < paths.length; i++) {
		const path = paths[i]
		watch.watchTree(path, function (f, curr, prev) {
			execution()
		})
	}
}else
if (args[1] == "stop") {
	for (var i = 0; i < paths.length; i++) {
		const path = paths[i]
		watch.unwatchTree(path)
	}
}
// watch.watchTree('/home/mikeal', function (f, curr, prev) {
// 	if (typeof f == "object" && prev === null && curr === null) {
// 		// Finished walking the tree
// 	} else if (prev === null) {
// 		// f is a new file
// 	} else if (curr.nlink === 0) {
// 		// f was removed
// 	} else {
// 		// f was changed
// 	}
// })
// exec('watch "node ./node_modules/esoftplay/router" ./assets/', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }
// });
// exec('watch "node ./node_modules/esoftplay/router" ./modules/', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }
// });
// exec('watch "node ./node_modules/esoftplay/router" ./templates/', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }
// });
console.log(args, "esoftplay/bin/cli.js", __dirname)
/*
watch 'node ./node_modules/esoftplay/router' ./assets/
watch 'node ./node_modules/esoftplay/router' ./modules/
watch 'node ./node_modules/esoftplay/router' ./templates/
*/