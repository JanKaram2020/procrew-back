const { DateTime } = require('Luxon');
const tokenDuration = DateTime.now().plus({ months: 1 }).diff(DateTime.now(), ['days']);
console.log(tokenDuration.days);
