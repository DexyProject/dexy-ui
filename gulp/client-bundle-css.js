'use strict';

var gulp = require('gulp')
var nib = require('nib')
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var addsrc = require('gulp-add-src')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var fs = require('fs')


gulp.task('client-bundle-css', function(cb) {
	var sheets = []

	fs.readFileSync('./src/resources.pug').toString().split('\n').forEach(function(line) {
		if (!line.match('link')) return

		var sheet = line.split('\'')[3]
		if (sheet.match('.css')) {
			var spl = sheet.split('/')

			// TODO: better detection if it's a css generated from styl or an existing file (fs.existsSync ?)

			if (spl.length === 1) {
				spl.unshift('src/styl') // if it's in the root, add src/styl/ in front
				sheets.push(spl.join('/').replace('.css', '.styl'))
			} else {
				sheets.push(sheet)
			}
		}
	})
	
	gulp.src(sheets)
	.pipe(stylus({ compress: true, use: nib() }))
	.pipe(concat('blob.css'))
	.pipe(gulp.dest('./dist'))
	.on('end', cb)

})