const moment = require('moment');
module.exports = (rawdate) => {
  var date = new Date(rawdate).getTime();
  return moment.utc(date).format('MMM do YY');
};
