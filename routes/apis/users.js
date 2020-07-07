const express = require('express')

const router = express.Router();
const bcrypt = require('bcrypt')  // 密码加密
const gravatar = require('gravatar') // 头像插件
const jwt = require('jsonwebtoken') //token 中间件
const passport = require('passport') // Express框架兼容身份验证中间件

const User = require('../../modules/User') // 引入注册用户的参数模型
const keys = require('../../config/mongodb')


// 注册
router.post('/register', (req, res) => {

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.json({
                    status:400,
                    email: '邮箱已经被注册过了'
                })
            } else {
                var avatar = gravatar.url(req.body.email,{s:'200',r:'pg',d:'mm'}) // 获取头像，大小宽度  npmjs.com 查看用法
                const newUser = new User({ //创建新的模型，赋值
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save() //保存数据，存储到mongodb
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                    });
                });
            }
        })
})

// 登陆
router.post('/login',(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    console.log(req)
    User.findOne({
        email,
    })
    .then(user=>{
        console.log(user)
        if(!user) res.json({status:202,msg:'该账号未注册'})
        else{
            bcrypt.compare(password, user.password).then(result=>{
                if(!result) res.json({status:400,msg:"账号与密码不匹配"})
                else{
                    const rules = {id :user.id, name:user.name}
                    // jwt.sign('规则','加密名字','过期时间','箭头函数')
                    jwt.sign(rules, keys.SecretOrkey, {expiresIn:3600},(err,token)=>{
                        if(err){
                            console.log(err)
                        }else{
                            res.json({status:200,success:true,token:"Bearer "+token})
                        }
                    })
                }
            })
        }
    })
})

// 验证token 正确性
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        status:200,
        msg:req.user
    })
})

module.exports = router