/*
 * message-scriba
 * https://github.com/parroit/message-scriba
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

exports.Scriba = Scriba;


function Scriba() {

}

Scriba.prototype.run = function(dbPath,attachmentsPath){
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

    var bus = require("corriera");

    var path = require("path");

    bus.on('attachmentParsing',/(.*)/,function(stream,fileName){
        var filePath = path.join(attachmentsPath, fileName);
        var diskFile = fs.createWriteStream(filePath);

        diskFile.once('finish',function(){
            bus.emit('attachmentSaved','any',filePath);
        });

        stream.pipe(diskFile);


    });



};
