var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function() {
    return gulp.src(['css/normalize.min.css', 'css/main.css'])
        .pipe(cleanCSS({
            compatibility: '*'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('css'));
});
