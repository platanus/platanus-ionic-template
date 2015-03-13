var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var ignore = require('gulp-ignore');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var del = require('del');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var env = gutil.env.env || 'development';
var envPath = './environments/' + env + '.json'

var paths = {
  sass: ['./app/scss/**/*.scss']
};

gulp.task('default', ['sass']);
gulp.task('build', ['env', 'sass', 'cleanup-www', 'copy-ignore', 'autoprefix']);

gulp.task('env', function () {
  gulp.src(envPath)
    .pipe(ngConstant({
      name: 'app.env'
    }))
    .pipe(rename('env.js'))
    .pipe(gulp.dest('./app/js'));
});

gulp.task('sass', function() {
  gulp.src('./app/scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/css/'));
});

gulp.task('cleanup-www', function(){
  del.sync(['./www']);
});

gulp.task('copy-ignore', function(){
  var buildignore = fs.readFileSync('.buildignore', { encoding: 'utf-8' });
  var lines = buildignore.split('\n');
  var paths = [];

  lines.forEach(function(line){
    line = line.trim();
    if ( line.indexOf('#') == 0 || line.length == 0 ) return;
    if ( line[line.length-1] == '/' ) line = line + '**/*';
    paths.push('!./app/'+line);
  });

  paths.unshift('./app/**/*');

  gulp.src(paths)
    .pipe(gulp.dest('./www/'));
});

gulp.task('autoprefix', function(){

});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
