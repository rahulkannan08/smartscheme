const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
require('dotenv').config({ path: './.env' });

const schemes = [
    // Transport - Salem - State
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
        applications: 0,
        apply: {
            site: 'https://tntransport.gov.in/apply',
            how: 'Apply at local transport office with required documents.'
        }
    },
    // Farmer Support - All Districts - Central
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
        applications: 0,
        apply: {
            site: 'https://farmerinsurance.gov.in/apply',
            how: 'Apply online or at agriculture office with Farmer ID.'
        }
    },
    // Student Support - Madurai - State
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
        applications: 0,
        apply: {
            site: 'https://madurai.tn.gov.in/scholarship',
            how: 'Apply at Madurai district office with School ID.'
        }
    },
    // Women Empowerment - All Districts - Central
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
        applications: 0,
        apply: {
            site: 'https://wcd.nic.in/apply',
            how: 'Apply online with Business Registration documents.'
        }
    },
    // Healthcare - Chennai - State/UT
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
        applications: 0,
        apply: {
            site: 'https://stateuthealth.gov.in/apply',
            how: 'Apply at local health center with State/UT ID.'
        }
    },
    // Education - All Districts - State
    {
        title: "Tamil Nadu Free Education Scheme",
        description: "Provides free education for students from economically weaker sections in Tamil Nadu.",
        category: "Education",
        district: "All Districts",
        level: "State",
        eligibility: {
            age: { min: 5, max: 18 },
            income: { min: 0, max: 200000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Resident of Tamil Nadu"]
        },
        benefits: ["Free tuition", "Free textbooks", "Scholarship"],
        documents: ["Aadhaar Card", "Income Certificate", "School ID"],
        applicationProcess: "Apply at school or online portal.",
        deadline: null,
        status: "Active",
        governmentBody: "TN School Education Department",
        contactInfo: {
            phone: "044-12345678",
            email: "education@tn.gov.in",
            website: "https://tnschools.gov.in",
            address: "Chennai, Tamil Nadu"
        },
        budget: { amount: 50000000, currency: "INR" },
        tags: ["Education", "Tamil Nadu", "Student"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tnschools.gov.in/apply",
            how: "Apply at school or online with required documents."
        }
    },
    // Agriculture - All Districts - State
    {
        title: "TN Farmer Support Scheme",
        description: "Financial support and resources for farmers in Tamil Nadu.",
        category: "Agriculture",
        district: "All Districts",
        level: "State",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Resident of Tamil Nadu"]
        },
        benefits: ["Subsidy on seeds", "Financial aid", "Insurance"],
        documents: ["Aadhaar Card", "Farmer ID"],
        applicationProcess: "Apply at agriculture office or online.",
        deadline: null,
        status: "Active",
        governmentBody: "TN Agriculture Department",
        contactInfo: {
            phone: "044-87654321",
            email: "agri@tn.gov.in",
            website: "https://tnagriculture.gov.in",
            address: "Chennai, Tamil Nadu"
        },
        budget: { amount: 80000000, currency: "INR" },
        tags: ["Agriculture", "Farmer", "Tamil Nadu"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tnagriculture.gov.in/apply",
            how: "Apply at agriculture office or online with Farmer ID."
        }
    },
    // Healthcare - All Districts - State
    {
        title: "TN Healthcare for All",
        description: "Free healthcare services for residents of Tamil Nadu.",
        category: "Healthcare",
        district: "All Districts",
        level: "State",
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Resident of Tamil Nadu"]
        },
        benefits: ["Free medical checkup", "Discounted medicines", "Hospitalization"],
        documents: ["Aadhaar Card", "State ID"],
        applicationProcess: "Apply at local health center.",
        deadline: null,
        status: "Active",
        governmentBody: "TN Health Department",
        contactInfo: {
            phone: "044-11223344",
            email: "health@tn.gov.in",
            website: "https://tnhealth.gov.in",
            address: "Chennai, Tamil Nadu"
        },
        budget: { amount: 60000000, currency: "INR" },
        tags: ["Healthcare", "Medical", "Tamil Nadu"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tnhealth.gov.in/apply",
            how: "Apply at local health center with State ID."
        }
    },
    // Women Empowerment - All Districts - State
    {
        title: "TN Women Empowerment Grant",
        description: "Grants and training for women entrepreneurs in Tamil Nadu.",
        category: "Women Empowerment",
        district: "All Districts",
        level: "State",
        eligibility: {
            age: { min: 18, max: 60 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Female",
            location: "Both",
            occupation: "Entrepreneur",
            otherRequirements: ["Resident of Tamil Nadu"]
        },
        benefits: ["Grant amount", "Business training"],
        documents: ["Aadhaar Card", "Business Registration"],
        applicationProcess: "Apply online.",
        deadline: null,
        status: "Active",
        governmentBody: "TN Women Development Department",
        contactInfo: {
            phone: "044-99887766",
            email: "women@tn.gov.in",
            website: "https://tnwomen.gov.in",
            address: "Chennai, Tamil Nadu"
        },
        budget: { amount: 40000000, currency: "INR" },
        tags: ["Women Empowerment", "Entrepreneur", "Tamil Nadu"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tnwomen.gov.in/apply",
            how: "Apply online with Business Registration documents."
        }
    },
    // Education - Chennai - State
    {
        title: "Chennai Student Merit Scholarship",
        description: "Scholarship for meritorious students in Chennai district.",
        category: "Education",
        district: "Chennai",
        level: "State",
        eligibility: {
            age: { min: 10, max: 22 },
            income: { min: 0, max: 200000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Resident of Chennai"]
        },
        benefits: ["Scholarship amount", "Mentorship"],
        documents: ["Aadhaar Card", "School ID"],
        applicationProcess: "Apply at Chennai district education office.",
        deadline: null,
        status: "Active",
        governmentBody: "Chennai District Education Board",
        contactInfo: {
            phone: "044-12345678",
            email: "scholarship@chennai.tn.gov.in",
            website: "https://chennai.tn.gov.in",
            address: "Chennai, Tamil Nadu"
        },
        budget: { amount: 1000000, currency: "INR" },
        tags: ["Education", "Chennai", "Scholarship"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://chennai.tn.gov.in/scholarship",
            how: "Apply at district office with School ID."
        }
    },
    // Agriculture - Coimbatore - State
    {
        title: "Coimbatore Farmer Subsidy Scheme",
        description: "Subsidy for farmers in Coimbatore district for seeds and equipment.",
        category: "Agriculture",
        district: "Coimbatore",
        level: "State",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 500000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Resident of Coimbatore"]
        },
        benefits: ["Seed subsidy", "Equipment subsidy"],
        documents: ["Aadhaar Card", "Farmer ID"],
        applicationProcess: "Apply at agriculture office.",
        deadline: null,
        status: "Active",
        governmentBody: "Coimbatore Agriculture Department",
        contactInfo: {
            phone: "0422-87654321",
            email: "agri@coimbatore.tn.gov.in",
            website: "https://coimbatore.tn.gov.in",
            address: "Coimbatore, Tamil Nadu"
        },
        budget: { amount: 5000000, currency: "INR" },
        tags: ["Agriculture", "Coimbatore", "Subsidy"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://coimbatore.tn.gov.in/apply",
            how: "Apply at agriculture office with Farmer ID."
        }
    },
    // Healthcare - Madurai - State
    {
        title: "Madurai Free Health Checkup Scheme",
        description: "Free annual health checkups for residents of Madurai.",
        category: "Healthcare",
        district: "Madurai",
        level: "State",
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Resident of Madurai"]
        },
        benefits: ["Free health checkup", "Discounted medicines"],
        documents: ["Aadhaar Card", "Madurai ID"],
        applicationProcess: "Apply at local health center.",
        deadline: null,
        status: "Active",
        governmentBody: "Madurai Health Department",
        contactInfo: {
            phone: "0452-11223344",
            email: "health@madurai.tn.gov.in",
            website: "https://madurai.tn.gov.in",
            address: "Madurai, Tamil Nadu"
        },
        budget: { amount: 3000000, currency: "INR" },
        tags: ["Healthcare", "Madurai", "Medical"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://madurai.tn.gov.in/apply",
            how: "Apply at health center with Madurai ID."
        }
    },
    // Women Empowerment - Salem - State
    {
        title: "Salem Women Entrepreneur Grant",
        description: "Grant and training for women entrepreneurs in Salem.",
        category: "Women Empowerment",
        district: "Salem",
        level: "State",
        eligibility: {
            age: { min: 18, max: 60 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Female",
            location: "Both",
            occupation: "Entrepreneur",
            otherRequirements: ["Resident of Salem"]
        },
        benefits: ["Grant amount", "Business training"],
        documents: ["Aadhaar Card", "Business Registration"],
        applicationProcess: "Apply online.",
        deadline: null,
        status: "Active",
        governmentBody: "Salem Women Development Department",
        contactInfo: {
            phone: "0427-99887766",
            email: "women@salem.tn.gov.in",
            website: "https://salem.tn.gov.in",
            address: "Salem, Tamil Nadu"
        },
        budget: { amount: 2000000, currency: "INR" },
        tags: ["Women Empowerment", "Salem", "Entrepreneur"],
        image: null,
        featured: true,
        views: 0,
        applications: 0,
        apply: {
            site: "https://salem.tn.gov.in/apply",
            how: "Apply online with Business Registration documents."
        }
    },
    // Transport - Tirunelveli - State
    {
        title: "Tirunelveli Student Transport Pass",
        description: "Free transport pass for students in Tirunelveli.",
        category: "Transport",
        district: "Tirunelveli",
        level: "State",
        eligibility: {
            age: { min: 5, max: 25 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Resident of Tirunelveli"]
        },
        benefits: ["Free bus pass", "Discounted train fare"],
        documents: ["Aadhaar Card", "School/College ID"],
        applicationProcess: "Apply at local transport office.",
        deadline: null,
        status: "Active",
        governmentBody: "Tirunelveli Transport Department",
        contactInfo: {
            phone: "0462-99887766",
            email: "transport@tirunelveli.tn.gov.in",
            website: "https://tirunelveli.tn.gov.in",
            address: "Tirunelveli, Tamil Nadu"
        },
        budget: { amount: 1000000, currency: "INR" },
        tags: ["Transport", "Student", "Tirunelveli"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tirunelveli.tn.gov.in/apply",
            how: "Apply at local transport office with required documents."
        }
    },
    // Education - Trichy - State
    {
        title: "Trichy Rural Student Scholarship",
        description: "Scholarship for rural students in Trichy district.",
        category: "Education",
        district: "Trichy",
        level: "State",
        eligibility: {
            age: { min: 10, max: 20 },
            income: { min: 0, max: 150000 },
            education: "Any",
            gender: "Any",
            location: "Rural",
            occupation: "Student",
            otherRequirements: ["Resident of Trichy"]
        },
        benefits: ["Scholarship amount", "Free books"],
        documents: ["Aadhaar Card", "School ID"],
        applicationProcess: "Apply at Trichy education office.",
        deadline: null,
        status: "Active",
        governmentBody: "Trichy District Education Board",
        contactInfo: {
            phone: "0431-123456",
            email: "scholarship@trichy.tn.gov.in",
            website: "https://trichy.tn.gov.in",
            address: "Trichy, Tamil Nadu"
        },
        budget: { amount: 500000, currency: "INR" },
        tags: ["Education", "Trichy", "Scholarship"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://trichy.tn.gov.in/scholarship",
            how: "Apply at district office with School ID."
        }
    },
    // Education - Vellore - State
    {
        title: "Vellore Urban Student Grant",
        description: "Grant for urban students in Vellore district.",
        category: "Education",
        district: "Vellore",
        level: "State",
        eligibility: {
            age: { min: 12, max: 22 },
            income: { min: 0, max: 180000 },
            education: "Any",
            gender: "Any",
            location: "Urban",
            occupation: "Student",
            otherRequirements: ["Resident of Vellore"]
        },
        benefits: ["Grant amount", "Mentorship"],
        documents: ["Aadhaar Card", "School ID"],
        applicationProcess: "Apply at Vellore education office.",
        deadline: null,
        status: "Active",
        governmentBody: "Vellore District Education Board",
        contactInfo: {
            phone: "0416-654321",
            email: "grant@vellore.tn.gov.in",
            website: "https://vellore.tn.gov.in",
            address: "Vellore, Tamil Nadu"
        },
        budget: { amount: 600000, currency: "INR" },
        tags: ["Education", "Vellore", "Grant"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://vellore.tn.gov.in/grant",
            how: "Apply at district office with School ID."
        }
    },
    // Agriculture - Erode - State
    {
        title: "Erode Organic Farming Subsidy",
        description: "Subsidy for organic farmers in Erode district.",
        category: "Agriculture",
        district: "Erode",
        level: "State",
        eligibility: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 400000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Resident of Erode", "Practicing organic farming"]
        },
        benefits: ["Subsidy for organic inputs", "Training"],
        documents: ["Aadhaar Card", "Farmer ID"],
        applicationProcess: "Apply at Erode agriculture office.",
        deadline: null,
        status: "Active",
        governmentBody: "Erode Agriculture Department",
        contactInfo: {
            phone: "0424-112233",
            email: "organic@erode.tn.gov.in",
            website: "https://erode.tn.gov.in",
            address: "Erode, Tamil Nadu"
        },
        budget: { amount: 700000, currency: "INR" },
        tags: ["Agriculture", "Erode", "Organic"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://erode.tn.gov.in/organic",
            how: "Apply at agriculture office with Farmer ID."
        }
    },
    // Agriculture - Thanjavur - State
    {
        title: "Thanjavur Irrigation Support Scheme",
        description: "Support for irrigation projects in Thanjavur district.",
        category: "Agriculture",
        district: "Thanjavur",
        level: "State",
        eligibility: {
            age: { min: 20, max: 70 },
            income: { min: 0, max: 500000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Farmer",
            otherRequirements: ["Resident of Thanjavur"]
        },
        benefits: ["Irrigation equipment subsidy", "Technical support"],
        documents: ["Aadhaar Card", "Farmer ID"],
        applicationProcess: "Apply at Thanjavur agriculture office.",
        deadline: null,
        status: "Active",
        governmentBody: "Thanjavur Agriculture Department",
        contactInfo: {
            phone: "04362-334455",
            email: "irrigation@thanjavur.tn.gov.in",
            website: "https://thanjavur.tn.gov.in",
            address: "Thanjavur, Tamil Nadu"
        },
        budget: { amount: 800000, currency: "INR" },
        tags: ["Agriculture", "Thanjavur", "Irrigation"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://thanjavur.tn.gov.in/irrigation",
            how: "Apply at agriculture office with Farmer ID."
        }
    },
    // Healthcare - Dindigul - State
    {
        title: "Dindigul Rural Health Initiative",
        description: "Free health checkups for rural residents of Dindigul.",
        category: "Healthcare",
        district: "Dindigul",
        level: "State",
        eligibility: {
            age: { min: 0, max: 120 },
            income: { min: 0, max: 250000 },
            education: "Any",
            gender: "Any",
            location: "Rural",
            occupation: "Any",
            otherRequirements: ["Resident of Dindigul"]
        },
        benefits: ["Free health checkup", "Discounted medicines"],
        documents: ["Aadhaar Card", "Dindigul ID"],
        applicationProcess: "Apply at local health center.",
        deadline: null,
        status: "Active",
        governmentBody: "Dindigul Health Department",
        contactInfo: {
            phone: "0451-223344",
            email: "health@dindigul.tn.gov.in",
            website: "https://dindigul.tn.gov.in",
            address: "Dindigul, Tamil Nadu"
        },
        budget: { amount: 400000, currency: "INR" },
        tags: ["Healthcare", "Dindigul", "Rural"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://dindigul.tn.gov.in/health",
            how: "Apply at health center with Dindigul ID."
        }
    },
    // Healthcare - Kanyakumari - State
    {
        title: "Kanyakumari Senior Citizen Health Scheme",
        description: "Healthcare support for senior citizens in Kanyakumari.",
        category: "Healthcare",
        district: "Kanyakumari",
        level: "State",
        eligibility: {
            age: { min: 60, max: 120 },
            income: { min: 0, max: 300000 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Resident of Kanyakumari"]
        },
        benefits: ["Free medical checkup", "Specialist consultation"],
        documents: ["Aadhaar Card", "Kanyakumari ID"],
        applicationProcess: "Apply at local health center.",
        deadline: null,
        status: "Active",
        governmentBody: "Kanyakumari Health Department",
        contactInfo: {
            phone: "04652-556677",
            email: "seniorhealth@kanyakumari.tn.gov.in",
            website: "https://kanyakumari.tn.gov.in",
            address: "Kanyakumari, Tamil Nadu"
        },
        budget: { amount: 500000, currency: "INR" },
        tags: ["Healthcare", "Kanyakumari", "Senior"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://kanyakumari.tn.gov.in/seniorhealth",
            how: "Apply at health center with Kanyakumari ID."
        }
    },
    // Women Empowerment - Tiruppur - State
    {
        title: "Tiruppur Women Skill Development",
        description: "Skill development program for women in Tiruppur.",
        category: "Women Empowerment",
        district: "Tiruppur",
        level: "State",
        eligibility: {
            age: { min: 18, max: 55 },
            income: { min: 0, max: 350000 },
            education: "Any",
            gender: "Female",
            location: "Both",
            occupation: "Any",
            otherRequirements: ["Resident of Tiruppur"]
        },
        benefits: ["Skill training", "Job placement assistance"],
        documents: ["Aadhaar Card", "Tiruppur ID"],
        applicationProcess: "Apply online or at Tiruppur women center.",
        deadline: null,
        status: "Active",
        governmentBody: "Tiruppur Women Development Department",
        contactInfo: {
            phone: "0421-334455",
            email: "skills@tiruppur.tn.gov.in",
            website: "https://tiruppur.tn.gov.in",
            address: "Tiruppur, Tamil Nadu"
        },
        budget: { amount: 300000, currency: "INR" },
        tags: ["Women Empowerment", "Tiruppur", "Skill"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://tiruppur.tn.gov.in/skills",
            how: "Apply online or at women center with Tiruppur ID."
        }
    },
    // Women Empowerment - Thoothukudi - State
    {
        title: "Thoothukudi Women Entrepreneur Grant",
        description: "Grant for women entrepreneurs in Thoothukudi.",
        category: "Women Empowerment",
        district: "Thoothukudi",
        level: "State",
        eligibility: {
            age: { min: 21, max: 60 },
            income: { min: 0, max: 400000 },
            education: "Any",
            gender: "Female",
            location: "Both",
            occupation: "Entrepreneur",
            otherRequirements: ["Resident of Thoothukudi"]
        },
        benefits: ["Grant amount", "Business mentorship"],
        documents: ["Aadhaar Card", "Business Registration"],
        applicationProcess: "Apply online.",
        deadline: null,
        status: "Active",
        governmentBody: "Thoothukudi Women Development Department",
        contactInfo: {
            phone: "0461-223344",
            email: "entrepreneur@thoothukudi.tn.gov.in",
            website: "https://thoothukudi.tn.gov.in",
            address: "Thoothukudi, Tamil Nadu"
        },
        budget: { amount: 350000, currency: "INR" },
        tags: ["Women Empowerment", "Thoothukudi", "Entrepreneur"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://thoothukudi.tn.gov.in/entrepreneur",
            how: "Apply online with Business Registration documents."
        }
    },
    // Transport - Namakkal - State
    {
        title: "Namakkal Student Bus Pass",
        description: "Bus pass for students in Namakkal district.",
        category: "Transport",
        district: "Namakkal",
        level: "State",
        eligibility: {
            age: { min: 6, max: 20 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Resident of Namakkal"]
        },
        benefits: ["Free bus pass"],
        documents: ["Aadhaar Card", "School ID"],
        applicationProcess: "Apply at Namakkal transport office.",
        deadline: null,
        status: "Active",
        governmentBody: "Namakkal Transport Department",
        contactInfo: {
            phone: "04286-112233",
            email: "buspass@namakkal.tn.gov.in",
            website: "https://namakkal.tn.gov.in",
            address: "Namakkal, Tamil Nadu"
        },
        budget: { amount: 200000, currency: "INR" },
        tags: ["Transport", "Namakkal", "Student"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://namakkal.tn.gov.in/buspass",
            how: "Apply at transport office with School ID."
        }
    },
    // Transport - Karur - State
    {
        title: "Karur College Student Rail Pass",
        description: "Rail pass for college students in Karur district.",
        category: "Transport",
        district: "Karur",
        level: "State",
        eligibility: {
            age: { min: 17, max: 25 },
            income: { min: 0, max: 999999999 },
            education: "Any",
            gender: "Any",
            location: "Both",
            occupation: "Student",
            otherRequirements: ["Resident of Karur"]
        },
        benefits: ["Discounted rail fare"],
        documents: ["Aadhaar Card", "College ID"],
        applicationProcess: "Apply at Karur railway office.",
        deadline: null,
        status: "Active",
        governmentBody: "Karur Transport Department",
        contactInfo: {
            phone: "04324-334455",
            email: "railpass@karur.tn.gov.in",
            website: "https://karur.tn.gov.in",
            address: "Karur, Tamil Nadu"
        },
        budget: { amount: 250000, currency: "INR" },
        tags: ["Transport", "Karur", "Student"],
        image: null,
        featured: false,
        views: 0,
        applications: 0,
        apply: {
            site: "https://karur.tn.gov.in/railpass",
            how: "Apply at railway office with College ID."
        }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing schemes
        await Scheme.deleteMany({});
        console.log('Cleared existing schemes');

        // Insert all schemes
        const insertedSchemes = await Scheme.insertMany(schemes);
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

module.exports = { seedDatabase, schemes };