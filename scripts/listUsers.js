// Script to list all users from MongoDB database
const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/deshswaar_passport';

async function listUsers() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        console.log('URI:', uri);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✓ Connected to MongoDB successfully!\n');

        const db = mongoose.connection.db;

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name).join(', '));
        console.log('');

        // Check if users collection exists
        const hasUsers = collections.some(c => c.name === 'users');
        
        if (!hasUsers) {
            console.log('⚠️  No "users" collection found. Database might be empty.');
            console.log('Register a user through the frontend to create data.\n');
        } else {
            // Get users (excluding password field for security)
            const users = await db.collection('users')
                .find({})
                .project({ password: 0 })  // Exclude password
                .toArray();

            console.log(`📊 Found ${users.length} user(s) in database:\n`);
            
            if (users.length > 0) {
                users.forEach((user, index) => {
                    console.log(`👤 User ${index + 1}:`);
                    console.log('   ID:', user._id);
                    console.log('   Name:', `${user.firstName || ''} ${user.lastName || ''}`);
                    console.log('   Email:', user.email || 'N/A');
                    console.log('   Phone:', user.phone || 'N/A');
                    console.log('   Created:', user.createdAt || 'N/A');
                    console.log('   ---');
                });
            } else {
                console.log('No users found in the collection.');
            }
        }

        // Check applications collection too
        const hasApplications = collections.some(c => c.name === 'applications');
        
        if (hasApplications) {
            const appCount = await db.collection('applications').countDocuments();
            console.log(`\n📋 Found ${appCount} application(s) in database`);
        }

        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 MongoDB is not running. Please start MongoDB:');
            console.log('   - Windows: Start MongoDB service from Services');
            console.log('   - Or install MongoDB Community Server');
            console.log('   - Or use MongoDB Atlas (cloud database)');
        }
        process.exit(1);
    }
}

// Run the script
listUsers();
