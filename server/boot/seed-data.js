module.exports = function(app) {
  var User = app.models.member;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([{
    username: 'igshpaAdmin',
    email: 'admin@igshpa.org',
    password: 'igshpa123$',
    firstName: 'Kaushik Subramaniam',
    lastName: 'Gnanaskandan'
  }], function(err, users) {
    if (err) throw err;

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
