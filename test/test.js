var through = require('through2');
var srcSync = require('../');
var should = require('should');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
require('mocha');


describe('gulp-src-sync', function() {
    describe('srcSync()', function() {
        it('should read files synchronously', function(done) {
            var src = srcSync(['test/file3.css', 'test/*.txt', 'test/**/*.*']);
            var ret = [];
            src.on('data', function(file) {
                ret.push(file.path);
            });
            src.on('end', function() {
                should.deepEqual(ret, [
                    'test/file3.css',
                    'test/file1.txt',
                    'test/file2.txt',
                    'test/file3.txt',
                    'test/file1.css',
                    'test/file2.css',
                    'test/test.js'
                ]);

                done();
            });
        });
    });
});
