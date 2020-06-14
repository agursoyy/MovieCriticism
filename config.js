const { remote_api, local_api, api_key, image_url } = process.env;

module.exports = {
  publicRuntimeConfig: {
    pageConfig: {
      auth: false,
      footer: true,  // default values of header,footer,layout and auth configs.
      header: true,
      layout: true,
    },
    remote_api,
    local_api,
    api_key,
    image_url
  },
  serverRuntimeConfig: {},
};
