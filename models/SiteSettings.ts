import mongoose from 'mongoose';

export interface ISiteSettings extends mongoose.Document {
  maintenance: {
    isEnabled: boolean;
    message: string;
    allowedIPs: string[];
  };
  registration: {
    isEnabled: boolean;
    requireEmailVerification: boolean;
    allowedDomains: string[];
  };
  rendering: {
    maxConcurrentJobs: number;
    maxFramesPerJob: number;
    allowedFileTypes: string[];
    maxFileSize: number;
    costPerFrame: number;
    priorityMultipliers: {
      low: number;
      normal: number;
      high: number;
    };
  };
  notifications: {
    email: {
      isEnabled: boolean;
      smtpSettings: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
          user: string;
          pass: string;
        };
      };
    };
    discord: {
      isEnabled: boolean;
      webhookUrl: string;
    };
  };
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    allowedOrigins: string[];
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
  };
  storage: {
    provider: 'local' | 's3' | 'gcs';
    settings: {
      bucket?: string;
      region?: string;
      accessKey?: string;
      secretKey?: string;
      endpoint?: string;
    };
    retentionPeriod: number;
  };
  version: string;
  lastUpdated: Date;
}

const siteSettingsSchema = new mongoose.Schema<ISiteSettings>({
  maintenance: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Site is under maintenance. Please check back later.'
    },
    allowedIPs: [{
      type: String
    }]
  },
  registration: {
    isEnabled: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    allowedDomains: [{
      type: String
    }]
  },
  rendering: {
    maxConcurrentJobs: {
      type: Number,
      default: 10,
      min: 1
    },
    maxFramesPerJob: {
      type: Number,
      default: 1000,
      min: 1
    },
    allowedFileTypes: [{
      type: String,
      default: ['.blend']
    }],
    maxFileSize: {
      type: Number,
      default: 1024 * 1024 * 1024 // 1GB
    },
    costPerFrame: {
      type: Number,
      default: 1
    },
    priorityMultipliers: {
      low: {
        type: Number,
        default: 0.8
      },
      normal: {
        type: Number,
        default: 1.0
      },
      high: {
        type: Number,
        default: 1.5
      }
    }
  },
  notifications: {
    email: {
      isEnabled: {
        type: Boolean,
        default: false
      },
      smtpSettings: {
        host: String,
        port: Number,
        secure: Boolean,
        auth: {
          user: String,
          pass: String
        }
      }
    },
    discord: {
      isEnabled: {
        type: Boolean,
        default: false
      },
      webhookUrl: String
    }
  },
  security: {
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 15 * 60 * 1000 // 15 dakika
    },
    sessionTimeout: {
      type: Number,
      default: 24 * 60 * 60 * 1000 // 24 saat
    },
    allowedOrigins: [{
      type: String,
      default: ['http://localhost:3000']
    }],
    rateLimit: {
      windowMs: {
        type: Number,
        default: 15 * 60 * 1000 // 15 dakika
      },
      maxRequests: {
        type: Number,
        default: 100
      }
    }
  },
  storage: {
    provider: {
      type: String,
      enum: ['local', 's3', 'gcs'],
      default: 'local'
    },
    settings: {
      bucket: String,
      region: String,
      accessKey: String,
      secretKey: String,
      endpoint: String
    },
    retentionPeriod: {
      type: Number,
      default: 30 * 24 * 60 * 60 * 1000 // 30 gün
    }
  },
  version: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ayarlar güncellendiğinde lastUpdated'ı güncelle
siteSettingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema); 