# Janrain Login Client SDK

An SDK to interface with Janrain's Authorization API providing reasonable defaults.

## Configuration
```javascript
const Janrain =  require('janrain-login-client-sdk');

const defaults = {
  client_id: '1234567890',
  flow: 'standard',
  flow_version: '1234567890',
  locale: 'en-US',
  redirect_uri: 'http://localhost:3000',
}

const config = {
  url: 'https://YOUR_APP_NAME.janraincapture.com',
  defaults,
};

const options = {
  timeout: 5000,
};

const client = new Janrain(config, options);
```

## Usage
```javascript
async function register(firstName, lastName, email, password) {
  const attrs = {
    firstName,
    lastName,
  };

  return await client.register(email, password, attrs);
}
```

Note: Any specified attributes (`attrs`) will override any default configuration.

**Example**

Let's assume defaults for your login client were configured like the following:
```javascript
const defaults = {
  client_id: '1234567890',
  flow: 'standard',
  flow_version: '1234567890',
  locale: 'en-US',
  redirect_uri: 'https://domain.com',
}
```

If for some reason you wanted to change the redirect uri you could do this:

```javascript
async function register(firstName, lastName, email, password, redirectUri) {
  const attrs = {
    firstName,
    lastName,
    redirect_uri: redirectUri, // updates previously configured redirect uri
  }

  return await client.register(email, password, attrs);
}
```

## API

The provided functions return Axios' default HTTP response. This allows for flexibility in handling errors
how you please. You can see an example below.

### Register

Creates new user entity in Janrain
```javascript
client.register(emailAddress, password, attrs = {})
```

### Login

Get access token for existing entity. Redirect URI must match previously provided value. If you're configuring it to a default value, you can ignore this.
```javascript
client.login(emailAddress, password, redirectUri = "")
```

### Update Profile

Updates user profile associated with access token
```javascript
client.updateProfile(attrs, token)
```

**Is something not working? See something that isn't yet supported?**

Please open an issue in Github or submit a pull request :)

**Example**

This code sample is used to work around Janrain rate limiting.
```javascript
const promiseRetry = require('promise-retry');

const client = new Janrain(config, options);

const register = (user) => {
  const { firstName, lastName, email, password, phone } = user;

  return new Promise((resolve, reject) => {
    client.register(email, password, { firstName, lastName, phone }).then((resp) => {
      const { stat: status, error } = resp.data;

      if (status === 'error' && error === 'invalid_form_fields') {
        // For our use case let's assume this error an attempt to create
        // an account that exists. Do not reject here.
        console.log(`Account with email ${ email } already exists.`);
      } else if (status === 'error') {
        // Reject and retry.
        reject(`Error: ${resp.data.error} Reason: ${resp.data.error_description}`);
      }

      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
};

module.exports.registerWithRetry = (user) => {
  return promiseRetry(function (retry, number) {
    console.log(`Attempt: ${ number }`)
    return register(user).catch((err) => {
      console.log(err);
      retry();
    });
  }, { retries: 100, minTimeout: 60000 });
}
```
