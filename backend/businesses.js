const express = require('express')
const axios = require('axios');
const router = express.Router()
const base_url = require('./main.js').base_url;
const HEADERS = require('./main.js').headers;

// Business Search Details
router.get('/', (req, res) => {
    // Payload
    let config = {
        headers:HEADERS
    }

    let business_details_data = []
    axios.get(base_url+`businesses/7XhSOz47twW5yGLTgTaREw`, config)
        .then(function (response) {
            console.log(response.data);
            business_details_data.push(
                {
                    'id': response.data['id'],
                    'name': response.data['name'],
                    'is_closed': response.data['is_closed'],
                    'is_open_now': ('hours' in response.data) ? response.data['hours'][0]['is_open_now'] : 'noStatus',
                    'transactions': response.data['transactions'],
                    'categories': response.data['categories'],
                    'display_address': response.data['location']['display_address'],
                    'display_phone': response.data['display_phone'],
                    'price': ('price' in response.data) ? response.data['price'] : '',
                    'more_info': response.data['url'],
                    'photos': response.data['photos'],
                }
            );
            res.json({'status' : response.status, 'response' : business_details_data});
        })
        .catch(function (error) {
            console.log(error);
            res.json({'status':error.response.status, 'response' : []});
        })
})

module.exports = router