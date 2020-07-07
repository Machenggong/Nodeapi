const express = require('express')
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser')// express默认的中间件
const passport = require('passport') //

const obj = require('./config/mongodb')
const users = require('./routes/apis/users')

//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

app.get('/',(req,res)=>{
    res.send('hello')
})

// 连接 mongodb数据库
mongoose.connect(obj.mongodbUrl).then( ()=>{
    console.log('MongoDB数据库连接成功')
}).catch(err=>{
    console.log(err)
})

// 使用 express这个框架默认的 body-parser这个中间件  
// 来解析处理application/x-www-form-urlencoded   和 application/json 这两种格式的请求体
// 如果不使用这个中间件, 那么需要使用下面的解析方式:
// http.createServer(function(req, res){
//     if(req.method.toLowerCase() === 'post'){
//         let body = '';
//         //此步骤为接收数据
//         req.on('data', function(chunk){
//             body += chunk;
//         });
//         //开始解析
//         req.on('end', function(){
//             if(req.headers['content-type'].indexOf('application/json')!==-1){
//                 JSON.parse(body);
//             }else if(req.headers['content-type'].indexOf('application/octet-stream')!==-1){
//                 //Rwa格式请求体解析
//             }else if(req.headers['content-type'].indexOf('text/plain')!==-1){
//                 //text文本格式请求体解析
//             }else if(req.headers['content-type'].indexOf('application/x-www-form-urlencoded')!==-1){
//                 //url-encoded格式请求体解析
//             }else{
//             //其他格式解析
//             }
//         })
//     }else{
//         res.end('其他方式提交')
//     }


// ---bodyParser.json()--解析JSON格式
// ---bodyParser.raw()--解析二进制格式
// ---bodyParser.text()--解析文本格式
// ---bodyParser.urlencoded()--解析文本格式

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize()); //初始化passport


require('./config/passport')(passport)  // 引入模块，模块抽离的写法


// 注册
app.use('/api/users',users)
// 登陆

const port = process.env.PORT || 5000



app.listen(port, ()=>{
    console.log(`服务启动成功,端口号是：${port}`)
})