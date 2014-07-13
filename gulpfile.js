// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('angular-rh-icon.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('min', function() {
    return gulp.src('angular-rh-icon.js')
        .pipe(rename('angular-rh-icon.min.js'))
        .pipe(uglify());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('angular-rh-icon.js', ['lint', 'min']);
});

// Default Task
gulp.task('default', ['lint', 'min', 'watch']);