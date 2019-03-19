//专门处理路由系统
var fs = require('fs');
var express = require('express');
var router = express.Router();//创建一个路由容器 express提供了方法
var url = require('url');
var mysql = require('mysql');
var md5 = require('blueimp-md5');

var currentUser = Object();

//选中数据库
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'blog'
});
//连接数据库
connection.connect();

//首页
router.get('/', function(req, res) {
  res.render('./html/index.html');
})
//登录
router.get('/home', function(req, res) {
  res.render('./html/home.html');
})
//登录检测用户名密码
router.post('/signin-user', function(req, res) {
  connection.query('select * from users where userName = "' + req.body.userName + '"', function (error, results, fields) {
    if(error) {
      throw error;
    }
    //判断是否存在这个用户
    if(results.length === 0) {
      //可以使用一些错误码代替 false true 使业务更清晰  
      //使用res.status(200).json(success: flase, message: 'xxx');  传输更多信息
      res.status(200).send('false');
    } else {
      if(results[0].passWord === md5(req.body.passWord)) {
        // currentUser.userName = results[0].userName;
        // currentUser.passWord = results[0].passWord;
        // currentUser.head = results[0].head;
        res.status(200).send('true');
      } else {
        res.status(200).send('false');
      }
    }
  });
})
//注册
router.get('/register', function(req, res) {
  res.render('./html/register.html');
})
//注册写入
router.post('/register-user', function(req, res){
  connection.query('select count(*) as num from users where userName = "' + req.body.userName + '"', function (error, results, fields) {
    if(error) {
      throw error;
    }
    //判断是否存在这个用户
    if(results[0].num) {
      res.send('0');
    } else {
      connection.query('INSERT INTO USERS VALUES (null, "' + req.body.userName + '", "' + md5(req.body.passWord) + '", null, null)', function (error, results, fields) {
        if(error) {
          throw error;
        }
        console.log('The solution is: ', results);
        res.send('1');
      });
    }
  });

})
//请求当前用户
// router.get('/currentUser', function(req, res){
//   res.send(currentUser);
// })
//查询当前有多少文章
router.get('/contentAll', function(req, res){
  var path = './public/file/';
  var files = fs.readdirSync(path);
  var content = [];
  files.forEach(function (itm, index) {
    var stat = fs.statSync(path + itm);
    if (stat.isDirectory()) {//判断是否还是文件夹
      res.send('false');
    } else {
      var obj = {};//定义一个对象存放文件的路径和名字
      //obj.path = path;//路径
      obj.filename = itm//名字
      obj.mtime = stat.mtime;
      //filesList.push(obj);
      content[index] = obj;
    }
  })
  res.send(content);
})
//文章内容页面
router.get('/content/*', function(req, res){
  res.render('./html/content.html');
})
//文章内容
router.get('/md', function(req, res){
  // var search = url.parse(req.url).search.split('?')[1];//获取url ? 后的内容
  // var theRequest = new Object();
  // theRequest[search.split('=')[0]]=search.split('=')[1];//将url参数封装成对象
  var search = req.query;
  fs.readFile('./public/file/' + search['id'] + '.md', 'utf8', function(err, data){
    if(err) {
      throw err;
    }
    res.send(data);
  })
})
//上传文件
router.get('/upload', function(req, res){
  res.render('./html/uploadPaper.html');
})
//导出路由
module.exports = router;