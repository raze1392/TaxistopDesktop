var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');;

gulp.task('build', ['css', 'js']);

var scriptOrder = [
  'public/scripts/Maps/Maps.js',
  'public/scripts/Maps/MapSearch.js',
  'public/scripts/Maps/MapDirections.js',
  'public/scripts/Utils.js',
  'public/scripts/user.js',
  'public/scripts/*.js'
];
gulp.task('js', function () {
   return gulp.src(scriptOrder)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./public/build/'));
});

gulp.task('css', function() {
  gulp.src('public/stylesheets/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./public/build/'))
});