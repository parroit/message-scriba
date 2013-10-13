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
require('chai').should();


describe('messageParser',function(){
    describe("module",function() {
        it("should load",function(){
            expect(message_scriba).not.to.be.equal(null);
            expect(message_scriba).to.be.a('object');

        });
    });

    it("should throw on non string db path",function(){
        (function () {
            scriba.run(null,'');
        }).should.throw(Error);

        (function () {
            scriba.run(undefined,'');
        }).should.throw(Error);

        (function () {
            scriba.run(true,'');
        }).should.throw(Error);

        (function () {
            scriba.run(/ /,'');
        }).should.throw(Error);

        (function () {
            scriba.run(42,'');
        }).should.throw(Error);

        (function () {
            scriba.run({},'');
        }).should.throw(Error);

        (function () {
            scriba.run(function(){},'');
        }).should.throw(Error);

    });

    it("should throw on non string attachment path",function(){
        (function () {
            scriba.run('db/path',null);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',undefined);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',true);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',/ /);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',42);
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',{});
        }).should.throw(Error);

        (function () {
            scriba.run('db/path',function(){});
        }).should.throw(Error);

    });
});    