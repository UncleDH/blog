# node.js原生操作

## fs核心模块

### 读文件

- 读``.txt``文件时（``.json``文件同理，``json``文件可以通过``JSON.parse(data)``转换成对象（要满足``json``文件的格式），二进制码也可以转换）
  - ``readFile``函数不加 utf8 这种格式说明，``console.log``打印的就是文件的二进制码
  - ``readFile``函数加了格式就是正常的文件内容
  - ``readFile``函数不加 utf8 这种格式说明，但是``console.log``打印的时候加上``.toString()``，也会显示正常文件内容
- 读``.html``文件时，用原生的``res.end(data)``可以直接输出``html``文件，如果浏览器不识别可以加上``res.writeHead(200, {'Content-Type': 'text/html'})；``或者``res.setHeader('Content-Type', 'text/plain; charset=utf-8');``

```javascript
var fs = require('fs');
fs.readFile('./data/hello.txt', ['utf8'], function(err. data){//以utf-8的格式读文件 可以不加  
  if(err){
    console.log('文件读取出错');
    return;
  }
  console.log(data.toString());
})
```

### 写文件

写文件时转换成字符串的格式写入，可以用``JSON.stringify(db)``把对象转换成字符串

```javascript
var fs = require('fs');
fs.writeFile('./db.json', JSON.stringify(db), function(err){
  if(err){
    res.send('页面读取失败');
    return;
  }
  res.redirect('/');//重定向到首页
})
```

## http核心模块

### 开启http服务

```javascript
//1.加载http核心模块
var http = require('http');
//2.创建一个Web服务器
var server = http.createServer();
//3.注册request请求事件，就会自动触发服务器的request请求事件
server.on('request', function(req, res){
  var url = req.url;//req.url可以读取请求的地址，可以通过if函数做出不同响应
  //请求头上注明内容是plaine文本格式和utf-8格式 如果是html文件就用text/html
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  console.log('xxxx');//这是在命令提示符显示的提示信息
  res.write('xxxx');//这是在客户端(浏览器)显示的信息
  res.end('xxxx');//这是告诉客户端（浏览器）这是最后一句话，也可以没有信息，但是end函数一定有
})
//4.绑定端口号，启动服务器
server.listen(3000, function(){
  console.log('服务器已经启动，这是启动完成的提示')
})
```

----



## 模板引擎

- 在Node中使用 art-template模板引擎
  + 安装
  + 加载
  + template.render()  (替换模板内容函数)
- 客户端渲染和服务端渲染的区别
  + 客户端渲染最少请求两次，第一次是获取页面文件，第二次是Ajax获取数据内容  客户端渲染的数据不能被爬虫获取不利于被搜索引擎获取
  + 服务端渲染最少请求一次，获取服务端渲染好的页面文件  服务端渲染能被爬虫获取

---



## Node中的模块系统

- EcmaScript语言(es6)
  + 和浏览器不同，在node中没有BOM与DOM
- 核心模块(node内置的模块无需安装  require引用)
  + 文件操作的fs
  + http服务的http
  + url路径操作模块
  + 路径处理模块path
  + 操作系统信息os

- 第三方模块(通过npm下载使用，命令行在那个文件夹就会安装在那个文件夹里)
  + art-template
- 自己写的模块
- 加载规则以及加载机制
- 循环加载

### CommonJS模块规范

### 什么是模块化

- 文件作用域
- 通信规则
  + 加载require
  + 导出

### 模块系统

- 模块作用域
- 使用require方法用来加载模块
- 使用exports接口==对象==用来导出模块中的成员 
- 可以参考《深入浅出nodejs》模块系统章节

### 加载require

语法：

```javascript
var 自定义变量名称 = require('模块');
```

作用：

- 执行被加载模块中的代码

- 得到被加载模块中的``exports``导出接口对象

- 由于模块作用域，默认文件中所有的成员只在当前文件模块有效，想公开的成员挂载到``exports``就可以了

  + 导出多个成员（必须在对象中）：

  ```javascript
  //exports是内置对象不需要定义
  exports.a = 123;
  exports.b = 'aaa';
  exports.c = function(){
      console.log('bbb');
  }
  exports.d = {
      foo: 'bar'
  }
  ```

  + 导出单个成员（拿到的就是函数、字符串等）：

   ```javascript
  module.exports = 'hello'//得到直接是字符串不是对象
  module.exports = function (x, y) {
      return x + y;
  }//直接得到函数 module.exports只能有一个 多了后者会覆盖前者
  module.exports = {//直接变对象输出多个内容
      a: 'aaa',
      b: function(a, b){
          return a + b;  
      }
  }
   ```
  + ==原理==：

  ```javascript
  //node默认有module对象  module内部有一个exports空对象
  var module = {
      exports: {
          
      }
  }
  var exports === module.exports;
  //代码最后有
  return module.exports;
  //1.这就解释了为什么不能用exports = xxx，因为exports指向了xxx对象但是代码最后是return module.exports exports就不能输出了。2.也解释了为什么module.exports === xxx后者会覆盖前者--指定对象改变了，同时exports也不能改变module.exports的内容了。
  //所以module.exports = {xxx: yyy}; 等价于 exports.xxx = yyy;
  //exports.foo = 'bar'; 等价于 module.exports.foo = 'bar';
  ```

