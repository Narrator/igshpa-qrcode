'use strict';
var qr = require('qr-image');
var Canvas = require('canvas');
var fs = require('fs');
var async = require('async');
var badgeDir = 'badge-generated';

if (!fs.existsSync(badgeDir)){
  fs.mkdirSync(badgeDir);
}

fs.readFile('img/digin.png', function (err, digin) {
  var Image = Canvas.Image;
  var diginImg = new Image;
  diginImg.src = digin;
fs.readFile('img/logo.png', function (err, logo) {
  var logoImg = new Image;
  logoImg.src = logo;
  fs.readFile('qr-generated/1.png', function(err, badge) {
    if (err) throw err;
    var canvas = new Canvas(800, 600);
    var ctx = canvas.getContext('2d');
    var img = new Image;
    var stream = canvas.pngStream();
    var out = fs.createWriteStream(badgeDir + '/badge.png');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 800, 600);

    // Print the logo
    ctx.drawImage(logoImg, 20, 20, logoImg.width/3, logoImg.height/3);
    ctx.drawImage(diginImg, 160, -15, diginImg.width/3, diginImg.height/3);

    // Print the qr code
    img.src = badge;
    ctx.drawImage(img, 30, 230, img.width/2, img.height/2);

    // Print the header
    ctx.fillStyle = "#000";
    ctx.font = 'bold 25px Arial';
    //ctx.fillText("TECHNICAL CONFERENCE & EXPO", 145, 70);
    ctx.fillText("DENVER,CO | MARCH 14-16", 260, 170);

    // Print the nickname
    ctx.font = 'bold 55px Times New Roman';
    ctx.fillText("KAUSHIK", 285, 280);

    // Print the Name
    ctx.font = 'bold 40px Times New Roman';
    ctx.fillText("Kaushik Gnanaskandan", 285, 350);

    // Print the affiliation
    ctx.font = 'bold 30px Times New Roman';
    ctx.fillText("Oklahoma State University, IGSHPA", 285, 400);

    // Print the city, state
    ctx.fillText("Stillwater, OK", 285, 450);

    // Print the attendee type
    //ctx.font = 'bold 60px Times New Roman';
    //ctx.textAlign = 'center';
    //ctx.fillText("EXHIBITOR", 400, 550);

    //var te = ctx.measureText('Awesome!');
    //ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    //ctx.beginPath();
    //ctx.lineTo(50, 102);
    //ctx.lineTo(50 + te.width, 102);
    //ctx.stroke();
    stream.on('data', function(chunk){
      out.write(chunk);
    });

    stream.on('end', function(){
      console.log('saved png');
    });
  });
});
});

module.exports = function(Member) {
  Member.prototype.generateQRCode = function (next) {
    var member = this;
    var qrDir = 'qr-generated';
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
    if (!fs.existsSync(qrDir)){
      fs.mkdirSync(qrDir);
    }

    var memberQr = qr.image(memberString, { type: 'png' });
    memberQr.pipe(fs.createWriteStream(qrDir + '/' + member.id + '.png'));
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
