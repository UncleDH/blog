var cookieTime = 1;//预设cookie时间  1小时
//创建cookie
function setCookie(c_name, value, expiretime) {//小时为单位
  var exdate = new Date();
  exdate.setTime(exdate.getTime() + expiretime * 60 * 60 * 1000);
  document.cookie = c_name+ "=" +escape(value) + ((expiretime === null) ? "" : ";expires=" + exdate.toGMTString());
}
//查询cookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start!=-1) { 
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end==-1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
  return 'false'
}
//删除cookie
function delCookie(name) {
  var exdate = new Date();
  exdate.setTime(exdate.getTime() - 1);
  var cval = getCookie(name);
  if(cval != null)
  document.cookie= name + "=" + cval+";expires=" + exdate.toGMTString();
}
//导航栏组件
Vue.component('topbar', {
  data: function() {
    return {
      userName: '账号<span class="caret"></span>'
    }
  },
  template: `
    <!-- 背景图片 -->
    <div class="top body-offcanvas">
      <div class="background">
        <!-- 导航条 -->
        <nav class="navbar navbar-default-dh">
          <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle offcanvas-toggle"
                data-toggle="offcanvas" data-target="#js-bootstrap-offcanvas-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="/home">
                <img alt="Brand" src="/public/img/new1.png" style="z-index: 1;">
              </a>
            </div>
            <nav class="navbar-offcanvas navbar-offcanvas-right navbar-offcanvas-touch navbar-offcanvas-fade"
            role="navigation" id="js-bootstrap-offcanvas-2">
                <div>
                  <ul class="nav navbar-nav navbar-right">
                    <li><a href="/home">首页</a></li>
                    <li><a href="#">归档</a></li>
                    <li><a href="#">关于</a></li>
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle user" data-toggle="dropdown" role="button" aria-haspopup="true"
                        aria-expanded="false" v-html="userName"></a>
                      <ul class="dropdown-menu">
                        <li><a href="#">个人信息</a></li>
                        <li><a href="#">修改密码</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="/" class='logout'>登出</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
            </nav>
          </div>
        </nav><!-- 导航条 -->
        <div class="title">
          <h1 class="animated bounceInDown delay-1s" style="font-size:60px">oddddddd</h1>
          <h2 class="animated bounceInDown delay-1s">odd的Blog</h2>
        </div>
      </div>
    </div>
  `,
  created: function() {
    if(getCookie('userName') !== 'false') {
      this.userName = getCookie('userName') + '<span class="caret"></span>'
    }
  }
})
//底部栏组件
Vue.component('footerbar', {
  data: function() {
    return {

    }
  },
  template:`
    <footer class="footer">
      <div class="container">
        <div class="col-md-6 col-md-offset-3 content-footer">
            <a><img src="/public/img/shortcut_48.ico"></a>
            <p>COPYRIGHT 2019 <span>DH</span>. ALL RIGHTS RESERVED.</p>
            <p>2019.3.5</p>
        </div>
      </div>
    </footer>
  `
})
//导航栏实例
var vm_topBar = new Vue ({
  el: '#topBar',
  // data: {
  //   userName: '账号<span class="caret"></span>'
  // },
  // created: function() {
  //   if(getCookie('userName') !== 'false') {
  //     this.userName = getCookie('userName') + '<span class="caret"></span>'
  //   }
  // }
})
//底部栏实例
var vm_footer = new Vue ({
  el: '#footer',
})
