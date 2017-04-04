const gulp = require('gulp');
const pump = require('pump');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

gulp.task('test', cb => {
  pump([
      gulp.src('src/test.js'),
      eslint(),
      eslint.format(),
      eslint.failAfterError(),
      babel({
        presets: ['es2015'],
        plugins: [
          require('babel-plugin-transform-object-rest-spread'),
          require('babel-plugin-transform-class-properties'),
          require('babel-plugin-transform-async-to-generator'),
          require('babel-plugin-transform-runtime'),
        ]
      }),
      gulp.dest('/')],
    cb);
});

gulp.task('cache', cb => {
  pump([
      gulp.src('index.js'),
      eslint(),
      eslint.format(),
      eslint.failAfterError(),
      babel({
        presets: ['es2015'],
        plugins: [
          require('babel-plugin-transform-object-rest-spread'),
          require('babel-plugin-transform-class-properties'),
          require('babel-plugin-transform-async-to-generator'),
          require('babel-plugin-transform-runtime'),
        ]
      }),
      gulp.dest('es5')],
    cb);
});