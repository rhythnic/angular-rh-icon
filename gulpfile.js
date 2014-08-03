var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jsonminify = require('gulp-jsonminify');

// Lint Task
gulp.task('lint', function () {
  return gulp.src('angular-rh-icon.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('jsmin', function () {
  return gulp.src('angular-rh-icon.js')
    .pipe(rename(function(p){
      p.basename += ".min";
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

// Concatenate & Minify JSON
gulp.task('jsonmin', function () {
  return gulp.src('icons.json')
    .pipe(rename(function(p){
      p.basename += ".min";
    }))
    .pipe(jsonminify())
    .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch('angular-rh-icon.js', ['lint', 'jsmin']);
});

// Default Task
gulp.task('default', ['lint', 'jsmin', 'watch']);