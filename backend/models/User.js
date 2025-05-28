const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'elite'],
    default: 'free'
  },
  googleId: {
    type: String
  },
  microsoftId: {
    type: String
  },
  preferences: {
    emailFrequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily'],
      default: 'daily'
    },
    autoReplyEnabled: {
      type: Boolean,
      default: false
    },
    autoReplyConfidenceThreshold: {
      type: Number,
      default: 0.85
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '17:00'
      }
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  integrations: {
    google: {
      connected: {
        type: Boolean,
        default: false
      },
      tokens: {
        access: String,
        refresh: String,
        expiry: Date
      }
    },
    microsoft: {
      connected: {
        type: Boolean,
        default: false
      },
      tokens: {
        access: String,
        refresh: String,
        expiry: Date
      }
    }
  },
  toneProfile: {
    type: Array,
    default: []
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 