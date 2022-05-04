const express = require('express')
const router = express.Router()
const middle = require("../middle/validator")


const {
    register,
    login,
    createTopic,
    allTopicss,
    singleTopic,
    createPost,
    myAccount,
    changeUserPhoto,
    // getNotifications,
    // clearNotifications,
    logout,
    // allPosts,


} = require("../controllers/main")
const {validatePost} = require("../middle/validator");


router.post("/register", middle.validateRegister, register)
router.post("/login", login)

router.post("/createTopic", middle.validateTopic, createTopic)
router.post("/createPost/:id", createPost)
router.get("/allTopics", allTopicss)
router.get("/singleTopic/:id", singleTopic)
router.get("/myAccount", myAccount)
router.post("/changeUserPhoto", middle.validatePhoto, changeUserPhoto)
// router.get("/getNotifications", getNotifications)
// router.get("/clearNotifications", clearNotifications)
router.get("/logout", logout)

// router.get("/allPosts", allPosts)



module.exports = router