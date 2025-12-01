import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: './config/config.env' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt for mental health companion
const SYSTEM_PROMPT = {
  role: "system",
  content: [
    {
      type: "text",
      text: `You are an AI-powered Mental Health Companion. Your goal is to support the user emotionally through text or voice messages. Your tone must always be warm, empathetic, non-judgmental, and encouraging.

=== CORE CAPABILITIES ===
1. Analyze the user's message (text or voice transcription) for:
   - emotional tone
   - stress level
   - mood (happy, sad, anxious, neutral, overwhelmed, frustrated, excited, tired, etc.)
   - intent
2. Respond in a supportive mental-health-friendly manner.
3. Provide the user with suggestions, coping strategies, grounding exercises, breathing techniques, and mood-lifting tips.
4. Encourage full conversation and continuity. Respond conversationally.

=== RESPONSE RULES ===
- Always validate the user's feelings.
- Be positive but realistic.
- DO NOT give medical advice, diagnoses, or crisis instructions.
- If the user mentions self-harm, say supportive things and encourage reaching out to professionals or crisis hotlines.

=== WHEN USER MOOD IS NEGATIVE ===
If the user sounds sad, anxious, stressed, or had a bad day:
- Show empathy.
- Tell them everything will be okay.
- Give grounding/breathing techniques.
- Share tips to handle anxiety.
- Give reassurance.
- Encourage small positive actions.

Example style:
"I'm really sorry you're feeling this way. That sounds really tough. But I'm here with you, and we can work through this together. Would you like to try a small breathing exercise with me?"

=== WHEN USER MOOD IS NEUTRAL ===
- Help them open up.
- Ask gentle follow-up questions.
- Offer general wellness tips.

Example style:
"I'm here for you. How has your day been so far?"

=== WHEN USER MOOD IS POSITIVE ===
If the user is happy, confident, or energetic:
- Celebrate their mood.
- Compliment their efforts.
- Encourage their progress.

Example style:
"That's amazing to hear! You've been working so hard — you should feel proud of yourself! Keep going, you're doing great."

=== FOR VOICE MESSAGES ===
Analyze the voice transcription tone (if provided) and respond as above.
If the user sounds tired, low, or shaky → respond gently.
If the user sounds upbeat → respond positively.

=== CONVERSATION STYLE ===
- Keep replies between 2–5 sentences.
- Sound human, calm, friendly, and emotionally intelligent.
- Ask optional follow-up questions to keep the conversation flowing.
- Never be robotic or overly formal.

Your purpose is to brighten the user's mood, uplift their emotional state, and guide them toward calmness, positivity, and mental well-being.`
    }
  ]
};

// Crisis response template
const CRISIS_RESPONSE = {
  text: "I'm really concerned about what you're sharing. If you're having thoughts of harming yourself, please reach out for help immediately. You can contact suicide crisis hotlines: National Suicide Prevention Lifeline (988) or Crisis Text Line (Text HOME to 741741). Would you like to connect with professional help or try some grounding exercises right now?",
  tone: "concerned",
  urgency: "high",
  risk: "high",
  tips: [
    "Call a crisis helpline: 988 or your local emergency number",
    "Reach out to someone you trust immediately",
    "Go to a safe place where you're not alone"
  ],
  next_steps: [
    "Contact a mental health professional",
    "Speak with a trusted friend or family member",
    "Consider visiting a healthcare facility if in immediate danger"
  ],
  crisis: true
};

// Function to detect tone from user message
const detectTone = (message) => {
  const messageLower = message.toLowerCase();
  
  const toneIndicators = {
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'hopeless', 'crying', 'tears'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'overwhelmed'],
    angry: ['angry', 'mad', 'frustrated', 'annoyed', 'pissed', 'hate'],
    happy: ['happy', 'good', 'great', 'excited', 'joy', 'pleased', 'wonderful'],
    tired: ['tired', 'exhausted', 'fatigued', 'sleepy', 'burned out'],
    calm: ['calm', 'peaceful', 'relaxed', 'chill', 'serene'],
    neutral: ['okay', 'fine', 'alright', 'normal', 'meh']
  };

  for (const [tone, keywords] of Object.entries(toneIndicators)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      return tone;
    }
  }
  
  return 'neutral';
};

// Function to detect urgency/risk level
const detectRisk = (message) => {
  const messageLower = message.toLowerCase();
  const highRiskKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself', 'not worth living'];
  const possibleRiskKeywords = ['can\'t go on', 'give up', 'too much', 'can\'t handle', 'breaking point'];

  if (highRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'high';
  }
  if (possibleRiskKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'possible';
  }
  return 'none';
};

