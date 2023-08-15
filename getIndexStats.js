/* BEGIN INIT INFO
# Provides:        Provide a comprehensive rundown of index usage statistics for all collections within a given database.
# Required Start:  $local
# Author:          Anban Malarvendan
# License:         GNU GENERAL PUBLIC LICENSE Version 3 + 
#                  Sectoion 7: Redistribution/Reuse of this code is permitted under the 
#                  GNU v3 license, as an additional term ALL code must carry the 
#                  original Author(s) credit in comment form.
# Usage:           mongo --eval 'var databaseName="testdb"' getIndexStats.js
# END INIT INFO */

function retrieveIndexUsageStats() {
  var mongoConnection = new Mongo();
  var db = mongoConnection.getDB(databaseName);

  db.getCollectionNames().forEach(function(collectionName) {
    db.getCollection(collectionName).aggregate([
      { $indexStats: {} },
      {
        $match: {
          "accesses.ops": { $gt: NumberLong(1) }
        }
      }
    ]).forEach(function(indexInfo) {
      var indexKey = JSON.stringify(indexInfo.key);
      var accessCount = indexInfo.accesses.ops;
      print("Index Key: " + indexKey + " in collection " + collectionName + " has " + accessCount + " accesses");
    });
  });
}

retrieveIndexUsageStats();
