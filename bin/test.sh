#!/bin/bash
SRC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
DST="$( pwd )/node_modules/esoftplay/bin"
rm -f $DST/build.js
ln -s $SRC/build.js $DST/build.js
rm -f $DST/cli.js
ln -s $SRC/cli.js $DST/cli.js
rm -f $DST/router.js
ln -s $SRC/router.js $DST/router.js
