
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
require('dotenv').config({ path: './config.env' });

const sampleSchemes = [
    {
        title: 'TN Student Transport Pass',
        description: 'Free transport pass for students in Tamil Nadu. Currently not active.',
        category: 'Transport',
        eligibility: {
            age: { min: 5, max: 25 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Student',
            otherRequirements: ['Resident of Tamil Nadu']
        },
        benefits: ['Free bus pass', 'Discounted train fare'],
        documents: ['Aadhaar Card', 'School/College ID'],
        applicationProcess: 'Apply at local transport office.',
        deadline: null,
        status: 'Inactive',
        governmentBody: 'TN Transport Department',
        contactInfo: {
            phone: '044-99887766',
            email: 'transport@tn.gov.in',
            website: 'https://tntransport.gov.in',
            address: 'Salem, Tamil Nadu'
        },
        budget: { amount: 3000000, currency: 'INR' },
        tags: ['Transport', 'Student', 'Tamil Nadu'],
        district: 'Salem',
        level: 'State',
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: 'Central Farmer Insurance',
        description: 'Insurance for farmers across India. Central government scheme.',
        category: 'Farmer Support',
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Farmer',
            otherRequirements: ['Must be a registered farmer']
        },
        benefits: ['Crop insurance', 'Disaster relief'],
        documents: ['Aadhaar Card', 'Farmer ID'],
        applicationProcess: 'Apply online or at agriculture office.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Ministry of Agriculture',
        contactInfo: {
            phone: '1800-222-333',
            email: 'farmerinsurance@nic.in',
            website: 'https://farmerinsurance.gov.in',
            address: 'New Delhi'
        },
        budget: { amount: 8000000, currency: 'INR' },
        tags: ['Farmer Support', 'Insurance', 'Central'],
        district: 'All Districts',
        level: 'Central',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'Madurai Student Scholarship',
        description: 'Scholarship for students in Madurai district.',
        category: 'Student Support',
        eligibility: {
            age: { min: 10, max: 22 },
            income: { min: 0, max: 200000 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Student',
            otherRequirements: ['Resident of Madurai']
        },
        benefits: ['Scholarship amount', 'Mentorship'],
        documents: ['Aadhaar Card', 'School ID'],
        applicationProcess: 'Apply at Madurai district office.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Madurai District Education Board',
        contactInfo: {
            phone: '0452-123456',
            email: 'scholarship@madurai.tn.gov.in',
            website: 'https://madurai.tn.gov.in',
            address: 'Madurai, Tamil Nadu'
        },
        budget: { amount: 1000000, currency: 'INR' },
        tags: ['Student Support', 'Madurai', 'Scholarship'],
        district: 'Madurai',
        level: 'State',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'Women Empowerment Central Grant',
        description: 'Central grant for women entrepreneurs. Currently not active.',
        category: 'Women Empowerment',
        eligibility: {
            age: { min: 18, max: 60 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Female',
            location: 'Both',
            occupation: 'Entrepreneur',
            otherRequirements: ['Must be a woman entrepreneur']
        },
        benefits: ['Grant amount', 'Business training'],
        documents: ['Aadhaar Card', 'Business Registration'],
        applicationProcess: 'Apply online.',
        deadline: null,
        status: 'Inactive',
        governmentBody: 'Ministry of Women & Child Development',
        contactInfo: {
            phone: '1800-555-666',
            email: 'womenempowerment@nic.in',
            website: 'https://wcd.nic.in',
            address: 'New Delhi'
        },
        budget: { amount: 4000000, currency: 'INR' },
        tags: ['Women Empowerment', 'Central', 'Entrepreneur'],
        district: 'All Districts',
        level: 'Central',
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: 'State/UT Healthcare Scheme',
        description: 'Healthcare scheme for all State/UTs. Active.',
        category: 'Healthcare',
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Any',
            otherRequirements: ['Resident of any State/UT']
        },
        benefits: ['Free medical checkup', 'Discounted medicines'],
        documents: ['Aadhaar Card', 'State/UT ID'],
        applicationProcess: 'Apply at local health center.',
        deadline: null,
        status: 'Active',
        governmentBody: 'State/UT Health Department',
        contactInfo: {
            phone: '1800-777-888',
            email: 'health@stateut.gov.in',
            website: 'https://stateuthealth.gov.in',
            address: 'Chennai, Tamil Nadu'
        },
        budget: { amount: 6000000, currency: 'INR' },
        tags: ['Healthcare', 'State/UT', 'Medical'],
        district: 'Chennai',
        level: 'State/UT',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'All Levels Technology Grant',
        description: 'Technology grant available at all levels.',
        category: 'Technology',
        eligibility: {
            age: { min: 18, max: 60 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Any',
            otherRequirements: ['Interest in technology']
        },
        benefits: ['Grant amount', 'Tech training'],
        documents: ['Aadhaar Card', 'Tech ID'],
        applicationProcess: 'Apply online.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Ministry of Electronics & IT',
        contactInfo: {
            phone: '1800-999-000',
            email: 'techgrant@meity.gov.in',
            website: 'https://meity.gov.in',
            address: 'Vellore, Tamil Nadu'
        },
        budget: { amount: 7000000, currency: 'INR' },
        tags: ['Technology', 'Grant', 'All Levels'],
        district: 'Vellore',
        level: 'All Levels',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'State Housing Support',
        description: 'Housing support for urban poor in Tamil Nadu. Currently not active.',
        category: 'Housing',
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 180000 },
            education: 'Any',
            gender: 'Any',
            location: 'Urban',
            occupation: 'Any',
            otherRequirements: ['Resident of Tamil Nadu']
        },
        benefits: ['Subsidized housing', 'Interest subsidy'],
        documents: ['Aadhaar Card', 'Income certificate'],
        applicationProcess: 'Apply at municipal office.',
        deadline: null,
        status: 'Inactive',
        governmentBody: 'TN Housing Board',
        contactInfo: {
            phone: '044-33445566',
            email: 'housing@tn.gov.in',
            website: 'https://tnhousing.gov.in',
            address: 'Chennai, Tamil Nadu'
        },
        budget: { amount: 9000000, currency: 'INR' },
        tags: ['Housing', 'Urban', 'Tamil Nadu'],
        district: 'Chennai',
        level: 'State',
        featured: false,
        views: 0,
        applications: 0
    },
    // Tamil Nadu specific schemes
    {
        title: 'TN Free Education Scheme',
        description: 'Provides free education for students in Tamil Nadu from primary to higher secondary.',
        category: 'Education',
        eligibility: {
            age: { min: 5, max: 18 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Student',
            otherRequirements: ['Resident of Tamil Nadu']
        },
        benefits: ['Free tuition', 'Free books'],
        documents: ['Aadhaar Card', 'School ID'],
        applicationProcess: 'Apply online through the official portal.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Tamil Nadu School Education Department',
        contactInfo: {
            phone: '044-12345678',
            email: 'tn-edu@tn.gov.in',
            website: 'https://tnschools.gov.in',
            address: 'Chennai, Tamil Nadu'
        },
        budget: { amount: 10000000, currency: 'INR' },
        tags: ['Education', 'Tamil Nadu', 'Student'],
        district: 'Chennai',
        level: 'State',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'TN Farmer Support Scheme',
        description: 'Financial support for farmers in Tamil Nadu.',
        category: 'Agriculture',
        eligibility: {
            age: { min: 18, max: 120 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Any',
            location: 'Both',
            occupation: 'Farmer',
            otherRequirements: ['Resident of Tamil Nadu']
        },
        benefits: ['Direct cash transfer', 'Subsidized seeds'],
        documents: ['Aadhaar Card', 'Land Ownership Proof'],
        applicationProcess: 'Submit application at local agriculture office.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Tamil Nadu Agriculture Department',
        contactInfo: {
            phone: '044-87654321',
            email: 'tn-agri@tn.gov.in',
            website: 'https://tnagriculture.gov.in',
            address: 'Coimbatore, Tamil Nadu'
        },
        budget: { amount: 5000000, currency: 'INR' },
        tags: ['Agriculture', 'Tamil Nadu', 'Farmer'],
        district: 'Coimbatore',
        level: 'State',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: 'TN Women Empowerment Grant',
        description: 'Grants for women entrepreneurs in Tamil Nadu.',
        category: 'Women Empowerment',
        eligibility: {
            age: { min: 18, max: 60 },
            income: { min: 0, max: 999999999 },
            education: 'Any',
            gender: 'Female',
            location: 'Both',
            occupation: 'Entrepreneur',
            otherRequirements: ['Resident of Tamil Nadu']
        },
        benefits: ['Startup grant', 'Mentorship'],
        documents: ['Aadhaar Card', 'Business Registration'],
        applicationProcess: 'Apply through the Women Development Corporation.',
        deadline: null,
        status: 'Active',
        governmentBody: 'Tamil Nadu Women Development Corporation',
        contactInfo: {
            phone: '044-11223344',
            email: 'tn-women@tn.gov.in',
            website: 'https://tnwdc.gov.in',
            address: 'Madurai, Tamil Nadu'
        },
        budget: { amount: 2000000, currency: 'INR' },
        tags: ['Women Empowerment', 'Tamil Nadu', 'Entrepreneur'],
        district: 'Madurai',
        level: 'State',
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: "PM Kisan Samman Nidhi",
        description: "Direct income support of ₹6,000 per year to eligible farmer families, payable in three equal installments of ₹2,000 each.",
        category: "Agriculture",
        eligibility: {
            age: { min: 18, max: 120 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Must own cultivable land", "Should be a small and marginal farmer"]
        },
        benefits: [
            "₹6,000 per year direct income support",
            "Paid in three installments of ₹2,000 each",
            "Helps meet agricultural expenses",
            "Improves financial stability"
        ],
        documents: [
            "Aadhaar Card",
            "Land ownership documents",
            "Bank account details",
            "Income certificate"
        ],
        applicationProcess: "Apply online through PM-KISAN portal or visit nearest Common Service Centre (CSC).",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Agriculture and Farmers Welfare",
        contactInfo: {
            phone: "1800-180-1551",
            email: "pmkisan-ict@gov.in",
            website: "https://pmkisan.gov.in",
            address: "Ministry of Agriculture, Krishi Bhawan, New Delhi"
        },
        budget: {
            amount: 75000,
            currency: "INR"
        },
        tags: ["Agriculture", "Farmer", "Income Support", "PM Kisan"],
        district: "Madurai",
        level: "Central",
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: "Ayushman Bharat - PMJAY",
        description: "World's largest health insurance scheme providing coverage of up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
        category: "Healthcare",
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 250000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Must be from economically weaker sections", "Based on SECC database"]
        },
        benefits: [
            "Health coverage up to ₹5 lakhs per family per year",
            "Covers 1,393 medical procedures",
            "Cashless treatment at empaneled hospitals",
            "No restriction on family size"
        ],
        documents: [
            "Aadhaar Card",
            "Income certificate",
            "Caste certificate (if applicable)",
            "Ration card"
        ],
        applicationProcess: "Eligible families are automatically included based on SECC database. Visit nearest hospital or call helpline for verification.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Health and Family Welfare",
        contactInfo: {
            phone: "14555",
            email: "support.pmjay@gov.in",
            website: "https://pmjay.gov.in",
            address: "Ministry of Health and Family Welfare, New Delhi"
        },
        budget: {
            amount: 500000,
            currency: "INR"
        },
        tags: ["Healthcare", "Insurance", "PMJAY", "Medical"],
        district: "Madurai",
        level: "Central",
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: "PM FME (Food Processing)",
        description: "Scheme to support micro food processing enterprises with financial, technical, and business support for value addition and branding.",
        category: "Employment",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Must be a micro food processing unit", "Should have valid FSSAI license"]
        },
        benefits: [
            "35% capital subsidy up to ₹10 lakhs",
            "Support for branding and marketing",
            "Technical training and capacity building",
            "Access to credit facilities"
        ],
        documents: [
            "Aadhaar Card",
            "PAN Card",
            "FSSAI license",
            "Business registration certificate",
            "Bank statements"
        ],
        applicationProcess: "Apply online through PM FME portal or visit nearest food processing unit.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Food Processing Industries",
        contactInfo: {
            phone: "1800-111-111",
            email: "pmfme@gov.in",
            website: "https://pmfme.mofpi.gov.in",
            address: "Ministry of Food Processing Industries, New Delhi"
        },
        budget: {
            amount: 1000000,
            currency: "INR"
        },
        tags: ["Employment", "Food Processing", "Business", "Entrepreneurship"],
        district: "Coimbatore",
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: "PM Awas Yojana (Urban)",
        description: "Housing for All scheme providing affordable housing to urban poor with credit-linked subsidy and interest subvention.",
        category: "Housing",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 180000 },
            education: "Any",
            gender: "Any",
            location: "Urban",
            occupation: "Any",
            otherRequirements: ["Must not own a pucca house", "Should be from EWS/LIG category"]
        },
        benefits: [
            "Interest subsidy up to 6.5%",
            "Credit-linked subsidy for home loans",
            "Affordable housing units",
            "Infrastructure development support"
        ],
        documents: [
            "Aadhaar Card",
            "Income certificate",
            "Address proof",
            "Bank statements",
            "Employment certificate"
        ],
        applicationProcess: "Apply online through PMAY portal or visit nearest municipal corporation office.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Housing and Urban Affairs",
        contactInfo: {
            phone: "1800-11-6163",
            email: "pmay-urban@gov.in",
            website: "https://pmay-urban.gov.in",
            address: "Ministry of Housing and Urban Affairs, New Delhi"
        },
        budget: {
            amount: 2500000,
            currency: "INR"
        },
        tags: ["Housing", "Urban", "Home Loan", "Affordable Housing"],
        district: "Chennai",
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: "Beti Bachao Beti Padhao",
        description: "Comprehensive scheme for girl child protection, survival, and education with focus on changing social mindset.",
        category: "Women Empowerment",
        eligibility: {
            age: { min: 0, max: 18 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Female",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Must be a girl child", "Should be enrolled in school"]
        },
        benefits: [
            "Financial support for education",
            "Skill development training",
            "Health and nutrition support",
            "Awareness campaigns"
        ],
        documents: [
            "Birth certificate",
            "Aadhaar Card",
            "School enrollment certificate",
            "Income certificate",
            "Bank account details"
        ],
        applicationProcess: "Contact local Anganwadi center or school for enrollment and benefits.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Women and Child Development",
        contactInfo: {
            phone: "1098",
            email: "bbbp@gov.in",
            website: "https://wcd.nic.in/bbbp-schemes",
            address: "Ministry of Women and Child Development, New Delhi"
        },
        budget: {
            amount: 100000,
            currency: "INR"
        },
        tags: ["Women Empowerment", "Girl Child", "Education", "Beti Bachao"],
        district: "Salem",
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: "PM Mudra Yojana",
        description: "Micro Units Development and Refinance Agency providing loans up to ₹10 lakhs to non-corporate, non-farm small/micro enterprises.",
        category: "Financial Inclusion",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Must be a small business owner", "Should have a viable business plan"]
        },
        benefits: [
            "Loans up to ₹10 lakhs without collateral",
            "Three categories: Shishu, Kishore, Tarun",
            "Low interest rates",
            "Quick disbursement"
        ],
        documents: [
            "Aadhaar Card",
            "PAN Card",
            "Business plan",
            "Bank statements",
            "Address proof"
        ],
        applicationProcess: "Apply through any bank, NBFC, or MFI branch with required documents.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Finance",
        contactInfo: {
            phone: "1800-180-1111",
            email: "mudra@gov.in",
            website: "https://www.mudra.org.in",
            address: "MUDRA, New Delhi"
        },
        budget: {
            amount: 1000000,
            currency: "INR"
        },
        tags: ["Financial Inclusion", "Business Loan", "MUDRA", "Entrepreneurship"],
        district: "Tiruchirappalli",
        featured: true,
        views: 0,
        applications: 0
    },
    {
        title: "Digital India",
        description: "Comprehensive program to transform India into a digitally empowered society and knowledge economy.",
        category: "Technology",
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Access to digital devices", "Internet connectivity"]
        },
        benefits: [
            "Digital literacy training",
            "Access to government services online",
            "Digital infrastructure development",
            "Skill development in IT"
        ],
        documents: [
            "Aadhaar Card",
            "Address proof",
            "Educational certificates",
            "Bank account details"
        ],
        applicationProcess: "Visit nearest Common Service Centre (CSC) or apply online through Digital India portal.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Electronics and Information Technology",
        contactInfo: {
            phone: "1800-3000-3468",
            email: "digitalindia@gov.in",
            website: "https://digitalindia.gov.in",
            address: "Ministry of Electronics and IT, New Delhi"
        },
        budget: {
            amount: 500000,
            currency: "INR"
        },
        tags: ["Technology", "Digital India", "IT", "Digital Literacy"],
        district: "Vellore",
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: "PM Kisan Maan Dhan Yojana",
        description: "Pension scheme for small and marginal farmers providing monthly pension of ₹3,000 after attaining 60 years of age.",
        category: "Senior Citizens",
        eligibility: {
            age: { min: 18, max: 40 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Must be a small and marginal farmer", "Should not be covered under any other pension scheme"]
        },
        benefits: [
            "Monthly pension of ₹3,000 after 60 years",
            "Family pension in case of death",
            "Government contribution to pension fund",
            "Flexible contribution options"
        ],
        documents: [
            "Aadhaar Card",
            "Land ownership documents",
            "Bank account details",
            "Age proof",
            "Farmer certificate"
        ],
        applicationProcess: "Apply through Common Service Centres (CSC) or visit nearest bank branch.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Agriculture and Farmers Welfare",
        contactInfo: {
            phone: "1800-180-1551",
            email: "pmkisan@gov.in",
            website: "https://pmkisan.gov.in",
            address: "Ministry of Agriculture, New Delhi"
        },
        budget: {
            amount: 3000,
            currency: "INR"
        },
        tags: ["Senior Citizens", "Pension", "Farmer", "PM Kisan"],
        district: "Erode",
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: "Stand Up India",
        description: "Scheme to promote entrepreneurship among women and SC/ST communities by facilitating bank loans between ₹10 lakh and ₹1 crore.",
        category: "Women Empowerment",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Must be a woman entrepreneur or from SC/ST community", "Should be a first-time entrepreneur"]
        },
        benefits: [
            "Bank loans from ₹10 lakh to ₹1 crore",
            "Composite loan for working capital",
            "Interest rate concessions",
            "Handholding support"
        ],
        documents: [
            "Aadhaar Card",
            "PAN Card",
            "Caste certificate (if applicable)",
            "Business plan",
            "Bank statements"
        ],
        applicationProcess: "Apply through any scheduled commercial bank branch with required documents.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Finance",
        contactInfo: {
            phone: "1800-180-1111",
            email: "standupindia@gov.in",
            website: "https://www.standupmitra.in",
            address: "Ministry of Finance, New Delhi"
        },
        budget: {
            amount: 10000000,
            currency: "INR"
        },
        tags: ["Women Empowerment", "Entrepreneurship", "Business Loan", "SC/ST"],
        featured: false,
        views: 0,
        applications: 0
    },
    {
        title: "PMEGP (Prime Minister's Employment Generation Programme)",
        description: "Credit-linked subsidy program for setting up micro-enterprises in the non-farm sector by traditional artisans and unemployed youth.",
        category: "Employment",
        eligibility: {
            age: { min: 18, max: 35 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Must be unemployed", "Should not have availed PMEGP assistance earlier"]
        },
        benefits: [
            "Subsidy up to 35% of project cost",
            "Maximum subsidy of ₹25 lakhs",
            "Training and skill development",
            "Marketing support"
        ],
        documents: [
            "Aadhaar Card",
            "Educational certificates",
            "Project report",
            "Bank statements",
            "Unemployment certificate"
        ],
        applicationProcess: "Apply online through PMEGP portal or visit nearest KVIC office.",
        deadline: null,
        status: "Active",
        governmentBody: "Ministry of Micro, Small and Medium Enterprises",
        contactInfo: {
            phone: "1800-180-1111",
            email: "pmegp@gov.in",
            website: "https://www.kviconline.gov.in",
            address: "KVIC, Mumbai"
        },
        budget: {
            amount: 2500000,
            currency: "INR"
        },
        tags: ["Employment", "Entrepreneurship", "PMEGP", "Micro Enterprise"],
        featured: false,
        views: 0,
        applications: 0
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing schemes
        await Scheme.deleteMany({});
        console.log('Cleared existing schemes');

        // Insert sample schemes
        const insertedSchemes = await Scheme.insertMany(sampleSchemes);
        console.log(`Inserted ${insertedSchemes.length} schemes`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, sampleSchemes }; 