import mongoose from 'mongoose';

export interface IRenderer extends mongoose.Document {
  userId: string;
  name: string;
  status: 'active' | 'idle' | 'offline' | 'maintenance';
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
  };
  performance: {
    cpuUsage: number;
    ramUsage: number;
    temperature: number;
  };
  currentJob?: {
    id: string;
    name: string;
    progress: number;
  };
  lastSeen: Date;
  totalRenders: number;
  uptime: string;
  createdAt: Date;
  updatedAt: Date;
}

const rendererSchema = new mongoose.Schema<IRenderer>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'idle', 'offline', 'maintenance'],
    default: 'offline'
  },
  specs: {
    cpu: {
      type: String,
      required: true
    },
    ram: {
      type: String,
      required: true
    },
    gpu: {
      type: String,
      required: true
    }
  },
  performance: {
    cpuUsage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    ramUsage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    temperature: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  currentJob: {
    id: String,
    name: String,
    progress: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  totalRenders: {
    type: Number,
    default: 0
  },
  uptime: {
    type: String,
    default: '0%'
  }
}, {
  timestamps: true
});

// İndeksler
rendererSchema.index({ userId: 1, status: 1 });
rendererSchema.index({ createdAt: 1 });
rendererSchema.index({ lastSeen: 1 });

const Renderer = mongoose.models.Renderer || mongoose.model<IRenderer>('Renderer', rendererSchema);

export default Renderer; 