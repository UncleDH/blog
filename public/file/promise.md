# promise

> http://es6.ruanyifeng.com/#docs/promise

## 回调地狱

顺序执行几个==异步==程序，输出的顺序不是固定的，比如是读取文件的函数的执行速度是个文件大小挂钩的，越大的文件读取速度越慢，如果要求它们按顺序输出就要进行程序嵌套，类似以下程序，这就会出现回调地狱的情况，函数看着非常长可读性降低。

```javascript
var fs = require('fs')
fs.readFile('./data/a.txt', 'utf8', function (err, data) {
  if (err) {
    throw err
  }
  console.log(data)
  fs.readFile('./data/b.txt', 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    console.log(data)
    fs.readFile('./data/c.txt', 'utf8', function (err, data) {
      if (err) {
        throw err
      }
      console.log(data)
    })
  })
})
```

## promise

为了解决回调地狱的出现，es6加入了promise进行优化

- 创建

  ```javascript
  var p1 = new Promise(function (resolve, reject) {
    //promise函数不是异步的，但是一般内部都是放异步函数
    fs.readFile('./data/a.txt', 'utf8', function (err, data) {
      if (err) {
        reject(err)//如果没有执行就把变量赋给reject
      } else {
        resolve(data)//如果成功执行就把变量赋给resolve
      }
    })
  })
  ```

- 调用

  ```javascript
  p1
    .then(function (data) {//用then执行promise的函数，第一个方法表示成功执行，第二个方法表示执行失败
      console.log(data)
      // 当 p1 读取成功的时候
      // 当前函数中 return 的结果就可以在后面的 then 中 function 接收到
      // 当你 return 123 后面就接收到 123
      //      return 'hello' 后面就接收到 'hello'
      //      没有 return 后面收到的就是 undefined
      // 上面那些 return 的数据没什么卵用
      // 真正有用的是：我们可以 return 一个 Promise 对象
      // 当 return 一个 Promise 对象的时候，后续的 then 中的 方法的第一个参数会作为 p2 的 resolve
      return p2
    }, function (err) {
      console.log('读取文件失败了', err)
    })
   .then(function (data) {//这个data就是p2的resolve
      console.log(data)
      return p3
    })
  ```

  

- 封装

  一般异步程序我们都可以通过使用promise进行封装来对其便捷使用

  ```javascript
  var fs = require('fs')
  function pReadFile(filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  pReadFile('./data/a.txt')
    .then(function (data) {
      console.log(data)
      return pReadFile('./data/b.txt')
    })
    .then(function (data) {
      console.log(data)
      return pReadFile('./data/c.txt')
    })
    .then(function (data) {
      console.log(data)
    })
  ```

  

- 内置使用

  很多api都支持promise，比如ajax中的get

  ```javascript
  var data = {}
      $.get('http://127.0.0.1:3000/users/4')
        .then(function (user) {
          data.user = user
          return $.get('http://127.0.0.1:3000/jobs')
        })
        .then(function (jobs) {
          data.jobs = jobs
          var htmlStr = template('tpl', data)
          document.querySelector('#user_form').innerHTML = htmlStr
        })
  ```

  mongoose的API都支持promise

  ```javascript
  //用户查找
  User.find()
    .then(function (data) {
      console.log(data)
    })
  ```

  

