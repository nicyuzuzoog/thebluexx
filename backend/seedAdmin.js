    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const User = require('./models/User');

    dotenv.config();

    const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
        console.log('Admin already exists!');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Admin role confirmed.');
        } else {
        await User.create({
            name: 'THE BLUEX Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
            isActive: true,
            preferredLanguage: 'en'
        });
        console.log('Admin created successfully!');
        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
    };

    seedAdmin();