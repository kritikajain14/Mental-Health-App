import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    enum: ['calm', 'sad', 'anxious', 'angry', 'neutral', 'overwhelmed', 'hopeless'],
    default: 'neutral'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  risk: {
    type: String,
    enum: ['none', 'possible', 'high'],
    default: 'none'
  },
  tips: [String],
  nextSteps: [String],
  isAudio: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);