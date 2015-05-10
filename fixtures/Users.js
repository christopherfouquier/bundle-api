var sha1 = require('sha1');

module.exports = function(mongoose, conn, callback){

    // standard callback error
    var error = null;

    // create your data documents using object-literals
    var fixture = [];
    
    /*
     * Example of adding a data document/fixture item 
     */
    fixture.push({
        // by not defining an _id mongoose-fixture
        // will by default set a mongo ObjectID
        // defining one manually will override mongoDB
        username: 'admin',
        password: sha1('admin'),
        email: 'dev@clintagency.com',
        role: 'admin'
    });
    
    // mongoose-fixture expects implementor to return
    // the callback passed in context
    return callback(error, fixture);
};