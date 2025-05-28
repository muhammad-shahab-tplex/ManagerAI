import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IWorkingHours {
  start: string;
  end: string;
}

interface IPreferences {
  emailFrequency: 'realtime' | 'hourly' | 'daily';
  autoReplyEnabled: boolean;
  autoReplyConfidenceThreshold: number;
  workingHours: IWorkingHours;
  timezone: string;
}

interface ITokens {
  access?: string;
  refresh?: string;
  expiry?: Date;
}

interface IIntegrationConfig {
  connected: boolean;
  tokens: ITokens;
}

interface IIntegrations {
  google: IIntegrationConfig;
  microsoft: IIntegrationConfig;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscriptionTier: 'free' | 'pro' | 'elite';
  googleId?: string;
  microsoftId?: string;
  preferences: IPreferences;
  integrations: IIntegrations;
  toneProfile: any[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
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
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(this: IUser): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User; 