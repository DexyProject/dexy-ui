'use strict';

var gulp = require('gulp')
var pack = require('../package.json')
var depsBlob = require('../build/browserify-client-deps')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var addsrc = require('gulp-add-src')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var fs = require('fs')
var browserify = require('browserify')
var minify = require('gulp-babel-minify')

var configPath = require('../build/get-config-path')

gulp.task('client-bundle-js', function(cb) {
	// Take the normal deps blob, uglify it, add the rest of the JS files to it

	// deps blob is around 600-800kb (minified)
	// others should be around 500kb (minified), according to resources.pug
	// angular 164k, hls 116k, jquery 88k
	// TOTAL 1.2MB

	var scripts = []

	fs.readFileSync('./src/resources.pug').toString().split('\n').forEach(function(line) {
		if (line.match('script')) {
			var script = line.split('\'')[1]
			if (fs.existsSync(script)) scripts.push(script)
			else throw "script does not exist: "+script
		}
	})

	function createErrorHandler(name) {
		return function (err) {
			console.error('Error from ' + name + ' in compress task', err.toString());
			throw err
		};
	}

	// WARNING: is there a more elegant way to make this work? it's using 4 plug-ins
	var blobPipe = depsBlob(configPath).bundle().pipe(source('blob.js')).pipe(buffer())
	.pipe(addsrc.append(scripts))
	.on('error', createErrorHandler('addsrc'))
	.pipe(sourcemaps.init())
	.pipe(minify({
		mangle: {
			keepClassName: true
		}
	}))
	.on('error', createErrorHandler('uglify'))
	.pipe(concat('blob.js'))
	.pipe(sourcemaps.write('../sourcemaps', { addComment: false }))
	.pipe(gulp.dest('./dist'))
	.on('error', createErrorHandler('gulp.dest'))
	.on('end', cb)
})
