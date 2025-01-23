import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  email: string;
  name: string | null;
  username: string | null;
  password?: string;
  role: 'user' | 'admin';
  credits: number;
  profilePhoto: string;
  totalRenders: number;
  successRate: number;
  activeNodes: number;
  createdAt: Date;
  lastLogin?: Date;
  recentJobs: Array<any>;
  totalRenderTime?: string;
  averageRenderTime?: string;
  totalFrames?: number;
  failedFrames?: number;
  settings: {
    renderPreferences: {
      priority: 'low' | 'normal' | 'high';
    };
    notifications: {
      onComplete: boolean;
      onFail: boolean;
      onStart: boolean;
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    default: null
  },
  username: {
    type: String,
    trim: true,
    default: null
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  credits: {
    type: Number,
    default: 1000,
    min: 0
  },
  profilePhoto: {
    type: String,
    default: '/images/pfp/duck.jpg'
  },
  totalRenders: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  activeNodes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  recentJobs: [{
    type: mongoose.Schema.Types.Mixed,
    default: []
  }],
  totalRenderTime: {
    type: String
  },
  averageRenderTime: {
    type: String
  },
  totalFrames: {
    type: Number
  },
  failedFrames: {
    type: Number
  },
  settings: {
    renderPreferences: {
      priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal'
      }
    },
    notifications: {
      onComplete: {
        type: Boolean,
        default: true
      },
      onFail: {
        type: Boolean,
        default: true
      },
      onStart: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

// İndeksler
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

// Şifre hashleme middleware
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
