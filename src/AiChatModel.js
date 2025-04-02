// AiChatModel.js

export const AiChatModel = {
  // State properties
  /**
   * @type {Array} chatHistory - Stores conversation history
   * @property {Object} chatHistory.items - Message objects
   * @property {boolean} items.isUser - User/AI message flag
   * @property {string} items.content - Message content
   * @property {string} items.image - Optional image URL
   */
  chatHistory: [],
  isLoading: false,
  error: null,
  userRequirements: '',
  userMaterials: [],
  
  // Data storage
  /**
   * @type {Object} recommendations - Generated suggestions
   * @property {Array} existingRecipes - Matching recipes
   * @property {Array} newSuggestions - AI-generated creations
   */
  recommendations: {
    existingRecipes: [],
    newSuggestions: []
  },
  
  // Service methods
  /**
   * Updates available ingredients
   * @param {Array<string>} materials - New ingredients list
   */
  setMaterials(materials) {
    this.userMaterials = materials;
  },

  /**
   * Generates drink recommendations
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Generated recommendations
   */
  async generateRecommendation(params) {
    try {
    //   const response = await server.generateRecommendation({
    //     materials: this.userMaterials,
    //     requirements: params.query,
    //     type: params.type
    //   });
      
    //   this.recommendations = response;
      return response;
      
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // State management actions
  /**
   * Adds message to chat history
   * @param {Object} message - Message object
   */
  addMessage(message) {
    this.chatHistory.push(message);
  },

  /**
   * Handles errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    this.error = error.message;
    console.error('Chat Error:', error);
  },

  // Utility methods
  /**
   * Updates loading state
   * @param {boolean} state - New loading state
   */
  setLoading(state) {
    this.isLoading = state;
  },

  /**
   * Updates error state
   * @param {?string} message - Error message
   */
  setError(message) {
    this.error = message;
  }
};