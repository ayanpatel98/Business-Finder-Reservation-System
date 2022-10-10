const express = require('express')
const axios = require('axios');
const { response } = require('express');
const router = express.Router()
const base_url = require('./main.js').base_url;
const HEADERS = require('./main.js').headers;

// const base_url = 'https://api.yelp.com/v3/'
// const api_key = 'uQGYSvwIBI7fLrs1DQFuL85V1ZPNBiwSLSlsSucGmAe319_tqpUs-FeyRFGJ6WudJ_EFx-gWLKCvdYWONxicky4gm7K93LhK1GT6U3P5GZXXJZzCIEq593EZPQsdY3Yx'
// const HEADERS = {'Authorization': 'bearer ' + api_key}


// Autocomplete Route
router.get('/', (req, res) => {
    // res.send('Autocomplete!')
    
    // Payload
    let config = {
        headers:HEADERS,
        params:{
            'text': 'ice'
        }
    }

    let auto_list = []

    axios.get(base_url+`autocomplete`, config)
        .then(function (response) {
            auto_list = response['data']['categories']
            // console.log(response.status);
            res.json(auto_list);
        })
        .catch(function (error) {
            // #Send Error Status
            res.json({status:error.response.status})
        });
})

module.exports = router