var gulp = require('gulp');

// 引入组件
var path = require('path'), // node自带组件
    fse = require('fs-extra'), // 通过npm下载
    uglify = require('gulp-uglify'),
    babel = require("gulp-babel"),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith-multi'),
    merge = require('merge-stream'),
    concat = require('gulp-concat');

// 获取当前文件路径
var PWD = process.env.PWD || process.cwd(); // 兼容windows
gulp.task('init', function () {
    var dirs = ['dist', 'dist/html', 'dist/css', 'dist/img', 'dist/js', 'src', 'src/sass', 'src/js', 'src/img', 'src/pic', 'src/sprite', 'psd'];
    dirs.forEach(function (item, index) {
        // 使用mkdirSync方法新建文件夹
        fse.mkdirSync(path.join(PWD + '/' + item));
    })
    // 往index里写入的基本内容
    var template = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/><title></title><meta name="apple-touch-fullscreen" content="yes" /><meta name="format-detection" content="telephone=no" /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="black" /></head><body></body></html>';
    fse.writeFileSync(path.join(PWD + '/dist/html/index.html'), template);
    fse.writeFileSync(path.join(PWD + '/src/sass/style.scss'), '@charset "utf-8";');
})

gulp.task('clean', function () {
    return gulp.src('dist/js/**/*.js', {
            read: false
        })
        .pipe(clean());
});

// 编译sass
gulp.task('sass', function () {
    return gulp
        // 在src/sass目录下匹配所有的.scss文件
        .src('src/sass/**/*.scss')
        // 基于一些配置项 运行sass()命令
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifycss()) //执行压缩
        .pipe(rename({
            suffix: '.min'
        })) //rename压缩后的文件名
        // 输出css
        .pipe(gulp.dest('dist/css'));
});

//css兼容
gulp.task('autoprefixer', ['sass'], function () {
    return gulp.src('dist/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['ios 5', 'android 2.3', 'last 4 Explorer versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});


//合并图片
gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprite/**/*.png')
        .pipe(spritesmith({
            spritesmith: function (options, sprite) {
                options.cssName = sprite + '.scss';
                options.cssSpritesheetName = sprite;
            }
        }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('dist/img'))

    var cssStream = spriteData.css
        .pipe(concat('sprite.scss'))
        .pipe(gulp.dest('src/sass'))

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream)
})


gulp.task('minifyjs', ['clean'], function () {
    return gulp.src('src/js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/js')) //输出
        //.pipe(concat('main.js')) //合并所有js到main.js
        .pipe(rename({
            suffix: '.min'
        })) //rename压缩后的文件名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/js')); //输出
});

//=======================
//     服务器 + 监听
//=======================
var browserSync = require('browser-sync').create();
gulp.task('default', function () {
    // 监听重载文件
    var files = [
        'dist/html/**/*.html',
        'dist/css/**/*.css',
        'src/js/**/*.js',
        'src/sprite/**/*.png'
    ]
    browserSync.init(files, {
        server: {
            baseDir: "./",
            directory: false,
            index: "index.html"
        },
        open: 'external',
        startPath: "dist/html/",
        port:"80",
        //使用虚拟主机，基于URL
        //proxy: "local.dev",
        host: "gulp.v",
        // 在chrome、firefix下打开该站点
        browser: ["chrome", "firefox"]
    });
    // 监听编译文件
    gulp.watch("dist/html/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/sprite/**/*.png", ['sprite']);
    gulp.watch("src/js/**/*.js", ['minifyjs']);
    gulp.watch("dist/css/**/*.css", ['autoprefixer']);
});