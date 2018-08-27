#!/bin/bash
SRC="$( cd "$( dirname $(dirname "${BASH_SOURCE[0]}") )" >/dev/null && pwd )"
DST="$( pwd )/node_modules/esoftplay"
rm -rf $DST/bin
ln -s $SRC/bin $DST/bin
rm -rf $DST/modules
ln -s $SRC/modules $DST/modules
rm -rf $DST/index.js
ln -s $SRC/index.js $DST/index.js
rm -rf $DST/watch.js
ln -s $SRC/watch.js $DST/watch.js