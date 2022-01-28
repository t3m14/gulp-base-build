const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin')
const del = require('del')

function build() {
    return src([
        'app/css/style.min.css',
         'app/fonts/**/*',
         'app/js/main.min.js',
         'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))

}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function clearDist (){
    return del('dist')
}
function images() {
    return src('app/images/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())

}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist : ['last 10 versions']
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching() {
    watch(["app/scss/**/*.scss"], styles);
    watch(['app/html/**/*.html']).on('change', browserSync.reload)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = clearDist;

exports.build = series(clearDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching)