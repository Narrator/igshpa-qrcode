'use strict';
var qr = require('qr-image');

module.exports = function(Member) {
  Member.prototype.generateQRCode = function (next) {
    var member = this;
    // Check if igshpa code exists
    var memberString = member.firstName + ' ' +
      member.lastName;
    var memberQr = qr.image(memberString, { type: 'png' });
    memberQr.pipe(require('fs')
      .createWriteStream('generated/' + member.id + '.png'));
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
