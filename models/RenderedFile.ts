import mongoose from 'mongoose';

export interface IRenderedFile extends mongoose.Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  frame: number;
  rendererId: mongoose.Types.ObjectId;
  path: string;
  size: number;
  format: string;
  resolution: string;
  samples: number;
  renderTime: string;
  metadata: {
    device: string;
    engineVersion: string;
    renderSettings: Record<string, any>;
  };
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  preview?: string;
  checksum: string;
  downloadCount: number;
  expiresAt: Date;
}

const renderedFileSchema = new mongoose.Schema<IRenderedFile>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  frame: {
    type: Number,
    required: true
  },
  rendererId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Renderer',
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  resolution: {
    type: String,
    required: true
  },
  samples: {
    type: Number,
    required: true
  },
  renderTime: {
    type: String,
    required: true
  },
  metadata: {
    device: {
      type: String,
      required: true
    },
    engineVersion: {
      type: String,
      required: true
    },
    renderSettings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  status: {
    type: String,
    enum: ['pending', 'uploading', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String
  },
  preview: {
    type: String
  },
  checksum: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// İndeks oluştur
renderedFileSchema.index({ jobId: 1, frame: 1 }, { unique: true });
renderedFileSchema.index({ userId: 1 });
renderedFileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Dosya boyutunu formatla
renderedFileSchema.virtual('formattedSize').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (this.size === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(this.size) / Math.log(1024)).toString());
  return Math.round(this.size / Math.pow(1024, i)) + ' ' + sizes[i];
});

export default mongoose.models.RenderedFile || mongoose.model<IRenderedFile>('RenderedFile', renderedFileSchema); 