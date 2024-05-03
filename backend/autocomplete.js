const express = require('express')
const axios = require('axios');
const { response } = require('express');
const router = express.Router()
const base_url = require('./server.js').base_url;
const HEADERS = require('./server.js').headers;
const cors = require('cors');

// Autocomplete Route
router.get('/', cors(), (req, res) => {
    // Payload
    let config = {
        headers: HEADERS,
        params: {
            'text': req.query.text
        }
    }

    let auto_list = []
    axios.get(base_url + `autocomplete`, config)
        .then(function (response) {
            response['data']['terms'].forEach(element => {
                auto_list.push(element);
            });
            response['data']['categories'].forEach(element => {
                auto_list.push(
                    {
                        'text': element['title']
                    }
                );
            });
            res.json({ 'status': response.status, 'response': auto_list });
        })
        .catch(function (error) {
            // #Send Error Status
            res.json({ 'status': error.response.status, 'response': [] });
        });
})

module.exports = router