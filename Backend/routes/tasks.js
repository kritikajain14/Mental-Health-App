import express from 'express';
import auth from '../middleware/auth.js';
import Task from '../models/Task.js';
import DailyProgress from '../models/DailyProgress.js';

const router = express.Router();

// Get all categories and subcategories
router.get('/categories', auth, (req, res) => {
  const categories = [
    {
      name: "Hygiene",
      subCategories: [
        "Take a bath",
        "Brush your teeth",
        "Trim your nails",
        "Wash your face",
        "Clean your room",
        "Do laundry"
      ]
    },
    {
      name: "Growth",
      subCategories: [
        "Read 10 pages of a book",
        "Learn a new skill",
        "Watch an educational video",
        "Practice coding for 30 minutes",
        "Practice a new language"
      ]
    },
    {
      name: "Self Help",
      subCategories: [
        "Meditate for 10 minutes",
        "Do deep breathing",
        "Write a gratitude list",
        "Journal your thoughts",
        "Say you love yourself"
      ]
    },
    {
      name: "Business",
      subCategories: [
        "Check emails",
        "Plan your day",
        "Work on pending tasks",
        "Review monthly goals",
        "Network with a colleague",
        "Complete your project",
        "Meet the deadlines"
      ]
    },
    {
      name: "Discipline",
      subCategories: [
        "Wake up early",
        "Limit phone usage",
        "Follow your schedule",
        "Avoid procrastination"
      ]
    }
  ];

  res.json(categories);
});

// Get user's tasks for today
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get or create daily progress
    let progress = await DailyProgress.findOne({ userId: req.userId });
    if (!progress) {
      progress = new DailyProgress({ userId: req.userId });
      await progress.save();
    }

    // Update progress
    const completedTasks = tasks.filter(task => task.completed);
    progress.totalTasks = tasks.length;
    progress.completedTasks = completedTasks.map(task => task._id);
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (completedTasks.length === tasks.length && tasks.length > 0) {
      if (progress.lastCompletedDate && 
          progress.lastCompletedDate.toDateString() === yesterday.toDateString()) {
        progress.streak += 1;
      } else if (!progress.lastCompletedDate || 
                 progress.lastCompletedDate.toDateString() !== today.toDateString()) {
        progress.streak = 1;
      }
      progress.lastCompletedDate = today;
    }
    
    await progress.save();

    res.json({
      tasks,
      progress: {
        completed: completedTasks.length,
        total: tasks.length,
        percentage: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
        streak: progress.streak,
        rewardClaimed: progress.rewardClaimed
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new tasks
router.post('/create', auth, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.userId;

    // Clear existing tasks for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Task.deleteMany({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Create new tasks
    const createdTasks = await Task.insertMany(
      tasks.map(task => ({
        userId,
        title: task.title,
        category: task.category,
        subCategory: task.subCategory,
        custom: task.custom || false,
        date: today
      }))
    );

    // Reset daily progress
    await DailyProgress.findOneAndUpdate(
      { userId },
      { 
        totalTasks: createdTasks.length,
        completedTasks: [],
        rewardClaimed: false
      },
      { upsert: true }
    );

    res.json(createdTasks);
  } catch (error) {
    console.error('Error creating tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle task completion
router.patch('/:taskId/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();

    // Update progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const completedTasks = tasks.filter(t => t.completed);
    const progress = await DailyProgress.findOne({ userId: req.userId });
    
    if (progress) {
      progress.completedTasks = completedTasks.map(t => t._id);
      progress.totalTasks = tasks.length;
      await progress.save();
    }

    res.json({
      task,
      progress: {
        completed: completedTasks.length,
        total: tasks.length,
        percentage: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add custom task
router.post('/custom', auth, async (req, res) => {
  try {
    const { title, category } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const task = new Task({
      userId: req.userId,
      title,
      category: category || 'Custom',
      subCategory: 'Custom',
      custom: true,
      date: today
    });

    await task.save();

    // Update progress total tasks
    const progress = await DailyProgress.findOne({ userId: req.userId });
    if (progress) {
      progress.totalTasks += 1;
      await progress.save();
    }

    res.json(task);
  } catch (error) {
    console.error('Error adding custom task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim reward
router.post('/claim-reward', auth, async (req, res) => {
  try {
    const progress = await DailyProgress.findOne({ userId: req.userId });
    
    if (!progress) {
      return res.status(400).json({ message: 'No progress found' });
    }

    // Check if all tasks are completed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const allCompleted = tasks.length > 0 && tasks.every(task => task.completed);
    
    if (!allCompleted) {
      return res.status(400).json({ message: 'Complete all tasks to claim reward' });
    }

    if (progress.rewardClaimed) {
      return res.status(400).json({ message: 'Reward already claimed today' });
    }

    progress.rewardClaimed = true;
    await progress.save();

    const quotes = [
      "Life is tough and things don’t always work out well, but we should be brave and go on with our lives .You did amazing today! Your consistency is inspiring.",
      "Those who keep trying without giving up are the ones who succeed. Small steps every day lead to big results. You're making progress!",
      "Don't be trapped in someone else's dream. Be proud of yourself — you showed incredible discipline today!",
      "When things get tough, look at the people who love you! You will get energy from them .Great job! Keep going, you're building amazing habits!",
      "Never give up on a dream that you’ve been chasing almost your whole life. Consistency is the key — and you absolutely nailed it today!",
      "To the world, you may be one person. But to one person, you may be the world . Wow! Look at you go! Your dedication is truly remarkable.",
      "To lose your path is the way to find that path . Every task completed is a step toward a better you. Fantastic work!",
      "I think the biggest love is the love for oneself, so if you want to love others, you should love yourself first . You're building the life you want, one task at a time. Amazing!",
      "Life is fork , I am soup . Your commitment to self-improvement is truly inspiring. Keep shining!",
      "Don’t ever be scared Whatever people say, you’re okay. Today you showed what you're made of - pure determination and greatness!"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.json({
      message: 'Reward claimed successfully!',
      quote: randomQuote,
      streak: progress.streak
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;