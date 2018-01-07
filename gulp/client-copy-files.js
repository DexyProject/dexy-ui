'use strict';

var gulp = require('gulp')
var path = require('path')

gulp.task('client-copy-files', function(cb) {
	gulp.src([
		'img/*',
		'img/markets/*',
		'./node_modules/official-lumx/dist/fonts/*',
		'worker.js',
	])
	.pipe(gulp.dest(function(f) {
		if (f.path.match('node_modules/')) return path.dirname(f.path.match('dist/(.*)')[0])
		return path.join('./dist', path.dirname(path.relative(process.cwd(), f.path)));
	}))
	.on('end', cb)
})

