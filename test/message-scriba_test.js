/*
 * message-scriba
 * https://github.com/parroit/message-scriba
 *
 * Copyright (c) 2013 parroit
 * Licensed under the MIT license.
 */

'use strict';

var message_scriba = require('../lib/message-scriba.js');
var Scriba = message_scriba.Scriba;
var scriba = new Scriba();

var expect = require('chai').expect;

var path = require('path');

require('chai').should();


describe('messageParser', function () {
    it("will be damned hard!", function () {
        var fs = require("fs");
        fs.writeFileSync("storage/attachments/doh", "ciao");
        console.log(fs.readFileSync("storage/attachments/doh", "utf8"));
    });
    describe("module", function () {
        it("should load", function () {
            expect(message_scriba).not.to.be.equal(null);
            expect(message_scriba).to.be.a('object');

        });
    });

    it("should throw on non string db path", function () {
        (function () {
            scriba.run(null, '');
        }).should.throw(Error);

        (function () {
            scriba.run(undefined, '');
        }).should.throw(Error);

        (function () {
            scriba.run(true, '');
        }).should.throw(Error);

        (function () {
            scriba.run(/ /, '');
        }).should.throw(Error);

        (function () {
            scriba.run(42, '');
        }).should.throw(Error);

        (function () {
            scriba.run({}, '');
        }).should.throw(Error);

        (function () {
            scriba.run(function () {
            }, '');
        }).should.throw(Error);

    });

    it("should throw on non string attachment path", function () {
        (function () {
            scriba.run('db/path', null);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', undefined);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', true);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', / /);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', 42);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', {});
        }).should.throw(Error);

        (function () {
            scriba.run('db/path', function () {
            });
        }).should.throw(Error);

    });

    var rimraf = require("rimraf");
    it("should create attachments folder if nonexistent", function () {
         var expectedPath = path.join("storage","attachments");
         var fs = require("fs");
         if (fs.existsSync(expectedPath))
         rimraf.sync(expectedPath);

         expect(fs.existsSync(expectedPath)).to.be.false;

         var sc = new Scriba();
         sc.run(path.join('storage','mail.db'),path.join('storage','attachments'));

         expect(fs.existsSync(expectedPath)).to.be.true;
    });

    it("should save attachments to disk", function (done) {

        var expectedPath = path.join("storage", "attachments", "test.txt");
        var fs = require("fs");

        if (fs.existsSync(expectedPath))
            fs.unlinkSync(expectedPath);


        var sc = new Scriba();
        sc.run(path.join('storage', 'mail.db'), path.join('storage', 'attachments'));


        var bus = require("corriera");


        bus.once('attachmentSaved', /(.*)/, function (path) {

            expect(path).to.be.equal(expectedPath);


            expect(fs.existsSync(path)).to.be.true;
            var file = fs.readFileSync(path, 'utf8');
            expect(file).to.be.equal("this is a test");


            done();
        });

        bus.emit(
            'attachmentParsing',
            'any',
            fs.createReadStream(path.join('test', 'test.txt')),
            "test.txt"
        );


    });


});    