const pkg = require('./dist');
const { superclass, mixin } = pkg;
module.exports = pkg;
module.exports.superclass = superclass;
module.exports.mixin = mixin;
