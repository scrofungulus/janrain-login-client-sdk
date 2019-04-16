# Janrian Login Client SDK

An SDK to interface with Janrain's Authorization API providing reasonable defaults.

## Configuration
```
const Janrain =  require('janrain-login-client-sdk');

const config = {
  url: 'https://YOUR_APP_NAME.janraincapture.com'
};

const defaults = {
  client_id: '1234567890',
  flow: 'standard',
  flow_version: '1234567890',
  locale: 'en-US',
  redirect_uri: 'http://localhost:3000',
}

const client = new Janrain(config, { defaults });
```

## Usage
```
async function register(firstName, lastName, email, password) {
  const attrs = {
    firstName,
    lastName,
  };

  return await client.register(email, password, attrs);
}
```
