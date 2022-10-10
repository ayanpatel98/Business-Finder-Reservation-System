const express = require('express')
const axios = require('axios');
const router = express.Router()
const base_url = require('./main.js').base_url;
const HEADERS = require('./main.js').headers;

// Business Search Details
router.get('/', (req, res) => {
    res.send('Business Details!')
    
    // Payload
    let config = {
        headers:HEADERS
    }

    axios.get(base_url+`businesses/7XhSOz47twW5yGLTgTaREw`, config)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
})

module.exports = router