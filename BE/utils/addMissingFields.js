const mongoose = require('mongoose');
require('dotenv').config();
const Scheme = require('../models/Scheme');

const DEFAULT_ELIGIBILITY = 'Eligibility criteria will be updated soon. Please check the official portal for details.';
const DEFAULT_APPLY = {
    how: 'Visit the official website or contact your district office for application details.',
    site: 'https://tn.gov.in/schemes'
};

async function updateSchemes() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set. Check your .env file and run from the BE folder.');
    }

    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const schemes = await Scheme.find({});
    let updatedCount = 0;

    for (const scheme of schemes) {
        let changed = false;
        if (!scheme.eligibility) {
            scheme.eligibility = DEFAULT_ELIGIBILITY;
            changed = true;
        }
        if (!scheme.apply || typeof scheme.apply !== 'object') {
            scheme.apply = DEFAULT_APPLY;
            changed = true;
        }
        if (changed) {
            await scheme.save();
            updatedCount++;
        }
    }

    console.log(`Updated ${updatedCount} schemes with missing eligibility/apply info.`);
    mongoose.disconnect();
}

updateSchemes();