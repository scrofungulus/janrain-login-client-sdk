const BaseClient = require('./base-client');

class AuthorizationClient extends BaseClient {
  constructor(config, options = {}) {
    const { url } = config;
    super(url, options);
    this.options = options;
    this.config = config;
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
   * @param {String} password - Password associated with the user's profile
   * @param {String} redirectUri - Optional redirect uri if not relying on default configuration of client
   */
  login(emailAddress, password, redirectUri = "") {
    const { redirect_uri: defaultRedirectUri } = this.config.defaults;
    if (redirectUri === "" && !defaultRedirectUri) {
      throw new Error("Must provide redirect_uri to client");
    }

    const redirect = redirectUri === "" ? defaultRedirectUri : redirectUri;

    const body = {
      ...this.config.defaults,
      redirect_uri: redirect,
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
