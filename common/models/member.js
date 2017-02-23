'use strict';
var qr = require('qr-image');
var fs = require('fs');

module.exports = function(Member) {
  Member.prototype.generateQRCode = function (next) {
    var member = this;
    var dir = 'qr-generated';
    // Check if igshpa code exists
    var memberString =  '{' +
      '"nickName": "' + (member.nickName || '') + '",' +
      '"firstName": "' + (member.firstName || '') + '",' +
      '"lastName": "' + (member.lastName || '') + '",' +
      '"initial": "' + (member.initial || '') + '",' +
      '"prefix": "' + (member.prefix || '') + '",' +
      '"suffix": "' + (member.suffix || '') + '",' +
      '"title": "' + (member.title || '') + '",' +
      '"company": "' + (member.company || '') + '",' +
      '"address": "' + (member.address || '') + '",' +
      '"city": "' + (member.city || '') + '",' +
      '"state": "' + (member.state || '') + '",' +
      '"zip": "' + (member.zip || '') + '",' +
      '"country": "' + (member.country || '') + '",' +
      '"phone1": "' + (member.phone1 || '') + '",' +
      '"phone2": "' + (member.phone2 || '') + '",' +
      '"fax": "' + (member.fax || '') + '",' +
      '"email": "' + (member.email || '') + '",' +
      '"website": "' + (member.website || '') + '",' +
      '"attendeeType": "' + '2017 IGSHPA Conference - ' +
          (member.attendeeType || '') + '"' +
    '}';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    var memberQr = qr.image(memberString, { type: 'png' });
    memberQr.pipe(fs.createWriteStream(dir + '/' + member.id + '.png'));
    next(null, {});
  };
  Member.remoteMethod('generateQRCode', {
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/generate',
      verb: 'get'
    },
    isStatic: false
  });
};
