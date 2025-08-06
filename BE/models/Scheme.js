const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Scheme title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Scheme description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Scheme category is required'],
        enum: {
            values: [
                'Agriculture',
                'Education',
                'Healthcare',
                'Employment',
                'Housing',
                'Women Empowerment',
                'Youth Development',
                'Senior Citizens',
                'Disability',
                'Financial Inclusion',
                'Technology',
                'Environment',
                'Rural Development',
                'Urban Development',
                'Other'
            ],
            message: 'Please select a valid category'
        }
    },
    eligibility: {
        age: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 120 }
        },
        income: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 999999999 }
        },
        education: {
            type: String,
            enum: ['No Education', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate', 'Any'],
            default: 'Any'
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Any'],
            default: 'Any'
        },
        location: {
            type: String,
            enum: ['Rural', 'Urban', 'Both'],
            default: 'Both'
        },
        occupation: {
            type: String,
            default: 'Any'
        },
        otherRequirements: [String]
    },
    district: {
        type: String,
        enum: [
            'All Districts',
            'Chennai',
            'Coimbatore',
            'Madurai',
            'Salem',
            'Tiruchirappalli',
            'Vellore',
            'Erode',
            'Tiruppur',
            'Tirunelveli',
            'Thoothukkudi',
            'Dindigul',
            'Thanjavur',
            'Villupuram',
            'Kanchipuram',
            'Cuddalore',
            'Pudukkottai',
            'Sivaganga',
            'Ramanathapuram',
            'Virudhunagar',
            'Karur',
            'Namakkal',
            'Theni',
            'Krishnagiri',
            'Dharmapuri',
            'Tiruvannamalai',
            'Ariyalur',
            'Perambalur',
            'Nagapattinam',
            'Tiruvarur',
            'Nilgiris',
            'Tenkasi',
            'Chengalpattu',
            'Ranipet',
            'Tirupathur',
            'Mayiladuthurai',
            'Kallakurichi'
        ],
        default: 'All Districts'
    },
    benefits: {
        type: [String],
        required: [true, 'Scheme benefits are required']
    },
    documents: {
        type: [String],
        required: [true, 'Required documents are needed']
    },
    applicationProcess: {
        type: String,
        required: [true, 'Application process is required']
    },
    deadline: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Upcoming', 'Closed'],
        default: 'Active'
    },
    governmentBody: {
        type: String,
        required: [true, 'Government body is required']
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String,
        address: String
    },
    budget: {
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    tags: [String],
    image: {
        type: String,
        default: null
    },
    featured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    applications: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
schemeSchema.index({ title: 'text', description: 'text', category: 1 });
schemeSchema.index({ status: 1, featured: 1 });
schemeSchema.index({ 'eligibility.age.min': 1, 'eligibility.age.max': 1 });
schemeSchema.index({ createdAt: -1 });

// Virtual for formatted deadline
schemeSchema.virtual('deadlineFormatted').get(function() {
    if (!this.deadline) return 'No Deadline';
    return this.deadline.toLocaleDateString('en-IN');
});

// Virtual for age range
schemeSchema.virtual('ageRange').get(function() {
    if (this.eligibility.age.min === 0 && this.eligibility.age.max === 120) {
        return 'All Ages';
    }
    return `${this.eligibility.age.min} - ${this.eligibility.age.max} years`;
});

// Virtual for income range
schemeSchema.virtual('incomeRange').get(function() {
    if (this.eligibility.income.min === 0 && this.eligibility.income.max === 999999999) {
        return 'All Income Levels';
    }
    return `₹${this.eligibility.income.min.toLocaleString()} - ₹${this.eligibility.income.max.toLocaleString()}`;
});

// Pre-save middleware
schemeSchema.pre('save', function(next) {
    // Convert title to title case
    if (this.title) {
        this.title = this.title.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    
    // Generate tags from title and category
    if (!this.tags || this.tags.length === 0) {
        this.tags = [this.category, ...this.title.split(' ').slice(0, 3)];
    }
    
    next();
});

module.exports = mongoose.model('Scheme', schemeSchema); 