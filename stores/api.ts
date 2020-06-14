import Axios from 'axios';
import Store from '.';
import queryString from 'query-string';
import getConfig from 'next/config';

type IParams = {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete',
  form?: {
    [x: string]: any
  };
  auth?: boolean;
  remote?: boolean
}
const { publicRuntimeConfig: {
  remote_api,
  local_api
} } = getConfig();

export default class Api {
  private remote_api = remote_api;
  //private local_api;
  public accessToken?: string;
  public refreshToken?: string;

  constructor(private store: Store) {
    this.store;
  }

  public fetch = ({
    url,
    method = 'get',
    form,
    auth = true,
    remote = true
  }: IParams, expected?: number): Promise<any> => { // expected http response status code

    let apiurl: string;
    if (remote) {
      apiurl = `${remote_api}${url}`;
    } else {
      apiurl = `${local_api}${url}`;
    }
    const config = {
      data: {},
      headers: {},
      method,
      url: apiurl,
    };
    if (auth) {
      config.headers = {
        ...config.headers,
        'x-access-token': `${this.accessToken}`,
      };
    }
    if (form && Object.keys(form).length > 0) {
      if (method === 'get') {
        const queryParams = queryString.stringify(form, { arrayFormat: 'bracket' });
        config.url = `${config.url}?${queryParams}`;
      }
      else {
        config.data = { ...form };
      }
    }

    if (config.method === 'get') {   // redundant data leads the api to create an error.
      delete config.data;
    }
    return Axios(config).then(({ data, status }) => {
      return expected ? (expected === status ? data : null) : { data, status }; // successful response(200), only data is sent from api.
    }).catch(err => {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          // if(this.refreshToken ) {} // auth not implemented yet.
        }
        return { data, status };   // failed response, data and status code is sent together.
      }
    });
  }



}