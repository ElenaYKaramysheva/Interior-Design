const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const hb = require('gulp-hb');

// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        injectChanges: true,
        server: { baseDir: './' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function styles() {
    return src('./less/styles.less')
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'], grid: true
        }))
        .pipe(dest('./css/'))
        .pipe(browserSync.stream())
}

function html() {
    return src('./hb/*.html')
        .pipe(hb()
            .partials('./hb/**/*.hbs')
            .helpers('./asset/js/handlebars-helpers.js')
            .data('./asset/data/**/*.{js,json}')
        )
        .pipe(dest('./'))
        .pipe(browserSync.stream());
}

function startwatch() {
    // Мониторим файлы на изменения
    watch('./less/**/*.less', styles);
    watch('./hb/**/**/*.(hbs|html)', html);
    // watch('./asset/js/**/*.js').on('change', browserSync.reload);
    // watch('./asset/data/**/*.json').on('change', browserSync.reload);
    watch('./*.html').on('change', browserSync.reload);
}

// Экспортируем функцию browsersync() как таск browsersync.
// Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
exports.styles = styles;
exports.html = html;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, html, browsersync, startwatch);
