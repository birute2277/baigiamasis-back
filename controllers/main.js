const forumUser = require("../models/userSchema")
const forumTopic = require("../models/forumSchema")
// const forumNotification = require("../models/notificationShema")
const crypt = require("bcrypt")

module.exports = {
    register: async (req, res) => {
        const data = req.body
        // console.log(true)
        const userExists = await forumUser.findOne({username:data.username})
        if (userExists) return res.send({success: false, message: "name is taken"})

        const hash = await crypt.hash(data.password, 10)

        const user = new forumUser()
        user.username = data.username
        user.password = hash
        user.createTime = Date.now()
        user.photo = data.photo
        await user.save()
        res.send({success: true, message: "user register"})

    },
    login: async (req, res) => {
        const {username, password} = req.body
        // console.log(req.body)
        const userExists = await forumUser.findOne({username})
        // console.log("useris? ", userExists)
        if (!userExists) return res.send({success: false, message: "bad credentials"})

        const passMatch = await crypt.compare(password, userExists.password)
        // console.log(passMatch)
        if (passMatch) {
            req.session.user = userExists
            return res.send({success: true, userExists})
        }

        res.send({success: false, message: "bad credentials"})
    },
    // logout: (req, res) => {
    //     req.session.user = null
    //     res.send({success: true, message: "User logged out"})
    // },

    createTopic: async (req, res) => {
        const data = req.body
        // const {user} = req.session
        const user = req.session.user

        console.log("create something ",req.body , user)
        if(req.session.user) {
            const forum = new forumTopic()
            forum.username = req.session.user.username
            forum.title = data.title
            forum.time = Date.now()

            // const newTopic = await forum.save()            newTopic
            const newTopic = await forum.save()

            // return res.send({success: true, message: "Topic has been created successful", newTopic})
            return res.send({success: true, message: "Topic has been created successful", newTopic})
        }
        res.send({success: false, message: "You must logged"})
    },
    allTopicss: async (req, res) => {
        const {user} = req.session
        // console.log("Vartotojas ",user)
        let allTopics = await forumTopic.find()
        const allUsers = await forumUser.find()
        // console.log ("allusers name", allUsers[1].username, allTopics[0].username, allUsers[0].photo)

        // console.log(allUsers, "visi useriai")
        //
        // allTopics = allTopics.map(x => {
        //     allUsers.map(y =>
        //         x.username === y.username && console.log(y.photo, "nuotrauka")
        //     )
        // })
        //
        // // {
        // //     // _id: x._id,
        // //     // username: x.username,
        // //     // title: x.title,
        // //     // time: x.time,
        // //     // posts: x.posts,
        // //    //photo: allUsers.find(y=> y.username === x.username).photo
        // //     photo: allUsers.find(y=> y.username===allTopics[0].username).photo,
        // // }))
        allTopics.reverse()
        if(req.session.user){
            res.send({message:"all topics", allTopics, user})
        }else{
            res.send({message:"all topics without active user", allTopics})
        }
        // if(user) {
        //     const posts = await forumTopic.find({})
        //     return res.send({success: true, posts})
        // }
        //
        // res.send({success: false, posts: []})

    },
    singleTopic: async (req, res) => {
        const {user} = req.session
        const {id} = req.params
        // console.log(user, id)
        const singleTopic = await forumTopic.findOne({_id:id})


        if(user) {
            // const {id: _id} = req.params
            //
            // console.log(_id)
            //
            // const singleTopic = await forumTopic.findOne({_id:id})
            return res.send({success: true, message:"Single topic", singleTopic, user})
        }

        res.send({success: true, message: "Single topic without logged user", singleTopic})

    },
    createPost: async (req, res) => {
        const {id}= req.params
        const data = req.body
        // const {user} = req.session
        const user = req.session.user

        console.log("create something ",req.body , user)
        // if(req.session.user) {
        if(user) {
            const newPost={
                "name": user.username,
                "userPhoto": user.photo,
                "photo": data.photo,
                "youtubeUrl": data.youtubeUrl,
                "text": data.text,
                "time": Date.now()
            }
            // await newPost.save()
            //       newPost.reverse()
            await forumTopic.findOneAndUpdate({_id:id},{$push:{posts:newPost}})

            const oneTopic = await forumTopic.findOne({_id:id})
            // const notifications = new forumNotification()
            //     notifications.username= oneTopic.username,
            //     notifications.title= oneTopic.title,
            //     notifications.readStatus= false
            // const newNotifications = await notifications.save()

            return res.send({success: true, message: "Topic created successfully", oneTopic})
            // return res.send({success: true, message: "Topic has been created successful"})
        }
        res.send({success: false, message: "You must logged"})
    },
    // allPost: async (req, res) => {
    //     const {user} = req.session
    //     console.log("Vartotojas ",user)
    //     if(user) {
    //         const posts = await forumTopic.find({})
    //         return res.send({success: true, posts})
    //     }
    //
    //     res.send({success: false, posts: []})
    //
    // },
    // singlePost: async (req, res) => {
    //     const {user} = req.session
    //     const {id} = req.params
    //     console.log(user, id)
    //
    //     if(user) {
    //         const {id: _id} = req.params
    //
    //         console.log(_id)
    //
    //         const forum = await forumTopic.findOne({_id})
    //         return res.send({success: true, forum})
    //     }
    //
    //     res.send({success: false, message: id})
    //
    // }
    changeUserPhoto: async (req, res) => {
        const user = req.session.user
        const data = req.body
        console.log ("Avatar", user, data)
        if(req.session.user){
            await forumUser.findOneAndUpdate({_id:user._id},{photo:data.photo}, {new:true})
            res.send({success: true, message: "User Photo changed successfully"})
        } else{
            res.send({success: false, message: "Photo not yet replaced"})
        }

    },
    myAccount: async (req, res) => {
        const {user} = req.session
        if (user) {
            const posts = await forumTopic.find({username: user.username})
            return res.send({success: true, message: "", posts})
        }},

    // getNotifications: async (req, res) =>{
    //     const user =req.session.user
    // if(user){
    //     const activeNotifications = await forumNotification.find({"username": user.username, "readStatus": false})
    //     res.send({success: true, message: "get notifications", activeNotifications})
    // } else {
    //     res.send({success: false, message: "You must logged in, no any notifications"})
    // }
    // },
    // clearNotifications: async (req,res) =>{
    //     const user = req.session.user
    //     if(user){
    //
    //         const activeNotifications = await forumNotification.updateMany({username: user.username},{readStatus:true})
    //         res.send({success: true, message: "clear notifications", activeNotifications})
    //     } else {
    //         res.send({success: false, message: "You must logged in, no any notifications"})
    //     }
    // },
    logout: (req, res)=>{
        req.session.user=null
        res.send({success: true, message: "user logged out"})
    }

}