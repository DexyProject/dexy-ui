'use strict';

var gulp = require('gulp')
var path = require('path')

gulp.task('client-copy-files', function(cb) {
	gulp.src([
		'img/*',
		'worker.js',
	])
	.pipe(gulp.dest(function(f) {
		return path.join('./dist', path.dirname(path.relative(process.cwd(), f.path)));
	}))
	.on('end', cb)
})

