const https = require('https')
const http = require('http')
const btoa = require('btoa')
const cors = require('micro-cors')

module.exports = (config) => cors({ origin: config.domains })((req, res) => {
  const apiURL = config.apiURL
  const username = config.username || 'api'
  const key = process.env.MAILGUN_API_KEY || config.key
  if (!key) throw new Error('Unable to find key. Make sure MAILGUN_API_KEY is defined.')
  const urlConfig = {host: apiURL}
  let secure = true
  if (apiURL && typeof apiURL !== 'string') {
    urlConfig.host = apiURL.hostname
    urlConfig.port = apiURL.port
    secure = apiURL.scheme === 'https'
  }
  if (!urlConfig.host) urlConfig.host = 'api.mailgun.net'
  const mailgunReq = (secure ? https : http).request(Object.assign(urlConfig, {
    path: req.url,
    method: req.method,
    headers: Object.assign(req.headers, {
      'Authorization': 'Basic ' + btoa(username + ':' + key)
    }),
    rejectUnauthorized: false,
  }), r => r.pipe(res))
  return req.pipe(mailgunReq)
})