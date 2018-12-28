var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var autoprefixer = require('autoprefixer')
var uglify = require('gulp-uglify')
var brotli = require('gulp-brotli')
var gzip = require('gulp-gzip')   

var sassPaths = [
    'node_modules/foundation-sites/scss',
    'node_modules/motion-ui/src'
]

function sass() 
{
    return gulp.src('scss/app.scss')
        .pipe($.sass({
            includePaths: sassPaths,
            outputStyle: 'compressed' // if css compressed **file size**
        })
            .on('error', $.sass.logError))
        .pipe($.postcss([
            autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] })
        ]))
        .pipe(gulp.dest('public/css'))
}

function brotliCss() 
{
    return gulp.src('public/css/*.css')
        .pipe(brotli.compress({
            extension: 'br',
            skipLarger: false,
            mode: 0,
            quality: 11,
            lgblock: 0
        }))
        .pipe(gulp.dest('public/css'))
}

function zipCss() 
{
    return gulp.src('public/css/*.css')
        .pipe(gzip({gzipOptions: {level:9}}))
        .pipe(gulp.dest('public/css'))
}

function brotliJs()
{
    return gulp.src('public/js/*.js')
        .pipe(brotli.compress({
            extension: 'br',
            skipLarger: false,
            mode: 0,
            quality: 11,
            lgblock: 0
        }))
        .pipe(gulp.dest('public/js'))
}

function zipJs()
{
    return gulp.src('public/js/*.js')
        .pipe(gzip({gzipOptions: {level:9}}))
        .pipe(gulp.dest('public/js'))
}

gulp.task('compress', gulp.parallel(brotliCss, zipCss, brotliJs, zipJs))
gulp.task('default', gulp.series(sass, 'compress'))

gulp.watch('scss/*.scss', sass)
gulp.watch('public/css/*.css', gulp.parallel(brotliCss, zipCss))
gulp.watch('public/js/*.js', gulp.parallel(brotliJs, zipJs))