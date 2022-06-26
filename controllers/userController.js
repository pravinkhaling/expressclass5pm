const User = require('../models/userModel')
const sendEmail = require('../utils/sendEmail')
const Token = require("../models/tokenModel")
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')
const res = require('express/lib/response')


//to add new user
exports.addUser = async (req, res) => {
    let newuser = new User({
        username: req.body.email,
        email: req.body.email,
        password: req.body.password
    })

    // check if email already exists or not
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ error: "Email already exists. Please choose different email" })
    }
    else {
        //generate token and send email and register
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: newuser._id
        })
        token = await token.save()
        //confirmation_link =`http://localhost:5000/api/confirmuser/${token.token}`
        confirmation_link = `${process.env.FRONT_END_URL}/confirmuser/${token.token}`




        if (!token) {
            return res.status(400).json({ error: "failed to save token, please try again" })
        }
        else {
            sendEmail({
                from: "noreply@ourstore.com",
                to: newuser.email,
                subject: "Verification Email",
                text: "Please click on the folowing link to verify your email",

                html: `<a href='${confirmation_link}'><button>Verify Account</button></a>`
            })
            newuser = await newuser.save()
            if (!newuser) {
                return res.status(400).json({ error: "Failed to create account, Please try again" })
            }
            else {
                return res.status(200).json({ message: "Congratulations. New User created. Please verify your email address to continue" })

            }
        }
    }
}

exports.confirmUser = async (req, res) => {
    //check if token is valid or not
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }

    //check if user exists or not
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User associated with token was not found." })
    }

    //check if user is already verified or not
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Please login to continue" })
    }

    //if not verified, verify and save user
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "failed to verify. Please try again later" })
    }
    res.status(200).json({ message: "User verified successfully. Login to continue." })
}

exports.resendConfirmation = async (req, res) => {
    //check if user is registered or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "email not registered. Please register." })
    }
    //if user exist, check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "user already verified, login to continue" })
    }
    //if user is not verified, send verification email
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }


    confirmation_link = `http://localhost:5000/api/confirmuser/${token.token}`

    let email = sendEmail({
        from: "noreply@ourstore.com",
        to: user.email,
        subject: "Verification Email",
        text: "Please click on the folowing link to verify your email",

        html: `<a href='${confirmation_link}'><button>Verify Account</button></a>`
    })
    if (email) {
        res.status(200).json({ message: "verification link has been sent to your email." })
    }
    else {
        res.status(400).json({ error: "something went wrong" })
    }
}


