# GULP

##### Gulp是前端开发过程中对代码进行构建的工具，是自动化项目的构建利器，基于node.js。

##### gulp用于管理工具脚本，本身不具有数据处理功能；

##### gulp对已有工具脚本调用管理，通过调用顺序来支持功能拆分组合，提高代码的重复利用。





###  项目根目录：

1. gulpfile.js(任务列表)
2. package.json(项目依赖项)
3. gulp(任务脚本文件夹)
4. 注意事项：
   1. gulpfile.js文件禁止直接写任务逻辑，应该调用逻辑脚本并传送参数
   2. 所有任务逻辑脚本统一放在gulp文件夹目录下，方便统一管理

#### 环境搭建

1. 全新环境搭建
   1. 新建gulpfile.js文件及gulp文件夹
   2. brew install nodejs安装nodejs
   3. 运行npm init命令；生成package.json配置文件
   4. 运行npm install gulp初始化gulp环境
2. 初始化已有gulp环境

1. 1. 新建文件夹拷贝gulpfile.js、package.json文件及gulp文件夹
   2. 运行npm init命令，初始化package.json内的依赖项

### 任务创建

   1. 新建文件：gulp/testTask/testTask.js

   2. testTask.js内容：

      //`TODO 测试任务`

      `exports.test = function () {`

      ​    `console.log("gulp test success");`

      `}`

   3. gulpfile.js新建任务：

      //TOD`O gulp测试`

      `gulp.task('test',function(cb){`

      ​    `let taskTest = require('./gulp/testTask/testTask');`

      ​    `taskTest.test();`

      ​    `cb();`

      `});`


#### 执行gulp任务

   1. 命令行切换到gulpfile.js目录下

   2. 运行gulp test

   3. 运行成功会输出文本：gulp test success

   4. 运行带参数任务：

      1. gulp test --platId=ray_apk

         参数名：platId

         参数值:ray_apk

      2. 参数获取：var excelFile = options.get('platId');

      3. 参数是否存在判断：var hasParam = options.has('platId');

   5. 任务组合：

      gulp.task('taskList',gulp.series(['task1','task2','task3','task4']));

      gulp.series: 按照顺序执行
