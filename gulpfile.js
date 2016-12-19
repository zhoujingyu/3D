var gulp=require('gulp'),
    sass=require('gulp-sass'),
    cssmin=require('gulp-clean-css');

gulp.task('watchSass',function(){
    gulp.watch('./public/src/sass/**',function(event){
        console.log(event);
        gulp.src('./public/src/sass/**')
            .pipe(sass({
                outputStyle:'compact'
            }).on('error',sass.logError))
            .pipe(cssmin({
                keepBreaks:true,
                keepSpecialComments: '*'
            }))
            .pipe(gulp.dest('./public/dist/css/'));
    })
});