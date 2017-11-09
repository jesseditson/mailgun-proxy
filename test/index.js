const micro = require('micro')
const url = require('url')
const {send} = micro
const proxy = require('../proxy')

const test = require('ava')
const listen = require('test-listen')

const mailgun = require('mailgun.js')

test(async t => {
  const mailgunURL = await listen(micro((req, res) => {
    send(res, 200, {headers: req.headers, body: req.body})
  }))
  const sURL = await listen(micro(proxy({
    apiURL: url.parse(mailgunURL)
  })))
  const mg = mailgun.client({url: sURL, username: 'api', key: 'intentionally-left-blank'})
  const res = await mg.messages.create('fake.mailgun.org', {
    from: "Excited User <mailgun@sandbox-123.mailgun.org>",
    to: ["test@example.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
    html: "<h1>Testing some Mailgun awesomness!</h1>"
  })
  let json
  try {
    json = JSON.parse(res)
  } catch (e) {
    t.fail('Inavlid response')
  }
  t.is(json.headers.authorization, 'Basic YXBpOnRlc3Q=')
  const boundaryRegExp = /multipart\/form-data; boundary=-+\d+/
  t.true(boundaryRegExp.test(json.headers['content-type']))
  const u = url.parse(sURL)
  t.is(json.headers.host, u.host)
})