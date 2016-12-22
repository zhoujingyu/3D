var gulp=require('gulp'),
    sass=require('gulp-sass'),
    cssmin=require('gulp-clean-css'),
    prefixer=require('gulp-autoprefixer');

gulp.task('watchSass',function(){
    gulp.watch('./public/src/sass/**',function(event){
        console.log(event);
        gulp.src('./public/src/sass/**')
            .pipe(sass().on('error',sass.logError))
            .pipe(prefixer({
                cascade:true,
                remove:true
            }))
            .pipe(cssmin({
                keepBreaks:true,
                keepSpecialComments: '*'
            }))
            .pipe(gulp.dest('./public/dist/css/'));
    })
});