var express = require('express');
var bodyParser = require('body-parser');//引入body-parser，方便接受post内容
var router = require('./router');//引入路由模块 自己写的
var session = require('express-session');

var app = express();

app.engine('html', require('express-art-template'));//render 识别html后缀
//配置body-parse  配置后req会多一个body属性来获取POST请求体数据（对象形式输出）
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//处理静态文件
app.use('/public', express.static('public'));
//session初始化
// app.use(session({
//   secret: 'www',//配置加密字符串，将要加密的部分拼上这个字符串再进行md5加密提高安全性
//   resave: false,
//   saveUninitialized: true,//无论你是否使用session，默认就会提供'钥匙'
//   cookie : {
//     maxAge : 1000 * 60 * 5, // 设置 session 的有效时间，单位毫秒
//   }
// }))

app.use(router);//调用路由
app.use(function(req, res){
  //这边可以返回404页面，所有没有定过的路由都会要这里
  res.render('./html/404.html');
}) 

app.listen(2333, function(){
  console.log('port 2333 is running...')
})