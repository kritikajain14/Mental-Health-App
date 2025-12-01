import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentDate: {
    type: Date,
    default: Date.now
  },
  completedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  totalTasks: {
    type: Number,
    default: 0
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0
  },
  lastCompletedDate: {
    type: Date
  }
});

export default mongoose.model('DailyProgress', dailyProgressSchema);