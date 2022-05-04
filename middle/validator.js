
const forumSchema = require("../models/forumSchema")
const userSchema = require("../models/userSchema")

module.exports = {
    validateRegister: (req, res, next) => {
        const data = req.body
        // console.log(" nauji duomenys", req.body)
        if(data.username.length<3) return res.send({success: false, message: "name too short "})
        if(data.password !== data.passwordTwo) return res.send({success: false, message: "bad password"})
        if(data.password.length<3) return res.send({success: false, message: "password too short"})
        if(!data.photo.includes("http")) return res.send({success: false, message: "Photo link must includes http"})

        next()
    },
    validateTopic:(req,res, next)=>{
        const data =req.body
        if(data.title.length<5||data.title.length>40){
            res.send({success:false, message:"Title must be 5-40 symbols length"})
        }else {
            next()
        }

    },
    validatePost:(req,res, next)=>{
        const data=req.body
        //console.log("middleware ", data)
        if(data.text.length<10 || data.text.length>100){
            res.send({success:false,
                message:"Text must be 10-100 symbols length"
            })
        }else if(!data.photo.includes("http") && data.photo.length>0){
            res.send({success:false,
                message:"Picture link must include 'http'"
            })

        }else if(!data.youtubeUrl.includes("youtube") && data.youtubeUrl.length>0){
            res.send({success:false,
                message:"Youtube link must include 'youtube'"
            })
        }else{
            next()
        }
    },
    validatePhoto:(req, res, next) =>{
        const data= req.body
        console.log("validatorius",data)
        if(!data.photo.includes("http")){
            res.send({success:false, message:"User Photo must includes 'http'"})
        }else {
            next()
        }
    }


}