# vue.js高仿饿了么APP页面<br>
## 主页页面：<br>https://github.com/WangYingYaTou/Vue-App/blob/master/src/assets/images/index.png
### vue当前最火的mvvm框架
#### 本项目主要构成部分：
    vue-source&nbsp;&nbsp;与后端进行交互<br>
    vue-router&nbsp;&nbsp;前段实行spa单页面应用<br>
    收藏部分&nbsp;&nbsp;localstorage存储在服务器端<br>
    Eslint&nbsp;&nbsp;es6代码风格检查工具<br>
    vue-cli&nbsp;&nbsp;写好vue.js代码的工具<br>
### spa单页面应用
核心：数据驱动、组件化（就近维护）<br>
### css &nbsp;strikyfooter布局
  
  
  
    <div class="wripper clearfix">
      <div class="content">
       
      </div>
    <div>
    <div class="footer">
    </div>
1.负margin
          
          .wripper {
              min-height:100%;      //一定要给最小高度
              padding-bottom:50px;  //footer的高度
          }
          .footer {
              positive:relative;
              margin-top:-50px;    //保持footer高度相同
              height:50px;
              clear:both;
          }
  content元素的padding-bottom = footer的高度 = footer的margin的负值
  
  2.flex
  
     <div class="wripper clearfix">
        <div class="content">
          这里是内容
        </div>
        <div class="footer">
        </div>
      <div>
 style的样式 
       .wrapper {
          min-height:100vh;
          display:flex;
          flex-direction:column;
       }
       .content {
           flex:1;
       }
       .footer {
          flex:0;
        }
