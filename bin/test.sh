#!/bin/bash
# REPLACE CURRENT MODULE FILES IN NODE_MODULES TO LINK TO MASTER SOURCE
SRC="$( cd "$( dirname $(dirname "${BASH_SOURCE[0]}") )" >/dev/null && pwd )"
DST="$( pwd )/node_modules/esoftplay"
if [ -d $DST ]; then
	rm -rf $DST/bin
	ln -s $SRC/bin $DST/bin
	rm -rf $DST/modules
	ln -s $SRC/modules $DST/modules
	rm -rf $DST/index.js
	ln -s $SRC/index.js $DST/index.js
	rm -rf $DST/watch.js
	ln -s $SRC/watch.js $DST/watch.js
else
	echo "You should install esoftplay package before start developing this package"
fi

# create-react-native-app MyProject
# npm install esoftplay
# sh ./test.sh
# npm start