// AiChatPresenter.js
import { observer } from "mobx-react-lite";
import { AiChatView } from "../views/AiChatView";

/**
 * Presenter component for AI Chat feature
 * Handles business logic and coordinates between View and Model
 */
export const AiChatPresenter = observer(function AiChat(props) {
  /**
   * Handles message submission and recommendation generation
   * @param {Object} params - User input parameters
   * @param {string} params.query - User's text input
   * @param {string} params.type - Selected recommendation type
   */
  const { AiChatModel } = props
  const handleSend = async (params) => {
    try {
      AiChatModel.setLoading(true);
      
      // Add user message to chat history
      AiChatModel.addMessage({
        id: Date.now(),
        isUser: true,
        content: params.query,
        type: params.type
      });

      // Generate recommendations through model
      const recommendation = await AiChatModel.generateRecommendation(params);
      
      // Add AI response to chat history
      AiChatModel.addMessage({
        id: `rec_${Date.now()}`,
        isUser: false,
        content: recommendation,
        image: recommendation.imageUrl
      });

    } catch (error) {
      AiChatModel.setError(error.message);
    } finally {
      AiChatModel.setLoading(false);
    }
  };

  return (
    <AiChatView
      chatHistory={AiChatModel.chatHistory}
      isLoading={AiChatModel.isLoading}
      error={AiChatModel.error}
      onSend={handleSend}
    />
  );
});