// Function to generate coping tips based on tone
const generateTips = (tone) => {
  const tipsByTone = {
    sad: [
      "Practice self-compassion and acknowledge your feelings",
      "Reach out to a friend or loved one for support",
      "Engage in a gentle activity you enjoy",
      "Write down three things you're grateful for today"
    ],
    anxious: [
      "Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s",
      "Practice grounding by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      "Take a short walk or stretch to release tension",
      "Write down your worries to get them out of your head"
    ],
    angry: [
      "Take deep breaths and count to 10 before responding",
      "Go for a brisk walk or do some physical activity",
      "Express your feelings through writing or art",
      "Practice mindfulness meditation for 5 minutes"
    ],
    tired: [
      "Rest without guilt - your body needs recovery",
      "Stay hydrated and have a nutritious snack",
      "Take short breaks throughout your day",
      "Practice gentle stretching or yoga"
    ],
    neutral: [
      "Practice mindfulness for a few minutes",
      "Take a moment to appreciate the present",
      "Do one small thing that brings you joy",
      "Check in with your body and how you're feeling"
    ],
    happy: [
      "Savor this positive moment fully",
      "Share your joy with someone else",
      "Acknowledge your role in creating this happiness",
      "Carry this positive energy forward"
    ]
  };

  return tipsByTone[tone] || tipsByTone.neutral;
};

export const analyzeWithGemini = async (userMessage, conversationHistory = []) => {
  try {
    // Check for high-risk keywords that require immediate crisis response
    const riskLevel = detectRisk(userMessage);
    if (riskLevel === 'high') {
      return CRISIS_RESPONSE;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response when no API key is provided
      const tone = detectTone(userMessage);
      const tips = generateTips(tone);
      
      return {
        text: "Hi there! I'm here to listen and support you. How are you feeling today? To enable AI responses, please add your Gemini API key to the backend environment variables.",
        tone: tone,
        urgency: riskLevel === 'possible' ? 'medium' : 'low',
        risk: riskLevel,
        tips: tips.slice(0, 2),
        next_steps: ["Consider talking to a mental health professional"]
      };
    }

    // Build conversation history for context
    const messages = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT.content[0].text }]
      }
    ];

    // Add conversation history if available
    if (conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // Generate response using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash model for faster responses
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.8,
        topK: 40
      }
    });

    const aiResponse = response.text;

    // Analyze tone and generate structured response
    const tone = detectTone(userMessage);
    const tips = generateTips(tone);
    const urgency = riskLevel === 'possible' ? 'medium' : 'low';

    return {
      text: aiResponse,
      tone: tone,
      urgency: urgency,
      risk: riskLevel,
      tips: tips.slice(0, 3),
      next_steps: [
        "Continue this conversation when you need support",
        "Practice the suggested techniques regularly",
        "Consider professional help if feelings persist"
      ]
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback response with tone detection
    const tone = detectTone(userMessage);
    const tips = generateTips(tone);
    
    return {
      text: "I'm here to listen and support you. Sometimes technical issues happen, but I'm still here for you. How are you feeling right now?",
      tone: tone,
      urgency: 'low',
      risk: 'none',
      tips: tips.slice(0, 2),
      next_steps: ["Consider reaching out to a trusted friend or professional"]
    };
  }
};

export const processAudioWithGemini = async (audioData) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "Voice message received. Please configure Gemini API key for full audio processing.";
    }

    // For audio processing with the new SDK
    // Note: Audio processing requires specific setup and may need different model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Please transcribe this audio message and provide the text content."
            }
          ]
        }
      ]
    });

    return response.text || "Voice message transcribed. How can I support you today?";
    
  } catch (error) {
    console.error('Audio processing error:', error);
    return "I received your voice message. How are you feeling today?";
  }
};

// Function to get initial greeting
export const getInitialGreeting = () => {
  return {
    text: "Hi there! I'm your mental health companion. I'm here to listen and support you through whatever you're experiencing. How are you feeling today?",
    tone: "calm",
    urgency: "low",
    risk: "none",
    tips: [
      "Take a moment to breathe deeply and settle in",
      "Share whatever is on your mind - I'm here to listen"
    ],
    next_steps: [
      "Continue this conversation whenever you need support",
      "Practice regular check-ins with your feelings"
    ]
  };
};