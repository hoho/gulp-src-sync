/*!
 * gulp-src-sync, https://github.com/hoho/gulp-src-sync
 * (c) Marat Abdullin, MIT license
 */

'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');

var cache;

function walkDirs(ret, dir) {
    if (!dir) { dir = '.'; }

    var files = fs.readdirSync(dir);
    files.sort();

    files.forEach(function(file, index) {
        if (file && file[0] === '.') {
            files[index] = null;
            return;
        }
        var f = path.join(dir, file);
        var stats = fs.statSync(f);
        if (stats.isDirectory()) {
            walkDirs(ret, f);
        }

        files[index] = stats.isFile() ? f : null;
    });

    files.forEach(function(f) {
        if (f) {
            ret.push(f);
        }
    });
}


module.exports = function srcSync(globs) {
    if (typeof globs === 'string') {
        globs = [settings];
    } else if (!(globs instanceof Array)) {
        throw new PluginError('gulp-src-sync', '`globs` should be array or string');
    }

    var src = through.obj(function(file, _, cb) {
        this.push(file);
        cb();
    });

    setTimeout(function() {
        var map = {};

        var files;
        if (!cache) {
            cache = files = [];
            walkDirs(files);
        } else {
            files = cache;
        }

        globs.forEach(function(pattern) {
            pattern = path.relative('.', pattern);

            files.forEach(function(file) {
                if (!(file in map)) {
                    if (minimatch(file, pattern)) {
                        map[file] = true;
                        src.push(new File({
                            path: file,
                            contents: fs.readFileSync(file)
                        }));
                    }
                }
            });
        });

        src.end();
    }, 0);

    return src;
};
