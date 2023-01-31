const CORS_ALLOWED_ORGIN_LIST = ['http://example1.com', 'http://example2.com']

const config = {
  NODE_ENV: process.env.NODE_ENV,
  API: process.env.NEXT_PUBLIC_API,

  FIO_APPLICATION_PUBLIC_ID: process.env.NEXT_PUBLIC_FIO_APPLICATION_PUBLIC_ID,

  CORS_ALLOWED_ORGIN: process.env.NODE_ENV === "development" ? "*" : CORS_ALLOWED_ORGIN_LIST,
};

module.exports = config;