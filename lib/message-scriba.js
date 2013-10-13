/*
 * message-scriba
 * https://github.com/parroit/message-scriba
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

exports.Scriba = Scriba;

var bus = require("corriera");

var path = require("path");

function Scriba() {

}

Scriba.prototype.stop = function(){
    bus.removeListener('attachmentParsing', this.attachmentsListener);
};

Scriba.prototype.run = function(dbPath,attachmentsPath,onSuccess){


    var eventError = "Please provide a non-empty string dbPath";
    if (typeof (dbPath) !== 'string') {
        throw new Error(eventError);
    }

    if (dbPath == '') {
        throw new Error(eventError);
    }

    eventError = "Please provide a non-empty attachmentsPath dbPath";
    if (typeof (attachmentsPath) !== 'string') {
        throw new Error(eventError);
    }

    if (attachmentsPath == '') {
        throw new Error(eventError);
    }

    var fs = require("fs");
    if (!fs.existsSync(attachmentsPath)){
        var mkdirp = require('mkdirp');
        mkdirp.sync(attachmentsPath,'770');
    }


    this.attachmentsListener = function (stream, fileName) {
        var filePath = path.join(attachmentsPath, fileName);
        var diskFile = fs.createWriteStream(filePath);

        diskFile.once('finish', function () {
            bus.emit('attachmentSaved', 'any', filePath);
        });

        stream.pipe(diskFile);


    };
    bus.on('attachmentParsing',/(.*)/, this.attachmentsListener);

    var nStore = require('nstore');
    var handler=onSuccess;

    var messages = nStore.new(dbPath, function () {

        messages.save("dbinfo", {version: "0.0.1"}, function (err) {

            if (err) { throw err; }

            handler && handler();
        });

    });

    this.messages = messages;

};
