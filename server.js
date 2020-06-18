/*
启动服务器
node server.js
*/
const express = require('express');
const app = express();
app.use(express.static('dist', {
  //当我们代码上线,我们的资源都要做缓存处理，
  //用户第二次访问的时候，直接走访缓存。不需要花太多时间，速度非常快
  //但是强制缓存有缺点，当我们代码在强缓存期间遇到紧急bug时，修复bug重新打包构建，
  //但是资源还在强制缓存期间，新代码就不会被请求
  //先去了解浏览器的缓存机制：强缓存，协商缓存
  //解决办法给资源名称做处理，给随机hash值
  maxage: 1000 * 3600//强制缓存1个小时
}));
app.listen(3000);
