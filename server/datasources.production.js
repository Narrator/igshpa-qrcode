var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
  'mongodb://';
module.exports = {
  mongodb: {
    url: mongoUri,
    uri_decode_auth: true
  }
};
