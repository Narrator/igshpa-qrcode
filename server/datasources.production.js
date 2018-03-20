var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
  'mongodb://igshpa:igshpa123%24@ds127300.mlab.com:27300/igshpa-qrcode';

module.exports = {
  mongodb: {
    url: mongoUri,
    uri_decode_auth: true
  }
};
