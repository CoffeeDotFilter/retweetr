const moment = require('moment');
module.exports = (rawdate) => {
  return moment(rawdate).format('MM do YYY');
}
