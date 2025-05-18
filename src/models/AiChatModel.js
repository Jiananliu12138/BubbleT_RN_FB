import { makeAutoObservable } from 'mobx';

export const AiChatModel = makeAutoObservable({
  // State properties
  chatHistory: [],
  isLoading: false,
  error: null,
  userMaterials: [],

  // Service methods
  setMaterials(materials) {
    this.userMaterials = materials;
  },

  async generateRecommendation(params) {
    try {
      // if (params.type === 'existing_recipes') {
      //   recommendation = [];
      // } else if (params.type === 'new_creations') {
      //   recommendation = data.new[0];
      // }
      const response = await fetch('https://us-central1-id2216-ef6a7.cloudfunctions.net/AiChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materials: this.userMaterials,
          requirements: params.query,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      let recommendation;
      if (params.type === 'existing_recipes') {
        recommendation = data.existing[0];
      } else if (params.type === 'new_creations') {
        recommendation = data.new[0];
      }

      if (!recommendation) {
        throw new Error('No recommendation found for the selected type');
      }

      // 返回包含 base64 图像数据的 recommendation 对象
      return {
        ...recommendation,
        image: recommendation.image //  image 是 base64 编码的字符串
      };
    } catch (error) {
      this.setError(error.message);
      throw error;
    }
  },

  // State management actions
  addMessage(message) {
    this.chatHistory.push(message);
  },

  setLoading(state) {
    this.isLoading = state;
  },

  setError(message) {
    this.error = message;
  }
});