### require方法加载规则

- 核心模块 -- 模块名

- 第三方模块 -- 模块名

- 用户自己写的 -- 路径

- 优先从缓存加载（加载前会判断别的文件有没有加载过，如果有加载过那就==不执行==加载文件直接从缓存获取exports）

- 判断模块标识

  + 核心模块

    + 本质也是文件，但是已经被编译到二进制文件中了，我们只需要按照名字来加载就可以

  + 第三方模块

    + 必须通过npm下载(会有一个node_modules目录)
    + 只能通过require('包名')的方式来进行加载才可以使用
    + 名字不可能和核心模块相同
    + node发现包名既不是核心模块也不是路径形式的模块
      + 先找到当前文件所处目录中的node_modules目录
      + 寻找node_modules/art-template(包名)
      + 寻找node_modules/art-template(包名)/package.json文件中的main属性(如果main属性没有，node会自动寻找index.js，如果还没有会进入上一级目录中node_modules, 直到磁盘根目录还找不到报错 can not find module xxx ==只会父级查找不会同级查找==)
      + main属性中记录了art-template(包名)的入口模块(一般都是分模块写，分别引用)
      + 然后加载使用这个第三方包，实际加载的还是文件

  + 自定义模块

    + 路径形式的模块(最好用相对路径 方便项目维护 比如换台电脑路径就不一致了)：

      ./(当前目录)     ../(上级目录)    /xxx (根目录 文件在c盘就是c:/xxx 基本不用因为是绝对路径)

## npm

- node package manager
- npm网站
  + npmjs.com
- ==npm命令行工具==
  + 安装淘宝的cnpm(cnpm代替npm global全局安装 任何目录都可以)  npm install --global cnpm
  + 查看版本  npm  --version
  + 升级npm  npm install --global npm
  + 生成package.json文件  npm init
    + 跳过向导，快速生成  npm init -y
  + 安装(install 可以简写成 i   --save可以简写成 -S)  删除(uninstall同理  简写un)
    + npm install 包名  安装包
    + npm install 包名 --save  安装包并保存依赖项(package.json中 新版本5.0以上不加也可以)
    + npm install  一次性把dependencies选项中的依赖项全部安装
  +  查看帮助  npm help  或者  npm  xxx命令 --help

##  package.json

- package.json即==包描述文件==类似于项目的说明书，建议每个项目都要有

- 可以自己手动创建(创建好文件后记得写入一个{})，也可以通过``npm init``的方式来自动初始化出来：

  ```shell
  package name: (第三天) first       #包名字
  version: (1.0.0) 0.0.1             #项目版本号
  description: 第一次尝试创建         #描述
  entry point: (index.js) main.js    #程序入口文件
  test command:                      #测试命令
  git repository:                    #git仓库链接
  keywords:                          #关键词
  author: DH                         #作者
  license: (ISC)                     #开源协议
  #如果文件夹有package.json文件，每次npm安装模块(加上--save才会有)都会在内部dependencies写入模块信息
  "dependencies": {
      "art-template": "4.13.2"
  }
  #当文件夹下有package.json文件(dependencies有引用模块的记录)，没有模块文件时，可以用以下指令安装引用的模块
  npm install  
  ```

## package-lock.json

- 在npm 5.0 以后的版本，install任何包都会自动创建``package-lock.json``这个文件，里面的内容是``node_modules``中所有包的信息（版本、下载地址），比如你安装一个express的包，这个包会依赖很多另外的包，另外的包也会依赖别的包这些信息都会在文件中体现
- 在有``package-lock.json``文件的情况下，如果把``node_modules``文件删除，重新``npm install``的时候安装速度会加快
- 从文件来看，有一个``lock``锁，用来==锁定版本号==，防止下载最新版本，使文件出错
- ``package.json``中版本号前带着一个``^``符号，说明重新安装的时候会安装大于这个版本的最新版本，而``package-lock.json``是不带的所以会锁住版本