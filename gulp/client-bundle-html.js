'use strict';

var gulp = require('gulp')
var pug = require('gulp-pug')
var sourcemaps = require('gulp-sourcemaps')
var pack = require('../package.json')
var child = require('child_process')

gulp.task('client-bundle-html', function(cb) {
	child.exec('git rev-parse HEAD', function(err, stdout, stderr) {
		if (err) return cb(err)
		if (stderr) return cb(new Error(stderr))

		pack.hash = stdout.trim()

		gulp.src('./src/index.pug')
		.pipe(sourcemaps.init())
		.pipe(pug({ locals: { mode: 'production', pkg: pack } }))
		.pipe(sourcemaps.write('../sourcemaps', { addComment: false }))
		.pipe(gulp.dest('./dist'))
		.on('end', cb)
	})
})