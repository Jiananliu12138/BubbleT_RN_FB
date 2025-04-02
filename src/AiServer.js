// server.js
import keys from '../AiChatCfg.json';

import express, { json } from 'express';
import { post } from 'axios';
import rateLimit from 'express-rate-limit';
require('dotenv').config();

const app = express();
app.use(json());

// Environment variables
const CHATGPT_KEY = keys.AiChatKey;
const DALLE_KEY = keys.AiPicKey; // Assuming same key for both services
const PORT = keys.Prot || 3000;

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Generates tea recommendations using ChatGPT API
 * @param {string[]} materials - Available ingredients
 * @param {string} requirements - User requirements
 * @returns {Promise<object>} Recommendations object
 */
async function generateTeaRecommendations(materials, requirements) {
  const prompt = `
    Act as a professional bubble tea barista. Analyze:
    
    User Requirements: ${requirements}
    Available Ingredients: ${materials.join(', ')}
    
    Respond in this JSON format:
    {
      "existing": [
        {
          "name": "Recipe Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "flavor_profile": {
            "sweetness": "level",
            "texture": "description",
            "taste_notes": ["note1", "note2"]
          },
          "match_reason": "reason"
        }
      ],
      "new": [
        {
          "name": "Innovative Name",
          "required_ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "description": "Sensory description",
          "flavor_profile": {
            "sweetness": "level",
            "texture": "description",
            "taste_notes": ["note1", "note2"]
          }
        }
      ]
    }
  `;

  try {
    const response = await post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATGPT_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('ChatGPT API Error:', error.response?.data);
    throw new Error('Failed to generate recommendations');
  }
}

/**
 * Generates product image using DALL·E API
 * @param {string} description - Beverage description
 * @returns {Promise<string>} Image URL
 */
async function generateBeverageImage(description) {
  try {
    const response = await post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `Professional product photography of bubble tea in transparent glass cup, 
                ultra realistic, studio lighting, 8k resolution, ${description}`,
        n: 1,
        size: "1024x1024",
        quality: "hd"
      },
      {
        headers: {
          'Authorization': `Bearer ${DALLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error('DALL·E API Error:', error.response?.data);
    throw new Error('Image generation failed');
  }
}

// API Endpoints

/**
 * POST /api/recommend
 * Request Body:
 * {
 *   "materials": ["milk", "tapioca"],
 *   "requirements": "creamy texture"
 * }
 */
app.post('/api/recommend', async (req, res) => {
  try {
    const { materials, requirements } = req.body;
    
    // Validate input
    if (!Array.isArray(materials) || !requirements) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Get recommendations
    const recommendations = await generateTeaRecommendations(materials, requirements);
    
    // Generate images for new recommendations
    const newRecommendations = await Promise.all(
      recommendations.new.map(async item => ({
        ...item,
        image: await generateBeverageImage(item.description)
      }))
    );

    res.json({
      existing: recommendations.existing,
      new: newRecommendations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});