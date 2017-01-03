# Goal

Opportunity to learn how to use Alexa skills in various situations.

# Usage

This skill is built to integrated with [simple-shopping-list app](https://github.com/ericstiles/simple-shopping-list).  

It integrates nicely with lambda.

Don't forget to setup a logstream in cloudwatch

# Code Base

## bin folder

* `archive.sh` zips the necessary contents including the node_modules to be uploaded to AWS [lambda](https://console.aws.amazon.com/lambda).  The zip files are created in an archive folder.

* `pinglist.sh` wakes up the companion list app (simple-shopping-list).  When installed on Heroku using free service the server will shutdown when not in use.  The first requests turns the server back on.

## resources folder

* intentSchema.json file for currently implemented intents
* SampleUtterances.txt list currently working utterances and planned utterances for development
* *.text.event.json are test JSON scripts for testing several lambda intents