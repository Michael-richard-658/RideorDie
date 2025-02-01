const express = require("express")
const router = express.Router() 
const {connection,token_key} = require('../app')
const jwt  = require('jsonwebtoken')

router.get('/',(req,res)=>{
    const token = req.headers.authorization
    const user = jwt.verify(token,token_key)
    try {
        const query = `select username,password,experience,ridingpreference from users where user_id="${user.id}"`
        connection.query(query,function(error,result){
            if (error) throw error
            console.log(result)
            const infoPayload = {name:result[0].username,email:user.email,password:result[0].password,exp:result[0].experience,ridingpreference:result[0].ridingpreference}
            res.status(200).json(infoPayload)
        })
    } catch (error) {
        console.log(error)
    }
})  

router.put('/',(req,res)=>{
    const token = req.headers.authorization
    const user = jwt.verify(token,token_key)
   
    const newInfo = req.body
    
    try {
        const query = `update users set ? where user_id="${user.id}"`
        connection.query(query,newInfo,function(error,result){
            if (error) throw error
            res.status(200).json({success:true})
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports=router