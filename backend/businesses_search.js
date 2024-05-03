const express = require('express')
const axios = require('axios');
const router = express.Router()
const base_url = require('./server.js').base_url;
const HEADERS = require('./server.js').headers;
const cors = require('cors');


// Business Search Table
router.get('/', cors(), (req, res) => {

    let config = {
        headers: HEADERS,
        params: {
            'term': req.query.term,
            'latitude': req.query.latitude,
            'longitude': req.query.longitude,
            'categories': req.query.categories,
            'radius': req.query.radius,
        }
    }

    business_obj = []

    axios.get(base_url + 'businesses/search', config)
        .then(function (response) {
            let i = 0;
            response.data.businesses.every(element => {
                if (i == 10) return false
                i++;
                business_obj.push({
                    'id': element['id'],
                    'image_url': element['image_url'],
                    'name': element['name'],
                    'categories': element['categories'],
                    'rating': element['rating'],
                    'distance': element['distance']
                })
                return true
            });

            res.json({ 'status': response.status, 'response': business_obj });
        })
        .catch(function (error) {
            res.json({ 'status': error.response.status, 'response': [] });
        })
})

module.exports = router