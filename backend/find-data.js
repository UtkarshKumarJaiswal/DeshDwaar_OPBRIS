// Quick diagnostic to find where your data is stored
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://utkarsh31983_db_user:Deshdwaar_db1@cluster0.st1m4ka.mongodb.net/?appName=Cluster0';

console.log('🔍 Connecting to MongoDB...');
console.log('Connection URI:', uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected successfully!');
  
  // Get the database name being used
  const dbName = mongoose.connection.db.databaseName;
  console.log('\n📊 Current Database Name:', dbName);
  
  // List all collections in this database
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📁 Collections in this database:');
  collections.forEach(col => console.log('  -', col.name));
  
  // Check users collection
  console.log('\n👥 Checking users collection...');
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  console.log('Total users:', userCount);
  
  if (userCount > 0) {
    console.log('\n📄 Sample user (first one):');
    const sampleUser = await User.findOne().select('-password').lean();
    console.log(JSON.stringify(sampleUser, null, 2));
  } else {
    console.log('⚠️  No users found in this database!');
  }
  
  // List all databases on the cluster
  console.log('\n🗄️  ALL Databases on your MongoDB cluster:');
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  dbs.databases.forEach(db => {
    console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
  });
  
  mongoose.connection.close();
  console.log('\n✅ Diagnostic complete!');
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
