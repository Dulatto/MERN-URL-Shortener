const {Router, response} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('register', 
   [
       check('email', 'Email is incorrect').isEmail(),
       check('password', 'Minimum of 6 symbols is required')
       .isLength({min:6})
   ],
  async (req, res) =>{
try {
    const errors = validationResult(req)

    if(errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
            message: 'Data is incorrect'
        })
    }
    const {email, password}= req.body

    const candidate = await User.findOne({email})
    if (candidate){
      return  res.status(400).json({message:'This user is already existed'})
    }

     const hashedPassword = await bcrypt.hash(password, 12)
     const user = new User({email, password: hashedPassword})

     await user.save()

     res.status(201).json({ message: 'User was created'})
    
} catch (e) {
    res.status(500).json({message:'Something are getting wrong, try again'})
}
})

// /api/auth/login
router.post('login',
[
 check('email', 'Enter the correct email'), normalizeEmail().isEmail(),
 check('password', 'Enter the password').exists()
],
 async (req, res) =>{
    try {
        const errors = validationResult(req)
    
        if(errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message: 'Data is incorrect during the enter in system'
            })
        }
       
        const{email, password} = req.body

        const user = await User.findOne({ email})

        if(!user){
            return res.status(400).json({message: 'User was not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400),json({message:'Invalid password, try again'})
        }

    const token = jwt.sign(
        { userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
    )

    res.json({ token, userId: user.id})
        
    } catch (e) {
        res.status(500).json({message:'Something are getting wrong, try again'})
    }
})

module.exports = router