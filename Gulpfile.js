'use strict';

var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    nodemon = require('gulp-nodemon');

var paths = {
  scripts: ['client/app/**/*.js'],
  html: ['client/app/**/*.js', 'client/index.html'],
  styles: ['client/app/css/styles.css'],
};


gulp.task('start', [])


gulp.task('serve', function() {
  nodemon({script: 'index.js', ignore: 'node_modules/**/*.js'});

  gulp.task('default', ['start']);
})
