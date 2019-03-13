# Express

原生的http在某些方面表现不足以应对我们的开发需求，所以我们要使用框架来加快我们的开发效率，框架的目的就是提高效率，让我们的代码更高度统一。

## 修改代码自动重启

使用第三方命令行工具：``nodemon``来解决频繁修改代码重启服务器的问题

``nodemon``是一个基于Node.js开发的一个第三方命令行工具，要独立安装

 ```shell
#任意目录都可以执行，因为加了--global
npm install --global nodemon
 ```

安装完毕后使用：

```shell
node app.js
#使用nodemon，会监视文件变化，自动重启服务器
nodemon app.js
```

## 基本路由

路由器（路由就是导航的意思  按规则寻找指定位置）

### get

```javascript
//当你以GET方法请求 / 的时候，执行对应的处理函数
app.get('/', function(req, res){
    res.send('Got a GET request.');
})
```

### post

```javascript
//当你以POST方法请求 / 的时候，指定对应的处理函数
app.post('/', function(req, res){
    app.send('Got a POST request.')
})
```

## 静态服务

给静态文件指定地址

```javascript
//1.当以/public/开头的时候，去./public/目录中找对应的资源
app.use('/public/', express.static('./public/'));
//2.省略第一个参数时，所有/xxx都在./public/目录中寻找，即可以直接打入public文件夹里的地址不加public
app.use(express.static('./public'));
```

## 在express中配置art-template 

### 安装

```shell
npm install --save art-template
npm install --save express-art-templata
```

### 配置

```javascript
//第一个参数表示，当渲染以.html结尾的文件的时候，使用art-template模板引擎
//express-art-template是专门用来在express中把art-template整合到express中 
app.engine('html', require('express-art-template'));
//express为response相应对象提供了一个方法：render
//render方法 默认是不可以使用，但是如果配置了模板引擎就可以使用了，会自动去项目名的views目录中查找该模板文件
//格式res.render('xxx.html', {模板数据})  xxx.html为项目目录下views文件夹下的相对目录
//默认的views目录可以修改  第一个参数不能改
app.set('views', '要修改的render函数默认路径')
```

### 使用

```javascript
app.get('/', function(req, res){
  //express默认会去项目中的views目录找index.html
  res.render('index.html', {
    title: 'hello world'
  })
})
```

## 在express中重定向

```javascript
app.get('/xxx', function(req, res){
  var comment = req.query;//express中直接获取表单数据 不用再parse
  res.redirect('/');//把 /xxx 重定向到 /
  //重定向原生的方式为
	res.statusCode = 302;//临时重定向302  永久重定向301 
  res.setHeader('Location', '/');
})
```

## 在express中获取GET请求体数据

express内置了一个API，可以直接通过query来获取（对象形式输出）

```javascript
req.query
```

## 在express中获取POST请求体数据

在express中没有设置表单POST请求体的API，要用一个第三方包``body-parser``

### 安装

```shell
npm install --save body-parser
```

### 配置

```javascript
var express = require('express')
//引入
var bodyParser = require('body-parser')

var app = express()

//配置body-parse  配置后req会多一个body属性来获取POST请求体数据（对象形式输出）
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

## 在express中独立路由系统

将路由操作独立要一个js文件中可以让程序业务一目了然

### 建立

```javascript
//新建一个路由文件router.js
var express = require('express');
var router = express.Router();//创建一个路由容器 express提供了方法 专门的路由方法
//新建get请求
router.get('/', function(req, res){}
//新建post请求
router.post('/', function(req, res){}
//最后导出路由
module.exports = router;
```

### 调用

```javascript
//在主执行文件引入路由文件
var router = require('./router');
//调用路由文件
app.use(router);
```

## 在express中独立增改删查操作

写项目中尽量要求业务代码和数据代码分离，这样程序情绪明了，不只是express要这样。

### 建立

```javascript
//新建一个专门处理数据的js文件
//引入必要的包
var fs = require('fs');
//比如新建一个全部查找的方法  callback(err, data)为一个函数  异步函数只能用回调函数的方式调用
exports.find = function(callback) {
  fs.readFile('./db.json', 'utf8', function(err, data){
    if(err){
      callback(err);//将数据返回上层，处理数据的文件不需要管业务的内容，上传就好
      return;
    }
    callback(null, data);//将获取的文件数据返回上层
  })
}
exports.delete = function(id, callback){
  fs.readFile('./db.json', 'utf8', function(err, data){
    if(err){
        callback(err);
        return;
    }
    var db = JSON.parse(data);
    db.data.forEach(function(a, index){
        if(a.UId + '' === id) { 
            db.data.splice(index,1);
            db.count -= 1; 
        }            
    });     
    fs.writeFile('./db.json', JSON.stringify(db), function(err){
        if(err){
            res.send('页面读取失败');
            return;
        }
        callback(null);
    })
  })
}
```

### 调用

由于``fs.readFile``等方法是异步函数，所以不能按调用同步函数``var a = fn();``这种形式，异步函数的调用只能使用回调函数

```javascript
//首先引用上面创建的处理数据的文件包
var user = require('./user');
//使用文件包创建的函数
user.find(function(err, data){
    if(err){
      res.send('页面读取失败');
      return;
    }
    res.send(data);
})
var id = req.body.ids;
user.delete(id, function(err){
    if(err){
      res.send('删除出错.');
      return;
    }
    res.redirect('/');//重定向到首页
})
```

