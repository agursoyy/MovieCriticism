import nookies from 'nookies';

import Store from '.';

interface ILoginForm {
  email: string,
  password: string
}

interface ISignupForm {
  username: string
  email: string,
  password: string
}

export default class Auth {
  private url = '/users';
  public loading = '/false';

  constructor(private store: Store) { }
  public login = async ({ email, password }: ILoginForm) => {
    const url = `${this.url}/login`;
    const method = 'post';
    const auth = false;
    const remote = false;
    const form = {
      email,
      password,
    };
    const response = await this.store.api.fetch({ url, method, auth, form, remote }, 200);
    const { status } = response;
    if (status && status === 400) { // failed response, data and status code is sent together.
      const { data } = response;
      return { auth: false, errors: data };
    }
    else { // successful response(200), only data is sent from api.
      const { token } = response;
      this.store.api.accessToken = token;
      const user = await this.store.user.getCurrent();

      if (user) {
        nookies.set(null, 'accessToken', token, false);
        return { auth: true };
      }
      else {
        return { auth: false };
      }

    }

  };
  public logout = () => {
    this.store.api.accessToken = undefined;
    this.store.api.refreshToken = undefined;
    this.store.user.user = false;

    nookies.destroy(null, 'accessToken', false);
    nookies.destroy(null, 'refreshToken', false);
  }
  public signup = async ({ username, email, password }: ISignupForm) => {
    const url = `${this.url}/signup`;
    const method = 'post';
    const auth = false;
    const remote = false;
    const form = {
      username,
      email,
      password,
    };
    const response = await this.store.api.fetch({ url, method, auth, form, remote }, 201);
    const { status } = response;
    if (status && status === 400) { // failed response, data and status code is sent together.
      const { data } = response;
      return { signup_success: false, errors: data };
    }
    else { // successful response(200), only data is sent from api.
      return { signup_success: true, msg: 'confirmation mail has been sent to your mail account, please confirm it to sign in' };
    }
  };

  public updateToken = async (): Promise<boolean> => {
    const url = `${this.url}/refresh-token`;
    const method = 'post';
    const auth = false;

    const { accessToken: expiredToken, refreshToken } = this.store.api;

    const form = {
      expiredToken,
      refreshToken,
    };

    const response = await this.store.api.fetch({ url, method, auth, form }, 200);

    if (response) {
      ({
        accessToken: this.store.api.accessToken,
        refreshToken: this.store.api.refreshToken,
      } = response);

      if (typeof window !== 'undefined') {
        nookies.set(null, 'accessToken', response.accessToken, false);
        nookies.set(null, 'refreshToken', response.refreshToken, false);
      }

      return true;
    }

    return false;
  };
}