//forget password
exports.forgetpassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email does not exist. Please register" })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })

    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }


    // password_reset_link = `http://localhost:5000/api/resetpassword/${token.token}`
    password_reset_link = `${process.env.FRONT_END_URL}/resetpassword/${token.token}`

    sendEmail({
        from: "noreply@ourstore.com",
        to: user.email,
        subject: "Password Reset Link",
        text: `Please click on the folowing link to reset your password. ${password_reset_link}`,
        html: `<a href ='${password_reset_link}'><button> reset password</button></a>`
    })
    res.status(200).json({ message: "password reset link has been sent to your email." })


    }

    exports.resendConfirmation = async (req, res) => {
        //check if user is registered or not
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ error: "email not registered. Please register." })
        }
        //if user exist, check if already verified
        if (user.isVerified) {
            return res.status(400).json({ error: "user already verified, login to continue" })
        }
        //if user is not verified, send verification email
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        token = await token.save()
        if (!token) {
            return res.status(400).json({ error: "something went wrong" })
        }
        //confirmation_link =`http://localhost:5000/api/confirmuser/${token.token}`
        confirmation_link = `${process.env.FRONT_END_URL}/confirmuser/${token.token}`


    }

    //to reset password
     exports    .resetPassword = async(req,res)=>{
         //check if token is valid or not
         let token = await Token.findOne({token: req.params.token})
         if(!token){
             return res.status(400).json({error:"Invalid token or token may  have  expired."})
         }
         //check if user exists or  not
         let user = await User.findById(token.user)
         if(!user){
             return res.status(400).json({error:"User associated with token was not found."})
         }
         //change password and save user 
         user.password= req.body.password
         user = await user.save()
         if(!user){
             return res.status(400).json({error:"something went wrong"})
         }
         res.status(200).json({message:"Password reset successful"})
     }
     //to display list of users
     exports.userlist = async (req, res)=>{
         let user = await User.find().select("-hashed_password")
         if(!user){
             return res.status(400).json({error:"Something went wrong"})
         }
         
     }


    //to confirm user



    //forget password
    exports.forgetpassword = async (req, res) => {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ error: "Email does not exist. Please register" })
        }
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        token = await token.save()
        password_reset_link = `http://localhost:5000/api/resetpassword/${token.token}`




        if (!token) {
            return res.status(400).json({ error: "failed to save token, please try again" })
        }
        else {
            sendEmail({
                from: "noreply@ourstore.com",
                to: user.email,
                subject: "Password Reset Link",
                text: "Please click on the folowing link to verify your email",

                html: `<a href='${password_reset_link}'><button>Verify Account</button></a>`
            })


            return res.status(200).json({ message: "Reset link has been sent to your email" })


        }
    }

    exports.resetPassword = async (req, res) => {
        //check if token is valid or not
        let token = await Token.findOne({ token: req.params.token })
        if (!token) {
            return res.status(400).json({ error: "Invalid token or token may have expired" })
        }

        //check if user exists or not
        let user = await User.findById(token.user)
        if (!user) {
            return res.status(400).json({ error: "User associated with token was not found." })
        }

        //change password and save user
        user.password = req.body.password
        user = await user.save()
        if (!user) {
            return res.status(400).json({ error: "something went wrong" })
        }
        res.status(200).json({ message: "password reset successfully" })
    }

    //to display list of users
    exports.userlist = async (req, res) => {
        let user = await User.find().select("-hashed_password")
        if (!user) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(user)
    }

    //to get user details
    exports.userDetails = async (req, res) => {
        let user = await User.findById(req.params.user_id).select("-hashed_password")
        if (!user) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(user)

    }

    //to update user information
    exports.updateUser = async (req, res) => {
        let user = await User.findByIdAndUpdate(
            req.params.user_id,
            {
                username: req.body.email,
                email: req.body.email,
                password: req.body.password
            },
            { new: true }
        )
        if (!user) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(user)
    }

    //to delete user
    exports.deleteUser = (req, res) => {
        User.findByIdAndRemove(req.params.userid)
            .then(user => {
                if (!user) {
                    return res.status(400).json(
                        { error: "User not found." }
                    )
                }
                else {
                    return res.status(200).json(
                        { message: "User deleted succcessfully" })
                }
            })
            .catch(err => res.status(400).json({ error: err }))
    }


    //for sign in
    exports.signin = async (req, res) => {
        const { email, password } = req.body
        //check email if valid or not
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "User not registered" })
        }
        //check if password is correct or not
        if (!user.authenticate(password)) {
            return res.status(400).json({ error: "User and password do not match." })
        }
        //check if user is verified or not
        if (!user.isVerified) {
            return res.status(400).json({ error: `User not verified. Please verify to continue`                 
            } )
        }
        //if verified, generate login token and save it in cookie
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET)

        res.cookie('myCookies', token, { expire: Date.now() + 86400 })

        //return user information to the frontend

        const { username, _id, role } = user
        return res.json({ token, user: { _id, role, username, email } })
    }

    //signout

    exports.signout = async (req, res) => {
        res.clearCookie('myCookies')
        return res.status(200).json({ message: "user loggedd out successfully" })

    }

    //for authorization
    exports.requireSignin =
        expressjwt({
            secret: process.env.JWT_SECRET,
            algorithms: ["HS256"],
            //algorithms: ['RS256']
        });