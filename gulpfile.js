var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create();

gulp.task('default', ['browser-sync', 'minify'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('css/**/*.css', ['minify']);
    gulp.watch('**/*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
});

gulp.task('sass', function(){
    return gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('css'));
});

gulp.task('minify', function() {
    return gulp.src([
            'css/normalize.min.css',
            'css/font-awesome.min.css',
            'css/main.css'
        ])
        .pipe(cleanCSS({
            compatibility: '*',
            keepSpecialComments: '0',
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
