const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Scheme API',
      version: '1.0.0',
      description: 'API documentation for Tamil Nadu Government Scheme Portal',
      contact: {
        name: 'Smart Scheme Team',
        email: 'support@smartthittam.gov.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Scheme: {
          type: 'object',
          required: ['title', 'description', 'category', 'benefits', 'documents', 'applicationProcess', 'governmentBody'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the scheme'
            },
            title: {
              type: 'string',
              description: 'Title of the scheme'
            },
            description: {
              type: 'string',
              description: 'Detailed description of the scheme'
            },
            category: {
              type: 'string',
              enum: ['Agriculture', 'Education', 'Healthcare', 'Employment', 'Housing', 'Women Empowerment', 'Youth Development', 'Senior Citizens', 'Disability', 'Financial Inclusion', 'Technology', 'Environment', 'Rural Development', 'Urban Development', 'Other'],
              description: 'Category of the scheme'
            },
            benefits: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of benefits provided by the scheme'
            },
            eligibility: {
              type: 'object',
              properties: {
                age: {
                  type: 'object',
                  properties: {
                    min: { type: 'number' },
                    max: { type: 'number' }
                  }
                },
                income: {
                  type: 'object',
                  properties: {
                    min: { type: 'number' },
                    max: { type: 'number' }
                  }
                },
                education: {
                  type: 'string',
                  enum: ['Any', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate']
                },
                gender: {
                  type: 'string',
                  enum: ['Any', 'Male', 'Female']
                },
                location: {
                  type: 'string',
                  enum: ['Both', 'Rural', 'Urban']
                }
              }
            },
            documents: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Required documents for application'
            },
            applicationProcess: {
              type: 'string',
              description: 'Step-by-step application process'
            },
            governmentBody: {
              type: 'string',
              description: 'Government department responsible for the scheme'
            },
            district: {
              type: 'string',
              description: 'Applicable district(s)'
            },
            status: {
              type: 'string',
              enum: ['Active', 'Inactive'],
              default: 'Active'
            },
            featured: {
              type: 'boolean',
              default: false,
              description: 'Whether the scheme is featured'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API files
};

const specs = swaggerJSDoc(options);

module.exports = specs;
