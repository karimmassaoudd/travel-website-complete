# TravelWorld - Complete Travel Website

A fully functional travel booking website with user authentication and MongoDB integration.

## Features

✅ **User Authentication**
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt

✅ **Booking System**
- Complete booking flow with multiple steps
- Guest and authenticated user bookings
- MongoDB data persistence
- Booking confirmation with reference numbers

✅ **Responsive Design**
- Mobile-friendly interface
- Modern CSS styling
- Interactive user experience

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service)

### Installation

1. **Extract the project files**
   ```bash
   # All dependencies are already included in node_modules
   ```

2. **Start MongoDB**
   ```bash
   # For local MongoDB installation:
   sudo systemctl start mongod
   
   # Or if using MongoDB Community Edition:
   brew services start mongodb/brew/mongodb-community
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Access the website**
   Open your browser and go to: `http://localhost:3000`

## Environment Configuration

The `.env` file contains default settings:
- MongoDB URI: `mongodb://localhost:27017/travel-website`
- JWT Secret: Change this in production
- Port: 3000

## Testing the Website

### Test User Registration/Login:
1. Go to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Fill in the registration form
4. After registration, you'll be automatically logged in

### Test Booking System:
1. Click "Book Now"
2. Select a destination (e.g., Bali, Indonesia)
3. Choose travel dates and package
4. Fill in personal information
5. Complete the booking process
6. You'll receive a booking confirmation with reference number

## Project Structure

```
travel-website-complete/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── models/
│   ├── user.js           # User model with authentication
│   └── booking.js        # Booking model
├── routes/
│   ├── users.js          # Authentication routes
│   └── bookings.js       # Booking routes
├── public/
│   ├── index.html        # Homepage
│   ├── login.html        # Login page
│   ├── signup.html       # Registration page
│   ├── booking.html      # Booking page
│   ├── css/              # Stylesheets
│   ├── js/               # Frontend JavaScript
│   └── images/           # Image assets
└── node_modules/         # Dependencies (included)
```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/user` - Get user profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get specific booking
- `GET /api/bookings/reference/:ref` - Get booking by reference

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check the MongoDB URI in `.env` file
- Verify MongoDB is accessible on port 27017

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 3000: `sudo lsof -ti:3000 | xargs kill -9`

### Dependencies Issues
- All dependencies are included in `node_modules`
- If needed, run: `npm install`

## Security Notes

⚠️ **Important for Production:**
- Change the JWT_SECRET in `.env`
- Use environment variables for sensitive data
- Enable HTTPS
- Implement rate limiting
- Add input sanitization

## Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify MongoDB is running
3. Ensure all files are properly extracted
4. Check that port 3000 is available

---

**Status: ✅ FULLY FUNCTIONAL**
- ✅ User registration and login working
- ✅ Booking system saving to MongoDB
- ✅ All dependencies included
- ✅ Ready to run out of the box

