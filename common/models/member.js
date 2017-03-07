'use strict';
var qr = require('qr-image');
var Canvas = require('canvas');
var fs = require('fs');
var async = require('async');
var qrDir = 'qr-generated';
var badgeDir = 'badge-generated';
if (!fs.existsSync(badgeDir)){
  fs.mkdirSync(badgeDir);
}
if (!fs.existsSync(qrDir)){
  fs.mkdirSync(qrDir);
}

module.exports = function(Member) {
  Member.generateBadges = function (next) {
    Member.find({
      order: 'lastName ASC'
    }, function (err, members) {
      var memberCount = members.length;

      var asyncArray = [];
      for (var i = 0 ; i < memberCount; i += 6) {
        var j = i + 6;
        asyncArray.push(members.slice(i, j));
      }
      var pageCounter = 0;
      async.each(asyncArray, function (badgePage, callback) {
        pageCounter += 1;
        // Create canvas for each page
        var canvas = new Canvas(1600, 1800);
        var out = fs.createWriteStream(badgeDir + '/page' +
          pageCounter + '.png');
        var Image = Canvas.Image;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 1600, 1800);

        // feed in the logos
        fs.readFile('img/digin.png', function (err, digin) {
          if (err) {
            return callback(err);
          }
          var diginImg = new Image;
          diginImg.src = digin;
          fs.readFile('img/logo.png', function (err, logo) {
            if (err) {
              return callback(err);
            }
            var logoImg = new Image;
            logoImg.src = logo;
            //var stream = canvas.pngStream();

            var x = 20;
            var y = 20;
            // loop through each user
            var a = 1;
            async.each(badgePage, function (member, cb) {
              fs.readFile(qrDir + '/' +
                member.id + '.png', function(err, badge) {
                if (err) {
                  return cb(err);
                }
                var img = new Image;
                img.src = badge;
                if (a != 1 && a % 2 != 0) {
                  x = 20;
                  y += 600;
                } else if (a % 2 === 0) {
                  x += 800;
                }
                // Print the logo
                ctx.drawImage(logoImg, x, y,
                  logoImg.width/3, logoImg.height/3);
                ctx.drawImage(diginImg, x + 140, y - 35,
                  diginImg.width/3, diginImg.height/3);

                // Print the qr code
                ctx.drawImage(img, x + 10, y + 210, img.width/4, img.height/4);

                // Print the header
                ctx.fillStyle = '#000';
                ctx.font = 'bold 25px Arial';
                ctx.fillText('DENVER,CO | MARCH 14-16', x + 240, y + 150);

                // Print the nickname
                ctx.font = 'bold 55px Times New Roman';
                ctx.fillText(((member.nickName || member.firstName).
                  toUpperCase()).substring(0,13), x + 265, y + 260);

                // Print the Name
                ctx.font = 'bold 40px Times New Roman';
                ctx.fillText((member.firstName + ' ' + member.lastName).
                  substring(0,23), x + 265, y + 330);

                // Print the affiliation
                ctx.font = 'bold 30px Times New Roman';
                ctx.fillText((member.company || '').substring(0, 30),
                  x + 265, y + 380);

                // Print the city, state
                ctx.fillText(((member.city || '') + ', ' +
                  (member.state || '')).substring(0, 35), x + 265, y + 430);
                a += 1;
                cb();
              });
            }, function (err) {
              if (err) {
                return callback(err);
              }
              var stream = canvas.pngStream();
              stream.on('data', function(chunk){
                out.write(chunk);
              });
              callback();
            });
          });
        });

      }, function (err) {
        if (err) {
          return next(err);
        }
        next();
      });
    });
  };

  Member.remoteMethod('generateBadges', {
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/generateBadges',
      verb: 'get'
    },
    isStatic: true
  });

  Member.generateQRCodes = function (next) {
    Member.find(function (err, members) {
      if (err) {
        return next(err);
      }
      async.each(members, function (member, callback) {
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

        var memberQr = qr.image(memberString, { type: 'png', margin: 0,
          size: 10 });
        memberQr.pipe(fs.createWriteStream(qrDir + '/' +
          member.id + '.png'));
        callback();
      }, function (err) {
        if (err) {
          return next(err);
        }
        next();
      });
    });
  };
  Member.remoteMethod('generateQRCodes', {
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/generateQRCodes',
      verb: 'get'
    },
    isStatic: true
  });

  Member.prototype.generateBadge = function (next) {
    var member = this;
    fs.readFile('img/digin.png', function (err, digin) {
      var Image = Canvas.Image;
      var diginImg = new Image;
      diginImg.src = digin;
      fs.readFile('img/logo.png', function (err, logo) {
        var logoImg = new Image;
        logoImg.src = logo;
        fs.readFile('qr-generated/' + member.id + '.png', function(err, badge) {
          if (err) {
            return next(err);
          }
          var canvas = new Canvas(800, 600);
          var ctx = canvas.getContext('2d');
          var img = new Image;
          var stream = canvas.pngStream();
          var out = fs.createWriteStream(badgeDir + '/' + member.firstName
            + '-' + member.lastName + '.png');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 800, 600);

          // Print the logo
          ctx.drawImage(logoImg, 20, 20, logoImg.width/3, logoImg.height/3);
          ctx.drawImage(diginImg, 160, -15, diginImg.width/3,
            diginImg.height/3);

          // Print the qr code
          img.src = badge;
          ctx.drawImage(img, 30, 230, img.width/4, img.height/4);

          // Print the header
          ctx.fillStyle = '#000';
          ctx.font = 'bold 25px Arial';
          ctx.fillText('DENVER,CO | MARCH 14-16', 260, 170);

          // Print the nickname
          ctx.font = 'bold 55px Times New Roman';
          ctx.fillText(((member.nickName || member.firstName).toUpperCase()).
            substring(0,13), 285, 280);

          // Print the Name
          ctx.font = 'bold 40px Times New Roman';
          ctx.fillText((member.firstName + ' ' + member.lastName).
            substring(0,23), 285, 350);

          // Print the affiliation
          ctx.font = 'bold 30px Times New Roman';
          ctx.fillText((member.company || '').substring(0, 30), 285, 400);

          // Print the city, state
          ctx.fillText(((member.city || '') + ', ' + (member.state || '')).
            substring(0, 35), 285, 450);

          stream.on('data', function(chunk){
            out.write(chunk);
          });
          stream.on('end', function(){
            next();
          });
        });
      });
    });
  };
  Member.remoteMethod('generateBadge', {
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/generateBadge',
      verb: 'get'
    },
    isStatic: false
  });

  Member.prototype.generateQRCode = function (next) {
    var member = this;
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

    var memberQr = qr.image(memberString, { type: 'png', margin: 0, size: 10 });
    memberQr.pipe(fs.createWriteStream(qrDir + '/' +
      member.id + '.png'));
    next();
  };

  Member.remoteMethod('generateQRCode', {
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/generateQRCode',
      verb: 'get'
    },
    isStatic: false
  });
};
