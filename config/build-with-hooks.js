const mag = require('../src/mag')
require('../src/hookins/mag.useState')
require('../src/hookins/mag.useEffect')

mag.default.version = __VERSION__

module.exports = mag.default

