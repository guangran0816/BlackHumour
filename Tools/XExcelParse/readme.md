导出Excel配置文件

###### iT_excel_format2json
**解析Excel表格为json格式**
**支持导出为json格式和lua格式**

### 0x01 标准

#### 支持数据格式
- string
- boolean：0-false 
- number
- array。默认逗号分隔符
- array_number。
- link_sheetname_id。link_sheet名称_sheetID，支持多维表格
- link格式下，支持范围 1 ~ 10。链接符号~
- ++dict++

#### 表格约定规则
1. 第一行为key，不能为空；如果key的第一个字符为#，表示该列为注释不读取内容。
2. 第二行为内容注释。
3. 第三行为类型。
4. 配置内容默认从第4行开始。
5. 如果某数据为空，则不导出。
6. 第一列为数据的key值。如该行有数据，则不能为空。
7. 第一列连续两行为空，则表格结束。
8. 导出Excel表。以第一个sheet为总览合成总表导出。
9. 导出名称和Excel文件名称一致
10. rewardtype[N],rewardid[N],rewardnum[N]为一个奖励，多个合并为一组奖励。可以配置多组奖励


##### 考虑
1. *指定客户端使用，或者服务器使用？*
2. *指定是否需要翻译？*

### 0x02 check point
1. 指定从第几行开始读取配置内容
2. 指定读取文件
3. 指定导出目录

### 0x03 依赖
xlsx

> npm init -f  
> npm install