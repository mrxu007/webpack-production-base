import '../css/index.css';
import '../css/index2.less';
import '../css/index3.styl';
import '../css/iconfont.css';
import $ from 'jquery';

const sum = function sum(a) {
  console.log(a);
};
sum(10);
console.log($);
/**
 * 编写js代码，分割通过入口文件引入的文件单独打包成chunk
 * promise语法实现异步导入
 * 可以给个标识,容易区分分割后文件
 */
// import(/* webpackChunkName:"test" */'./test')
//   .then(({ mul }) => {
//   // console.log('文件打包成功');
//     console.log(mul(10, 10));
//   }).catch(() => {
//     console.log('文件打包失败');
//   });
// 懒加载测试
$('.lazy_loading').click(() => {
  import(/* webpackChunkName: 'test' */ './test')
    .then(({ mul }) => {
      console.log(mul(4, 5));
    }).catch(() => {
      console.log('文件加载失败');
    });
});
// 预加载测试
// $('.lazy_loading').click(() => {
//   import(/* webpackChunkName: 'test',webpackPrefetch: true */ './test')
//     .then(({ mul }) => {
//       console.log(mul(4, 5));
//     }).catch(() => {
//       console.log('文件加载失败');
//     });
// });
/*
  1.eslint不认识window、navigator全局变量
    解决： 需要修改.eslintrc配置文件
      "env": {
        "browser": true//支持浏览器端全局变量
      }
  2. sw代码必须运行在服务器上
    -->nodejs
    -->
      npm i serve -g
      serve -s dist启动服务器，将打包目录dist作为静态资源暴露出去
*/


// 注册serviceWorker (离线可访问技术)：淘宝等大厂都采用了PWA技术
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('注册成功');
      }).catch(() => {
        console.log('注册失败');
      });
  });
}
