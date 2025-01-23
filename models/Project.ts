import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  filename: string;
  userId: string;
  status: string;
  uploadDate: Date;
  filePath: string;
  settings: {
    isAnimation: boolean;
    startFrame: number;
    endFrame: number;
    renderEngine: string;
    renderDevice: string;
    samples: number;
    resolution: {
      x: number;
      y: number;
      percentage: number;
    };
  };
  progress?: number;
  renderedFrames?: number;
  totalFrames?: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['uploaded', 'queued', 'rendering', 'completed', 'failed', 'cancelled'],
    default: 'uploaded',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  filePath: {
    type: String,
    required: true,
  },
  settings: {
    isAnimation: {
      type: Boolean,
      default: false,
    },
    startFrame: {
      type: Number,
      default: 1,
    },
    endFrame: {
      type: Number,
      default: 1,
    },
    renderEngine: {
      type: String,
      enum: ['CYCLES', 'EEVEE', 'WORKBENCH'],
      default: 'CYCLES',
    },
    renderDevice: {
      type: String,
      enum: ['CPU', 'GPU'],
      default: 'CPU',
    },
    samples: {
      type: Number,
      default: 128,
    },
    resolution: {
      x: {
        type: Number,
        default: 1920,
      },
      y: {
        type: Number,
        default: 1080,
      },
      percentage: {
        type: Number,
        default: 100,
      },
    },
  },
  progress: {
    type: Number,
    default: 0,
  },
  renderedFrames: {
    type: Number,
    default: 0,
  },
  totalFrames: {
    type: Number,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

// İndeksler
ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ uploadDate: -1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema); 