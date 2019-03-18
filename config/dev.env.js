'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_PATH: '"/api"',
    HANDLE_PATH: '"/handle"',
    MGR_PATH: '"/mgr"',
    SEND_TRANSACTION_SWITCH: 'true'
})
