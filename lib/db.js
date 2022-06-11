const {MongoClient, ObjectId} = require( 'mongodb' );
      url = `mongodb://${process.env?.DB_HOST || 'localhost'}:${process.env?.DB_PORT || 27017}/${process.env?.DB_NAME || ''}`;

var _db;
module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db(`${process.env?.DB_NAME || ''}`);
      return callback( err, client );
    } );
  },

  getDb: function() {
    return _db;
  },

  string2ID: function(id){
      return new ObjectId(id);
  }
};