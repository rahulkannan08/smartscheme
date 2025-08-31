const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully!');
    addNewScheme();
});

async function addNewScheme() {
    try {
        console.log('\n=== Add New Scheme ===\n');
        
        // You can modify this object to add your scheme
        const newScheme = {
            title: "PM Kisan Samman Nidhi Yojana",
            description: "A central sector scheme to provide income support of Rs.6000 per year to all farmer families across the country in three equal installments of Rs.2000 each every four months.",
            category: "Agriculture",
            district: "All Districts",
            eligibility: {
                age: {
                    min: 18,
                    max: 100
                },
                income: {
                    min: 0,
                    max: 1000000
                },
                education: "Any",
                occupation: "Farmer",
                district: "All Districts",
                otherRequirements: [
                    "Must be a farmer",
                    "Should own agricultural land",
                    "Should not be a government employee"
                ]
            },
            benefits: [
                "Annual income support of Rs.6000 in three installments",
                "Rs.2000 every four months"
            ],
            documents: [
                "Aadhar Card",
                "Land Records",
                "Bank Account Details",
                "Income Certificate"
            ],
            applicationProcess: "Apply online through PM Kisan portal or visit nearest Common Service Centre (CSC).",
            deadline: new Date("2024-12-31"),
            status: "Active",
            governmentBody: "Ministry of Agriculture and Farmers Welfare",
            contactInfo: {
                phone: "1800-180-1551",
                email: "pmkisan@nic.in",
                website: "https://pmkisan.gov.in"
            },
            budget: 75000000000,
            tags: ["Agriculture", "Farmer", "Income Support", "PM Kisan"],
            image: "https://example.com/pm-kisan.jpg",
            featured: true,
            views: 0,
            applications: 0
        };

        // Save the scheme to database
        const scheme = new Scheme(newScheme);
        await scheme.save();
        
        console.log('✅ Scheme added successfully!');
        console.log('Scheme ID:', scheme._id);
        console.log('Title:', scheme.title);
        
        // Close database connection
        mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        
    } catch (error) {
        console.error('❌ Error adding scheme:', error);
        mongoose.connection.close();
    }
}

// Function to add multiple schemes
async function addMultipleSchemes() {
    try {
        const schemes = [
            {
                title: "PM FME (Food Processing)",
                description: "Scheme for food processing and value addition in agriculture sector.",
                category: "Agriculture",
                district: "Coimbatore",
                eligibility: {
                    age: { min: 18, max: 65 },
                    income: { min: 0, max: 500000 },
                    education: "Any",
                    occupation: "Any",
                    district: "Coimbatore",
                    otherRequirements: ["Interest in food processing"]
                },
                benefits: {
                    type: "Equipment",
                    amount: 100000,
                    description: "Financial assistance for food processing equipment"
                },
                documents: ["Aadhar Card", "Business Plan", "Land Documents"],
                applicationProcess: "Apply through PM FME portal",
                deadline: new Date("2024-12-31"),
                status: "Active",
                governmentBody: "Ministry of Food Processing Industries",
                contactInfo: {
                    phone: "1800-XXX-XXXX",
                    email: "pmfme@nic.in",
                    website: "https://pmfme.mofpi.gov.in"
                },
                budget: 10000000,
                tags: ["Food Processing", "Agriculture", "Equipment"],
                image: "https://example.com/pm-fme.jpg",
                featured: false,
                views: 0,
                applications: 0
            },
            {
                title: "PMEGP (Prime Minister's Employment Generation Programme)",
                description: "Credit-linked subsidy programme for setting up micro-enterprises.",
                category: "Employment",
                district: "All Districts",
                eligibility: {
                    age: { min: 18, max: 65 },
                    income: { min: 0, max: 300000 },
                    education: "8th Standard",
                    occupation: "Any",
                    district: "All Districts",
                    otherRequirements: ["Should not have availed PMEGP assistance earlier"]
                },
                benefits: {
                    type: "Loan",
                    amount: 2500000,
                    description: "Subsidized loan up to Rs.25 lakhs"
                },
                documents: ["Aadhar Card", "Income Certificate", "Educational Certificate"],
                applicationProcess: "Apply through KVIC portal or visit KVIC office",
                deadline: new Date("2024-12-31"),
                status: "Active",
                governmentBody: "Khadi and Village Industries Commission",
                contactInfo: {
                    phone: "1800-XXX-XXXX",
                    email: "pmegp@kvic.gov.in",
                    website: "https://pmegp.kvic.gov.in"
                },
                budget: 50000000,
                tags: ["Employment", "Micro Enterprise", "Loan"],
                image: "https://example.com/pmegp.jpg",
                featured: true,
                views: 0,
                applications: 0
            }
        ];

        for (const schemeData of schemes) {
            const scheme = new Scheme(schemeData);
            await scheme.save();
            console.log(`✅ Added: ${scheme.title}`);
        }

        console.log('\n🎉 All schemes added successfully!');
        mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Error adding schemes:', error);
        mongoose.connection.close();
    }
}

// Uncomment the line below to add multiple schemes
// addMultipleSchemes(); 