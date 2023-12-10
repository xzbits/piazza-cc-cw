const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req, res)=>{
    
    try{
    const {error} = registerValidation(req.body)

    // Validate 1: user input
    if (error){
        res.send(error)
        res.send({message: error['details'][0]['message']})
    }

    // Validate 2: To check user username is exist in user db
    const userExist = await User.findOne({email: req.body.email})
    if (userExist){
        return res.status(400).send({message:'User already exist!'})
    }

    // Create hash representation for password
    const salt = await bcryptjs.genSalt(5)
    const hashPassword = await bcryptjs.hash(req.body.password, salt)

    // Code to insert datas
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    })
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        // Validation 1: Check user input
        const { error } = loginValidation(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }

        // Validation 2: Check user existence
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' })
        }

        // Validation 3: Check user password
        const passwordValidation = await bcryptjs.compare(req.body.password, user.password)

        if (!passwordValidation) {
            return res.status(400).send({ message: 'Password is incorrect' })
        }

        // Generate an auth token
        const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send({ 'auth-token': token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})


module.exports=router
