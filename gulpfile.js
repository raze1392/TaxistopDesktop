var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css');

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

var styleOrder = [
    'public/stylesheets/style.css',
    'public/stylesheets/style-desktop.css',
    'public/stylesheets/style-mobile.css'
];
gulp.task('css', function() {
  gulp.src(styleOrder)
    .pipe(concatCss("styles.css"))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./public/build/'))
});