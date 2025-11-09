# Deshswaar - Online Passport Booking System

A comprehensive web application for passport booking, renewal, and status tracking built with modern web technologies.

## 🚀 Features

### For Citizens
- **User Registration & Authentication** - Secure account creation and login
- **Passport Application** - Step-by-step application process for fresh passports and renewals
- **Document Upload** - Secure document submission system
- **Application Tracking** - Real-time status tracking with detailed timeline
- **Dashboard** - Personalized dashboard showing application history and statistics
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### For Administrators
- **Application Management** - Review and process applications
- **Status Updates** - Update application status and add notes
- **User Management** - Manage user accounts and permissions
- **Analytics** - View system statistics and reports

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with flexbox, grid, and animations
- **Vanilla JavaScript** - Clean, dependency-free JavaScript
- **Font Awesome** - Professional icons
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Request rate limiting

## 📁 Project Structure

```
deshswaar-passport-system/
├── backend/
│   ├── models/
│   │   ├── User.js              # User data model
│   │   └── Application.js       # Application data model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── applications.js     # Application management routes
│   ├── package.json            # Backend dependencies
│   └── server.js              # Express server configuration
├── frontend/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   ├── forms.css          # Form styles
│   │   ├── dashboard.css      # Dashboard styles
│   │   └── track.css          # Tracking page styles
│   ├── js/
│   │   ├── main.js            # Main JavaScript functionality
│   │   ├── auth.js            # Authentication handling
│   │   ├── application.js     # Application form handling
│   │   ├── dashboard.js       # Dashboard functionality
│   │   └── track.js           # Application tracking
│   ├── images/                # Static images
│   ├── index.html            # Landing page
│   ├── login.html            # User login
│   ├── register.html         # User registration
│   ├── apply.html            # Application form
│   ├── dashboard.html        # User dashboard
│   └── track.html            # Application tracking
└── README.md                 # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd deshswaar-passport-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/deshswaar_passport

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (use a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (varies by OS)
# Windows: Run MongoDB service
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod
```

### 5. Start the Application
```bash
# In the backend directory
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## 📱 Using the Application

### For New Users
1. **Register**: Visit the registration page and create an account
2. **Login**: Use your credentials to log into the system
3. **Apply**: Fill out the passport application form
4. **Track**: Monitor your application status using the tracking page

### Sample Application Numbers for Testing
- `DESH12345678901` (DOB: 1990-05-15) - 5 days old application
- `DESH23456789012` (DOB: 1985-08-22) - 15 days old application

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds for secure password storage
- **JWT Authentication** - Stateless authentication with secure tokens
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **Helmet Security** - Sets various HTTP headers for security
- **Input Validation** - Comprehensive validation on both frontend and backend
- **CORS Protection** - Controlled cross-origin resource sharing

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Progressive Forms** - Step-by-step application process
- **Real-time Validation** - Instant feedback on form inputs
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages
- **Accessibility** - ARIA labels and keyboard navigation support

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Applications
- `POST /api/applications/submit` - Submit new application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/:applicationNo` - Get specific application
- `POST /api/applications/track` - Track application (public)
- `PUT /api/applications/:applicationNo/status` - Update application status
- `GET /api/applications/stats/summary` - Get application statistics

### System
- `GET /api/health` - Health check endpoint

## 🧪 Testing

### Manual Testing
1. **Registration Flow**
   - Create new account with valid details
   - Test validation for invalid inputs
   - Verify email uniqueness

2. **Login Flow**
   - Login with correct credentials
   - Test invalid credentials
   - Check token persistence

3. **Application Submission**
   - Fill out complete application form
   - Test form validation
   - Verify application number generation

4. **Application Tracking**
   - Track application with valid details
   - Test with invalid application numbers
   - Verify timeline generation

### Sample Test Cases
```javascript
// Sample API test using curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://yourdomain.com
PORT=80
```

### Deployment Checklist
- [ ] Set secure JWT secret
- [ ] Configure production MongoDB
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- User registration and authentication
- Passport application submission
- Application tracking system
- Responsive web interface
- REST API implementation

### Future Versions
- Payment integration
- Document upload with file storage
- Email notifications
- Admin panel
- Advanced reporting
- Mobile application

---

**Deshswaar Passport System** - Making passport services accessible to all citizens 🇮🇳