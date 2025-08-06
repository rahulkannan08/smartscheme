# Smart Scheme Backend

A comprehensive Node.js backend for the Smart Scheme application, providing RESTful APIs for government scheme management and AI-powered chatbot functionality.

## Features

- **Scheme Management**: CRUD operations for government schemes with advanced filtering
- **AI Chatbot**: Intelligent scheme recommendations based on user queries
- **MongoDB Integration**: Robust database with comprehensive data models
- **Security**: Rate limiting, CORS, helmet, and input validation
- **RESTful APIs**: Well-structured API endpoints with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: helmet, express-rate-limit
- **Validation**: express-validator
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env.example` to `config.env`
   - Update the configuration variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart_scheme_db
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create the database on first run

5. **Seed Database (Optional)**
   ```bash
   node utils/seedData.js
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Schemes API (`/api/v2/schemes`)
- `GET /get-all-schemes` - Get all schemes with pagination
- `GET /get-filtered-schemes` - Get schemes with filters
- `GET /get-scheme-by-id/:id` - Get specific scheme
- `GET /get-scheme-by-category/:category` - Get schemes by category
- `GET /featured` - Get featured schemes
- `GET /categories` - Get all categories with counts
- `GET /search` - Search schemes by text
- `POST /create` - Create new scheme (Admin)
- `PUT /update/:id` - Update scheme (Admin)
- `DELETE /delete/:id` - Delete scheme (Admin)




### Chatbot API (`/api/v1/ai-chatbot`)
- `POST /chat` - Send message to AI chatbot
- `GET /suggestions` - Get chatbot suggestions
- `GET /categories` - Get scheme categories for chatbot

## Database Models

### Scheme Model
- Title, description, category
- Eligibility criteria (age, income, education, gender, location)
- Benefits, required documents, application process
- Government body, contact information
- Budget, tags, status, views, applications





## Error Handling

The application includes comprehensive error handling:
- Validation errors with detailed messages
- Database errors with appropriate HTTP status codes
- Authentication errors for protected routes
- Global error handler for unexpected errors

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Configured for frontend integration
- **Helmet**: Security headers for protection
- **Input Validation**: All inputs validated using express-validator

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/smart_scheme_db |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGIN` | Allowed origins | localhost:3000, localhost:5500 |

## Development

### Project Structure
```
BE/
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── config.env       # Environment variables
├── package.json     # Dependencies
├── server.js        # Main server file
└── README.md        # Documentation
```

### Adding New Features
1. Create new route files in `routes/`
2. Add corresponding models in `models/` if needed
3. Update `server.js` to include new routes
4. Add validation using express-validator
5. Update documentation

## Testing

The application is ready for testing with tools like:
- Postman
- Insomnia
- Jest (for unit testing)
- Supertest (for integration testing)

## Deployment

### Local Deployment
1. Install dependencies: `npm install`
2. Set environment variables
3. Start MongoDB
4. Run: `npm start`

### Cloud Deployment
1. Set up MongoDB Atlas or cloud database
2. Update `MONGODB_URI` in environment variables
3. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## API Documentation

For detailed API documentation, refer to the individual route files or use tools like Swagger/OpenAPI to generate documentation from the codebase. 