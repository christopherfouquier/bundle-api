var seeder = require('mongoose-seed'),
    config = require('./helpers/config');

seeder.connect('mongodb://' + config.db.host +':' + config.db.port +'/' + config.db.dbname, function() {
	seeder.loadModels([
        'models/User.js'
    ]);
	seeder.clearModels(['User'], function() {
		seeder.populateModels(data);
    });
});

var data = [
    {
        'model': 'User',
        'documents': [
            {
                'firstname': 'Christopher',
                'lastname': 'Fouquier',
                'email': 'christopher@clintagency.com',
                'password': 'root',
                'role': 'admin'
            }
        ]
    }
];