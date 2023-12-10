const express = require('express')

const Post = require('../models/Post')
const auth = require('../utils/verifyToken')

const router = express.Router()

router.post('/', auth, async(req, res) => {
    try {
      const { topic } = req.params

      // Update the status of posts whose expiration time has passed
      await Post.updateMany(
          { topics: topic, expirationTime: { $lt: new Date() }, status: 'Live' },
          { $set: { status: 'Expired' } }
      )

      // Get all expired posts
      const expiredPosts = await Post.find({ topics: topic, status: 'Expired' })

      res.status(200).json({ expiredPosts })
  } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
