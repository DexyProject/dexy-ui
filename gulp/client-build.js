'use strict';

var gulp = require('gulp')
var runSequence = require('run-sequence')

gulp.task('client-build', function(callback) { 
	runSequence(['client-bundle-js', 'client-bundle-css', 'client-bundle-html', 'client-copy-files'],
		callback);
})