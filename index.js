const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/skeleton', (req, res) => res.redirect('/skeleton/admin'))
router.use('/skeleton/admin/static', express.static(path.join(__dirname, 'build', 'static')))
router.use('/skeleton/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// opts are not used, but may be necessary in the future
const createMiddleware = (opts) => router

module.exports = createMiddleware