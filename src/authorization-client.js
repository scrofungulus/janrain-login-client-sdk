const BaseClient = require('./base-client');

class AuthorizationClient extends BaseClient {
  constructor({ url }, options = {}) {
    super(url, options);
    this.options = options;
  }

  /**
   * Registers a user in Janrain along with any
   * specified attributes
   *
   * @param {String} emailAddress - Email address to register a user for
   * @param {String} password -Password password associated with the user's profile
   * @param {Object} attrs - Any additional attributes to for a users profile e.g. phone number, birthdate, etc.
   */
  register(emailAddress, password, attrs = {}) {
    const body = {
      ...this.config.defaults,
      ...attrs,
      emailAddress,
      displayName: emailAddress,
      newPassword: password,
      newPasswordConfirm: password,
    };

    // These are defaults that Janrain will also fallback to but I
    // still prefer to be explicit here
    if (!body.response_type) body.response_type = 'token';
    if (!body.form) body.form = 'registrationForm';

    return this.post('/oauth/register_native_traditional', body);
  }

  /**
   * Login a user in Janrain
   * @param {String} emailAddress - Email address to register a user for
   * @param {String} password -Password password associated with the user's profile
   */
  login(emailAddress, password) {
    const body = {
      ...this.config.defaults,
      signInEmailAddress: emailAddress,
      currentPassword: password,
    };

    // These are defaults that Janrain will also fallback to but I
    // still prefer to be explicit here
    if (!body.response_type) body.response_type = 'token';
    if (!body.form) body.form = 'signInForm';

    return this.post('/oauth/auth_native_traditional', body);
  }

  /**
   * Update a user in Janrain
   * @param {Object} Properties and the values to update them to
   * @param {String} Optional access token
   * */
  updateProfile(attrs, token) {
    const body = {
      ...this.config.defaults,
      ...attrs,
      form: 'editProfileForm',
    };

    body.token = token ? token : this.options.accessToken;

    return this.post('/oauth/update_profile_native', body);
  }
}

module.exports = AuthorizationClient;
