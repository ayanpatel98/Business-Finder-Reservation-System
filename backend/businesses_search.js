const express = require('express')
const axios = require('axios');
const router = express.Router()
const base_url = require('./main.js').base_url;
const HEADERS = require('./main.js').headers;


// Business Search Table
router.get('/', (req, res) => {
    
    // Payload
    let config = {
        headers:HEADERS,
        params:{
            'term': 'ice',
            'latitude': 34.003,
            'longitude': -118.2863,
            'categories': 'food',
            'radius': 1,
        }
    }

    business_obj = []

    axios.get(base_url+'businesses/search', config)
        .then(function (response) {
            console.log(response)

            response.data.businesses.forEach(element => {
                business_obj.push({
                    'id': element['id'],
                    'image_url': element['image_url'],
                    'name': element['name'],
                    'categories': element['categories'],
                    'rating': element['rating'],
                    'distance': element['distance']
                })
            });
            
            res.json(business_obj)
        })
        .catch(function (error) {
            console.log(error);
            res.send(error)
        })
})

module.exports = router