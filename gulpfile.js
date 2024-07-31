const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const pump = require('pump');
const browserSync = require('browser-sync').create();
const cacheBust = require('gulp-cache-bust');
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

gulp.task('build', gulp.series(
    'sass',
    'minify-css',
    'minify-js',
    'cache-bust',
    'sw',
));

gulp.task('watch', gulp.series(
    'build',
    function (done) {
        gulp.watch('scss/**/*.scss', gulp.series('sass'));
        gulp.watch('css/**/*.css', gulp.series('minify-css', 'cache-bust'));
        gulp.watch('js/**/*.js', gulp.series('minify-js', 'cache-bust', function () {
            browserSync.reload();
        }));
        gulp.watch('**/*.html').on('change', browserSync.reload);
        done();
    },
    'browser-sync',
));

gulp.task('default', gulp.series('build'));
