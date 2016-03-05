var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('./public/scss/style.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
  gulp.watch('./public/scss/**/*', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'watch']);
