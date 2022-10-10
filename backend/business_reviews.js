const express = require('express')
const axios = require('axios');
const { response } = require('express');
const router = express.Router()
const base_url = require('./main.js').base_url;
const HEADERS = require('./main.js').headers;


// Reviews Route
router.get('/', (req, res) => {
    res.send('Business Reviews!')
    
    // Payload
    let config = {
        headers:HEADERS
    }

    axios.get(base_url+`businesses/7XhSOz47twW5yGLTgTaREw/reviews`, config)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
})

module.exports = router