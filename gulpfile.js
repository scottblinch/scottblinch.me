var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    browserSync = require('browser-sync').create(),
    cacheBust = require('gulp-cache-bust');

gulp.task('default', ['browser-sync', 'minify-css', 'minify-js'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('css/**/*.css', ['minify-css', 'cache-bust']);
    gulp.watch('js/**/*.js', ['minify-js', 'cache-bust', browserSync.reload]);
    gulp.watch('**/*.html', browserSync.reload);
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

gulp.task('minify-css', function() {
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

gulp.task('minify-js', function (cb) {
    pump([
            gulp.src('js/main.js'),
            uglify(),
            concat('main.min.js'),
            gulp.dest('js'),
        ],
        cb
    );
});

gulp.task('cache-bust', function () {
    return gulp.src('index.html')
        .pipe(cacheBust())
        .pipe(gulp.dest('.'));
});
