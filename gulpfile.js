var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var ngAnnotate = require('browserify-ngannotate');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');

var nib = require('nib');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var path = require('path');

var pack = require('./package.json');

// Where our files are located
var jsFiles = "new_src/js/**/*.js";
var cssFiles = "new_src/styl/*.styl";
var viewFiles = "new_src/**/*.pug";


gulp.task('browserify', ['views'], function () {

    gulp.src(['img/*', 'img/markets/*'])
        .pipe(gulp.dest(function (f) {
            if (f.path.match('node_modules/')) return path.dirname(f.path.match('dist/(.*)')[0]);
            return path.join('./dist', path.dirname(path.relative(process.cwd(), f.path)));
        }));

    gulp.src(cssFiles)
        .pipe(stylus({compress: true, use: nib()}))
        .pipe(concat('blob.css'))
        .pipe(gulp.dest('./dist/css'));

    return browserify('./new_src/js/app.js')
        .transform(babelify, {presets: ["es2015"]})
        .transform(ngAnnotate)
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src("new_src/index.pug")
        .pipe(pug({locals: {mode: 'production', pkg: pack}}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('views', function () {

    return gulp.src(viewFiles)
        .pipe(pug({locals: {mode: 'production', pkg: pack}}))
        .pipe(gulp.dest('./dist'))

});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify'], function () {
    var html = gulp.src("build/index.html")
        .pipe(gulp.dest('./dist/'));

    var js = gulp.src("build/main.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

    return merge(html, js);
});

gulp.task('default', ['html', 'browserify'], function () {

    browserSync.init(['./dist/**/**.**'], {
        server: "./dist",
        port: 8091,
        notify: false,
        ui: {
            port: 8090
        }
    });

    gulp.watch("new_src/index.pug", ['html']);
    gulp.watch(viewFiles, ['views']);
    gulp.watch(jsFiles, ['browserify']);
});