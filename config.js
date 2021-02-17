const PRODUCTION = process.env.NODE_ENV == 'production';

module.exports = {};

module.exports.PRODUCTION = PRODUCTION;
module.exports.shouldCompressImages = PRODUCTION;
