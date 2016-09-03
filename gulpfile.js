

var jshint = require('gulp-jshint');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var paths =
  {
    sass: [
      './sass/*.scss', './sass/*/*.scss'
    ],
    scripts:[
      './public/js/app/*.js', './public/js/app/*/*.js'
    ]
  };

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});


gulp.task('lint', function () {
  return gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch(paths.sass, ['sass']);
});
gulp.task('watch', ['sass:watch']);

gulp.task('default', ['watch']);