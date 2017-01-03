'use strict';
var http = require('http');
var AlexaSkill = require('./AlexaSkill');
var _ = require("underscore");

var APP_ID = 'amzn1.ask.skill.506f130c-3929-4169-bd15-768d20dded9c';

var options = {
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
        console.log("body:" + body);
        response.tell(body);
    });

};
var listResponseFunction = function(intent, session, response) {
    getList("ListIntent", function(body) {
        console.log("in listResponseFunction function");
        console.log("body:" + body);
        response.tell(body);
    });

};

var totalCostResponseFunction = function(intent, session, response) {
    getTotalCost("TotalCostIntent", function(body) {
        console.log("in totalCostResponseFunction function");
        console.log("body:" + body);
        response.tell(body);
    });

};

var numberItemResponseFunction = function(intent, session, response) {
    getNumberItem(intent.slots.NUMBERCODE.value, function(body) {
        console.log("in numberItemResponseFunction function");
        console.log("body:" + body);
        response.tell(body);
    });

};

var postNewFoodItemResponseFunction = function(intent, session, response) {
    console.log("postNewFoodItemResponseFunction->" + JSON.stringify(intent.slots));
    try {
        postNewFoodItem(intent.slots, function(body) {
            console.log("in postNewFoodItemResponseFunction function");
            console.log("body:" + body);
            response.tell(body);
        });
    } catch (err) {
        console.log(err.message);
    }

};

ListService.prototype.eventHandlers.onLaunch = helloResponseFunction;

ListService.prototype.intentHandlers = {
    'HelloWorldIntent': helloResponseFunction,
    'ListIntent': listResponseFunction,
    'TotalCostIntent': totalCostResponseFunction,
    'NumberItemIntent': numberItemResponseFunction,
    'AddItemIntent': postNewFoodItemResponseFunction
};

exports.handler = function(event, context) {

    var listService = new ListService();
    listService.execute(event, context);

};

function onLaunchCall(eventCallback) {
    var responseText = 'Hello Eric';
    //TODO: send wakeup request to heroku app
    console.log(responseText);
    eventCallback(responseText);
}

function getNumberItem(value, eventCallback) {
    options.path = '/api/list/' + value;
    console.log(options.path);
    http.get(options, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var bodyObject = JSON.parse(body);
            console.log("body:" + body);
            var responseText = "Your items is " + bodyObject.text + ".";
            console.log("responseText:" + responseText);
            eventCallback(responseText);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}

function postNewFoodItem(curItem, eventCallback) {
    try {
        var newItem = {};
        newItem.text = curItem.FOOD.value;
        if (!_.isUndefined(curItem.NUMBER)) {
            newItem.quantity = curItem.NUMBER.value;
        }
        console.log("slot data:" + JSON.stringify(newItem));
        var post_data = JSON.stringify(newItem);
        console.log("post_data:" + post_data);
        var post_options = {
            host: 'still-stream-24659.herokuapp.com',
            path: '/api/list',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        var responseData = "";
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                responseData = responseData + chunk;
            });
            res.on('end', function() {
                console.log("post new food item");
                console.log("responseData: " + responseData);
                eventCallback(newItem.text + " added to your list.");
            });
        });
        post_req.write(post_data);
        post_req.end();
    } catch (err) {
        console.log("postNewFoodItem:" + err.message);
    }
}

function getTotalCost(intentName, eventCallback) {
    options.path = '/api/metalist';
    http.get(options, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var bodyObject = JSON.parse(body);
            console.log("body: " + body);
            var responseText = "This is the " + intentName + ".  The total cost of your items is " + bodyObject.cTotal + ".";
            console.log("responseText:" + responseText);
            eventCallback(responseText);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}

function getList(intentName, eventCallback) {
    options.path = "/api/list";
    http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            console.log("getList: body response:" + body);
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
            console.log("responseText:" + responseText);
            eventCallback(responseText);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
}
