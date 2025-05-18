import { observer } from "mobx-react-lite";
import { AiChatView } from "../views/AiChatView";

export const AiChatPresenter = observer(function AiChatPresenter(props) {
  const { AiChatModel } = props;

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
        image: recommendation.image // 使用 base64 编码的 image 字段
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