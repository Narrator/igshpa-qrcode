module.exports = function(app) {
  var User = app.models.member;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  RoleMapping.settings.strictObjectIDCoercion = true;

  User.findOrCreate({
    where: {
      username: 'igshpaAdmin'
    }
  }, {
    username: 'igshpaAdmin',
    email: 'admin@igshpa.org',
    password: 'igshpa123$',
    nickName: 'kaushik',
    firstName: 'Kaushik',
    lastName: 'Gnanaskandan',
    initial: 'S',
    prefix: 'Dr',
    suffix: 'Jr',
    title: 'Software Developer',
    company: 'International Ground Source Heat Pump Association',
    address: '315 S Hester St, Apt 317',
    city: 'Stillwater',
    state: 'OK',
    zip: '74074',
    country: 'United States',
    phone1: '4057803834',
    phone2: '4057803834,100',
    website: 'www.igshpa.org',
    attendeeType: 'Exhibitor'
  }, function(err, user) {
    if (err) throw err;

    //create the admin role
    Role.findOrCreate({
      where: {
        name: 'admin'
      }
    }, {
      name: 'admin',
      created: new Date(),
      modified: new Date()
    }, function(err, role) {
      if (err) throw err;

      RoleMapping.findOne({
        where: {
          principalType: RoleMapping.USER,
          principalId: user.id.toString()
        }
      }, function (err, principal) {
        if (err) throw err;

        if (!principal) {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id.toString()
          }, function(err, principal) {
            if (err) throw err;
          });
        }
      });

    });
  });
};
