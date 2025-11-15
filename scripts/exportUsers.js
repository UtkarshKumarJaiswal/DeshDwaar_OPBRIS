// Script to export users to JSON file
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../backend/.env' });

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/deshswaar_passport';

async function exportUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✓ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get users (excluding password)
        const users = await db.collection('users')
            .find({})
            .project({ password: 0 })
            .toArray();

        // Get applications
        const applications = await db.collection('applications')
            .find({})
            .toArray();

        // Create exports directory if it doesn't exist
        const exportDir = path.join(__dirname, 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }

        // Export users to JSON
        const usersFile = path.join(exportDir, `users_${Date.now()}.json`);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        console.log(`✓ Exported ${users.length} users to: ${usersFile}`);

        // Export applications to JSON
        if (applications.length > 0) {
            const appsFile = path.join(exportDir, `applications_${Date.now()}.json`);
            fs.writeFileSync(appsFile, JSON.stringify(applications, null, 2));
            console.log(`✓ Exported ${applications.length} applications to: ${appsFile}`);
        }

        // Create CSV export for users
        if (users.length > 0) {
            const csvFile = path.join(exportDir, `users_${Date.now()}.csv`);
            const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Created At'];
            const rows = users.map(u => [
                u._id,
                u.firstName || '',
                u.lastName || '',
                u.email || '',
                u.phone || '',
                u.createdAt || ''
            ]);
            
            const csvContent = [
                headers.join(','),
                ...rows.map(r => r.map(v => `"${v}"`).join(','))
            ].join('\n');
            
            fs.writeFileSync(csvFile, csvContent);
            console.log(`✓ Exported users to CSV: ${csvFile}`);
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Users: ${users.length}`);
        console.log(`   Applications: ${applications.length}`);

        await mongoose.disconnect();
        console.log('\n✓ Export completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

exportUsers();
