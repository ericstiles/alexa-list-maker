'use strict';
var http = require('http');
var AlexaSkill = require('./AlexaSkill');

var APP_ID = 'amzn1.ask.skill.506f130c-3929-4169-bd15-768d20dded9c';
var SPEECH_OUTPUT = 'Hello World One!';

var options={
        host: 'still-stream-24659.herokuapp.com',
        path: '/api/todos'
    };

var ListService = function() {
    AlexaSkill.call(this, APP_ID);
};

ListService.prototype = Object.create(AlexaSkill.prototype);
var helloResponseFunction = function(intent, session, response) {
    onLaunchCall(function(body) {
        console.log("in helloResponseFunction function");
        console.log("2." + body);
        response.tell(body);
    });

};
var listResponseFunction = function(intent, session, response) {
    getList("ListIntent", function(body) {
        console.log("in listResponseFunction function");
        console.log("1." + body);
        response.tell(body);
    });

};

ListService.prototype.eventHandlers.onLaunch = helloResponseFunction;

ListService.prototype.intentHandlers = {
    'HelloWorldIntent': helloResponseFunction,
    'ListIntent': listResponseFunction
};



exports.handler = function(event, context) {

    var listService = new ListService();
    listService.execute(event, context);




};

function onLaunchCall(eventCallback) {
    var responseText = 'Hello Eric';
    console.log(responseText);
    eventCallback(responseText);
}

function getList(intentName, eventCallback) {
    http.get(options, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var bodyObject = JSON.parse(body);
            var responseText = "This is the " + intentName + ".  You have " + bodyObject.length + (bodyObject.length == 1 ? " item " : " items ") + "in your list.  ";
            if (bodyObject.length == 1) {
                responseText += "Your list is " + bodyObject[0].text + ".";
            } else if (bodyObject.length == 2) {
                responseText += "Your list is " + bodyObject[0].text + " and " + bodyObject[1].text + ".";
            } else if (bodyObject.length > 2) {
                responseText += "Your list is ";
                for (var i = 0; i < bodyObject.length; i++) {
                    responseText += bodyObject[i].text;
                    if (i < bodyObject.length - 2) {
                        responseText += ", ";
                    } else if (i < bodyObject.length - 1) {
                        responseText += " and ";
                    } else {
                        responseText += ".";
                    }
                }
            }
            console.log("3." + responseText);
            eventCallback(responseText);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}
