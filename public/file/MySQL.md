# MySQL

```shell
root 123
```

```shell
#定位到mysql安装的bin文件夹
#初始化数据所需的文件 获取一个临时密码 
mysqld --initialize --user=mysql --console
#回车后记下临时密码 登录要用到
#创建一个mysql服务 指定名字为MySQL 就可以在windows服务中开启关闭服务
mysqld --install MySQL
#用临时账号密码登录
mysql -u root -p
#回车后输入上面复制的临时密码
#进入mysql环境后 所有命令都要带;;;;;;;;;;;;;;;;;;;;
#修改临时密码 set password for root@localhost = password('123'); 这个命令不行就用下面这个
alter user 'root'@'localhost' identified by  '123';
#到这步初始化完成
#navicat 连接数据库会报错 1251 client does not support...
#进入mysql  查看用户信息
select host,user,plugin,authentication_string from mysql.user;
#如果root的plugin不是mysql_native_password的话要自己修改密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
#这样navicat就可以连接了
```

```shell
#退出mysql
exit;
#帮助
help;
#查看数据库
show databases;
#创建一个数据库
create database dbnamexxx;
#进入一个数据库
use dbnamexxx;
#显示数据的内容
show tables;
#创建一个表
create table tname (定制列） 
create table user（id int, name char(5), age int, gender int);
#删除表
drop table tname;
#删除数据库
drop database dbname;
#查看指定表结构
desc tname;
#执行本地SQL文件中的SQL语句
source ./地址/xxx.sql
```

```shell
#查询语句  返回结果集
select 列名xxx from tnamexxx;
select name from user;
select * from user;#查user这个表的所有信息
select `name`, `gender`, `age` from user;#查询多列要用``和，分隔
select 1 from user;#查询表中的1数据
select id, 1 from user;#查询1数据的id

#新增语句  返回受影响的行数
insert into tname values (新增的数据);
insert into user values (null, 'DH', 11);
insert into user (name, age) value ('DH', 11);#完整版

#删除语句  配合数据筛选where  删除都是删除整行的数据
delete from tname;#删除所有
delete from tname where id = 1;#删除满足条件的行 id不会重新排序
delete from tname where id = 1 and id < 2;
delete from user where id in (1, 2, 3, 4);#删除数据id为1 2 3 4的行

#修改
update tname set 列名 = "xxx";#修改所有行的xx列为"xxx"
updata user set name = 'DH', age = '111' where id in (1, 2, 3);

#子语句
select count(xx) as 去个名字 from user;#查询user中xx的数量
select max(id) from user;#最大id
select min(id) from user;#最小id
select avg(age) from user;#平均age
select * from user limit 2;#分页操作 限制取前2条数据
select * from user limit 1, 2;#跳过前2条 取第3,4条
```



## 基本概念

按等级分

- 数据库
- 表
- 字段 -- 就是指列
- 字段类型 -- 指列能够存储的数据种类(下面为常用类型不完整  没有布尔类型)
  + int
  + char(<length>)
  + varchar(<length>)
  + date
  + decimal -- 小数 加小数点的类型