module.exports = function(app) {
  var User = app.models.member;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([{
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
    state: 'Oklahoma',
    zip: '74074',
    country: 'United States',
    phone1: '4057803834',
    phone2: '4057803834,100',
    website: 'www.igshpa.org',
    attendeeType: 'Exhibitor'
  }], function(err, users) {
    if (err) throw err;
    console.log(users);

    //create the admin role
    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw err;

        console.log('Created principal:', principal);
      });
    });
  });
};
