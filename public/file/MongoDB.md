#  MongoDB

## 关系型数据库和非关系型数据库

表就是关系或者说表与表之间存在关系

- 关系型数据库
  + 都需要通过``sql``语言来操作
  + 在操作之前都需要设计表结构
  + 数据表还支持约束（唯一的，主键，默认值，非空）
- 非关系型数据库
  + 一些数据库只是单纯的key-value对
  + MongoDB是非关系型数据库，与关系型有相同地方
    + 数据库 对应 数据库
    + 数据表 对应 集合（数组）
    + 表记录 对应 （文档对象）
  + MongoDB不需要设计表结构

## 安装

> 官网下载：https://www.mongodb.com/    

安装后要配置环境变量 在命令行``mongod --version``可以判断是否安装成功

## MongoDB数据库操作

> 推荐查看菜鸟教程的MongoDB的教程http://www.runoob.com/mongodb/mongodb-insert.html

- 启动

  ```shell
  #mongodb默认使用执行mongod命令所处盘符根目录下的/data/db作为自己的数据存储目录
  #没有这个目录会启动失败，所以第一次执行这个命令要手动创建这个文件夹
  mongod
  #如果想要修改默认的数据存储目录
  mongod --dbpath=数据存储目录路径                                              
  ```

- 关闭

  ctrl + c

- 连接数据库

  连接前要保证数据库开启，新开一个命令控制台

  ```shell
  #默认连接本机的MongoDB服务 
  mongo
  ```

- 退出数据库

  ```shell
  #在连接状态输入，断开连接
  exit
  ```

## 基本命令

- ``show dbs``
  + 查看显示所有数据库
- ``db``
  + 查看当前操作的数据库（默认为一个test数据库，该库是还没有创建的，当有数据时会自动创建）
- ``use 数据库名称``
  + 切换到指定的数据库（如果没有会新建，先切换有数据以后会自动切换）
- `db.库名.insert(document)`
  + 插入文档，可以用类似json的格式，{"name": "DH"}
- ``show.collections``
  + 查看库下面有多少集合，也就是表
- db.库名.find()
  + 查看当先库的数据

## 在Node中如何操作MongoDB数据

可以使用官方原生的MongoDB包来操作，但为了加快开发效率使用第三方``mongoose``来操作MongoDB数据库

mongoose是对官方MongoDB包的封装，操作更简单

### 安装

```shell
npm i mongoose
```



### 快速上手

控制台要开启MongoDB

```javascript
var mongoose = require('mongoose');
// 连接 MongoDB 数据库  localhost为本机  test为库名（没有创建的库名也可以有数据后会自动创建）
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
// 创建一个模型，就是在设计数据库，MongoDB 是动态的，非常灵活，只需要在代码中设计你的数据库就可以了
//下面代码的意思，在库中创建一个表，Cat是表名，里面有一个name属性要求格式为字符串
var Cat = mongoose.model('Cat', { name: String });
//实例化一个kitty
kitty = new Cat({ name: 'bbb' });
// 持久化保存 kitty 实例
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});
```

### 具体操作

- 设计Scheme发布Model

  ```javascript
  var mongoose = require('mongoose');
  // 连接 MongoDB 数据库  localhost为本机  test为库名（没有创建的库名也可以有数据后会自动创建）
  mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
  //设计集合结构（表结构） 字段名称就是表结构中的属性名称
  //名称后面跟数据类型，还可以加约束保证数据完整性，不要有脏数据
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    username: {
      type: String,//设置数据类型
      required: true//加约束，必须有这个值
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    gender: {
      type:Number,
      enum: [0,1],//约束枚举类型 不是0就是1
      default: 0//默认为0
    }
  });
  //将文档结构发布为模型 mongoose.model方法就是用来将一个架构发布为model 
  //第一个参数传入一个大写单数字符串用来表示你的表名称 mongoose会自动将大写变小写并在结尾加上's'  'User'变成'users'
  //返回值为模型构造函数
  var User = mongoose.model('User', userSchema);
  ```

- 增加数据

  ```javascript
  var admin = new User({
    username: 'admin',
    password: '123456 
    email: 'admin@qq.com' 
  })
  ```

- 保存数据

  ```javascript
  admin.save(function (err, ret){
    if(err){
      console.log(err);
    }else{
      console.log('ok');
      console.log(ret);//打印数据
    }
  })
  ```

  

- 查询数据

  ```javascript
  //查找users表中所有数据
  User.find(function(err, ret){
    if(err){
      console.log(err);
    }else{
      console.log(ret);
    }
  })
  //查找所有username为111的数据返回是数据  User.findOne方式是查询第一条符合的内容返回是对象
  User.find({username: '111'}, function(err, ret){
    if(err){
      console.log(err);
    }else{
      console.log(ret);
    }
  })
  ```

- 删除数据

  ```javascript
  //deleteOne删除第一个符合条件的  deleteMany删除所有符合条件的
  User.deleteMany({username: '111'}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log('删除成功');
    }
  })
  ```

  

- 更新数据

  ```javascript
  //按照ID改数据内容
  User.findByIdAndUpdate('5c76819578dd2dd20c570212', {
    username: '233'
  }, function(err, ret){
    if(err){
      console.log(err);
    }else{
      console.log('更新成功');
    }
  })
  ```

  


