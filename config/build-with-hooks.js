const mag = require('../src/mag')
require('../src/hookins/mag.useState')
require('../src/hookins/mag.useEffect')
require('../src/hookins/mag.useContext')

mag.default.version = __VERSION__

module.exports = mag.default

