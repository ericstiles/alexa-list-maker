#!/bin/sh

#move to root project directory

cd $(dirname $0)/..
BASE_DIR=`pwd`
echo $BASE_DIR

ARCHIVE_DIR=$BASE_DIR/archive
echo $ARCHIVE_DIR

SRC_DIR=$BASE_DIR/src
echo $SRC_DIR

FILENAME=archive.$(date +"%m.%d.%Y.%H.%M").zip
echo $FILENAME

cd $SRC_DIR
zip -r $ARCHIVE_DIR/$FILENAME ./index.js ./AlexaSkill.js ./package.json
ls $ARCHIVE_DIR
