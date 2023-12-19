const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./src/models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Require dotenv and load the .env file
require("dotenv").config();

// Use environment variables in your code
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const app = express();

// Connect to MongoDB
connectDB().catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

// Middleware: Body parsing middleware to handle JSON data
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Generate a secret key for JWT
const secretKey = crypto.randomBytes(64).toString("hex");

// Passport JWT Strategy (for JWT authentication)
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "https://www.googleapis.com/auth/gmail.readonly"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Handle Google authentication logic and user creation if needed
        // Example: Check if the user exists or create a new one
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            picture: profile.photos[0].value,
            // Add other necessary user details
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Initialize Passport
app.use(passport.initialize());

// trigger auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// Google OAuth Callback Route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    session: false,
  }),
  (req, res) => {
    // Assuming 'req.user' contains the authenticated user after Google authentication
    const { _id, googleId, name } = req.user;
    // Create a payload for the JWT token
    const payload = {
      sub: _id,
      googleId: googleId,
      name: name,
      // Add other necessary data to be included in the token
    };

    // Sign the JWT token with the secret key
    jwt.sign(payload, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        // Handle error while signing the token
        res.status(500).json({ error: "Failed to generate token" });
      } else {
        /* old method didnt work(cuz cant fetch(CORS) from front end, and takes to google api) Send the JWT token back to the client
            res.json({ token, name });  */
        // Redirect the user to the desired frontend page with the token as a query parameter
        res.redirect(
          `http://localhost:8080/todoapp.html?token=${encodeURIComponent(
            token
          )}`
        );
      }
    });
  }
);
app.get("/logout", (req, res) => {
  // Respond with a success message or appropriate response
  res.json({ message: "Logged out successfully" });
});

// API Routes (Tasks, Users, etc.)
const tasksRoutes = require("./src/routes/tasks");
app.use("/tasks", tasksRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
