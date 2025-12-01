import express from 'express';
import auth from '../middleware/auth.js';
import { analyzeWithGemini, processAudioWithGemini } from '../utils/geminiClient.js';
import Message from '../models/Message.js';
import User from '../models/User.js';


const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Send message to AI
router.post('/send', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const userId = req.userId;

    // Analyze with Gemini
    const aiResponse = await analyzeWithGemini(message, conversationHistory);

    // Save message to database
    const userMessage = new Message({
      userId,
      sender: 'user',
      text: message,
      tone: aiResponse.tone,
      timestamp: new Date()
    });

    const aiMessage = new Message({
      userId,
      sender: 'ai',
      text: aiResponse.text,
      tone: aiResponse.tone,
      tips: aiResponse.tips,
      nextSteps: aiResponse.next_steps,
      urgency: aiResponse.urgency,
      risk: aiResponse.risk,
      timestamp: new Date()
    });

    await Promise.all([userMessage.save(), aiMessage.save()]);

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.to(userId).emit('new_message', {
      sender: 'ai',
      text: aiResponse.text,
      tone: aiResponse.tone,
      tips: aiResponse.tips,
      nextSteps: aiResponse.next_steps,
      urgency: aiResponse.urgency,
      risk: aiResponse.risk,
      timestamp: new Date()
    });

    res.json(aiResponse);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      message: 'Error processing message',
      error: error.message 
    });
  }
});

// Process audio message
router.post('/voice', async (req, res) => {
  try {
    const { audioData, conversationHistory = [] } = req.body;
    const userId = req.userId;

    // Process audio with Gemini
    const transcription = await processAudioWithGemini(audioData);
    
    if (!transcription) {
      return res.status(400).json({ message: 'Could not process audio' });
    }

    // Analyze transcribed text
    const aiResponse = await analyzeWithGemini(transcription, conversationHistory);

    // Save messages to database
    const userMessage = new Message({
      userId,
      sender: 'user',
      text: transcription,
      isAudio: true,
      tone: aiResponse.tone,
      timestamp: new Date()
    });

    const aiMessage = new Message({
      userId,
      sender: 'ai',
      text: aiResponse.text,
      tone: aiResponse.tone,
      tips: aiResponse.tips,
      nextSteps: aiResponse.next_steps,
      urgency: aiResponse.urgency,
      risk: aiResponse.risk,
      timestamp: new Date()
    });

    await Promise.all([userMessage.save(), aiMessage.save()]);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(userId).emit('new_message', {
      sender: 'ai',
      text: aiResponse.text,
      tone: aiResponse.tone,
      tips: aiResponse.tips,
      nextSteps: aiResponse.next_steps,
      urgency: aiResponse.urgency,
      risk: aiResponse.risk,
      timestamp: new Date()
    });

    res.json({
      transcription,
      aiResponse
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({ 
      message: 'Error processing audio',
      error: error.message 
    });
  }
});

// Get user profile and chat history
router.get('/profile', async (req, res) => {
  try {
    const userId = req.userId;

    // Guard: ensure auth middleware set the userId
    if (!userId) {
      console.error('Profile error: missing req.userId (unauthorized)');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userProfile = await User.findById(userId).select('-passwordHash');

    if (!userProfile) {
      console.error(`Profile error: user not found for id=${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      user: userProfile,
      recentMessages: messages.reverse()
    });
  } catch (error) {
    // Log full stack for easier debugging (remove in production)
    console.error('Profile error:', error?.stack || error);
    res.status(500).json({ message: 'Server error', error: error?.message });
  }
});

export default router;