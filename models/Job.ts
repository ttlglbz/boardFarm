import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
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
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startTime: Date,
  endTime: Date,
  error: String,
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: () => new Map()
  },
  result: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: () => new Map()
  }
}, {
  timestamps: true
});

// İndeksler
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job; 