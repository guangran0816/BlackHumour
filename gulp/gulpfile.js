const gulp = require("gulp");

//TODO gulp测试
gulp.task('test',function(cb){
    let taskTest = require('./gulp/testTask/testTask');
    taskTest.test();
    cb();
});




