var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');

var src = './client/js';
var aliases = {};

var iterate = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }
        var i = 0;
        (function next () {
            var file = list[i++];

            if (!file) {
                return done(null);
            }

            file = dir + '/' + file;
            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    iterate(file, function (error) {
                        next();
                    });
                } else {
                    var reg = new RegExp('.*\.\(js\|jsx\|tpl\|handlebars)');
                    if( reg.test(path.extname(file))){
                        aliases[path.basename(file,path.extname(file))] = path.resolve(__dirname,file);
                    }
                    next();
                }
            });
        })();
    });
};

iterate(src, function(error) {
    if (error) {
        throw error;
    } else {

        var outputFilename = './dll/aliases.json';

        fs.writeFile(outputFilename, JSON.stringify(aliases, null, 4), function(err) {
            if(err) {
                gutil.log(gutil.colors.red(err));
            } else {
                gutil.log(gutil.colors.green.bold("Alias JSON saved to: " + outputFilename));
            }
        });
    }
});
