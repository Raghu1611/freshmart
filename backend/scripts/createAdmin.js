import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://2200032009cseh_db_user:Raghu1611@cluster0.xrextg2.mongodb.net/auth_app';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@freshmart.com';
        const adminPassword = 'admin123';

        // Delete existing admin if exists (to avoid password re-hashing issues)
        await User.deleteOne({ email: adminEmail });
        console.log('Cleared any existing admin user');

        // Create fresh admin
        const newAdmin = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isVerified: true
        });

        await newAdmin.save();
        console.log('Admin user created successfully');

        console.log('-----------------------------------');
        console.log('Admin Credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
