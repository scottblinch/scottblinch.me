const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const pump = require('pump');
const browserSync = require('browser-sync').create();
const cacheBust = require('gulp-cache-bust');
const imagemin = require('gulp-imagemin');
const path = require('path');
const swPrecache = require('sw-precache');

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './',
        },
    });
});

gulp.task('sass', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('css'));
});

gulp.task('minify-css', function () {
    return gulp.src([
        'css/normalize.min.css',
        'css/font-awesome.min.css',
        'css/main.css',
    ])
        .pipe(cleanCSS({
            compatibility: '*',
            keepSpecialComments: '0',
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false,
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

gulp.task('minify-js', function (cb) {
    pump([
        gulp.src('js/main.js'),
        uglify(),
        concat('main.min.js'),
        gulp.dest('js'),
    ], cb);
});

gulp.task('cache-bust', function () {
    return gulp.src('index.html')
        .pipe(cacheBust())
        .pipe(gulp.dest('.'));
});

gulp.task('images', function () {
    gulp.src(['img/*', '!img/dist/*'])
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
        ]))
        .pipe(gulp.dest('img/dist'));
});

gulp.task('sw', function (callback) {
    var rootDir = './';

    swPrecache.write(`${rootDir}/service-worker.js`, {
        staticFileGlobs: [
            rootDir + '**.html',
            rootDir + 'css/**.css',
            rootDir + 'fonts/**.*',
            rootDir + 'img/**.*',
            rootDir + 'js/**.js'
        ],
        stripPrefix: rootDir,
        minify: true
    }, callback);
});

gulp.task('default', gulp.series(
    'browser-sync',
    'minify-css',
    'minify-js',
    function () {
        gulp.watch('scss/**/*.scss', ['sass']);
        gulp.watch('css/**/*.css', ['minify-css', 'cache-bust']);
        gulp.watch('js/**/*.js', ['minify-js', 'cache-bust', browserSync.reload]);
        gulp.watch('**/*.html', browserSync.reload);
    },
));
