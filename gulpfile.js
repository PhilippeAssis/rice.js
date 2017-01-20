var gulp = require('gulp');
var minify = require('gulp-minify');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var babelConfig = {
    presets: ['env']
}

gulp.task('default', function() {
    gulp.src(['./src/libs/*.js', './src/*.js'])
        .pipe(babel(babelConfig))
        .pipe(concat('rice.js'))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./dist'))
})
