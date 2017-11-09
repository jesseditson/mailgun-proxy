# mailgun-proxy
A server for proxying requests to mailgun (while overlaying private keys)
Intended to be deployed via [now](https://zeit.co/now)
---

# Usage:

---

clone this repo and install dependencies

```
npm i -g now
git clone git@github.com:jesseditson/mailgun-proxy.git
cd mailgun-proxy
npm i
```

copy the config and add your valid domains:

```
mv config-example.js config.js
vi config.js
```

add your mailgun secret and any valid domains to now

```
now secret add mailgun-key "your-mailgun-key"
```

start your proxy!

```
now
```

The URL will now be copied to your clipboard. When using [mailgun.js](https://github.com/mailgun/mailgun-js), your config will be:

```
{
  username: 'fake',
  key: 'fake',
  url: 'https://your-deployment-url.now.sh'
}
```

You can now use mailgun.js with fake credentials, which will be replaced when proxied through this server with your private key. If you want to use a username other than `api`, add it to `config.js` under the `username` key.

*bonus*: alias to your domain

```
now alias my-deployment-url mail.mydomain.com
```