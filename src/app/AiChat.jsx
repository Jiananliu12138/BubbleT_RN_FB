import { reactiveModel,  reactAiChatModel} from "src/bootstrapping"
import { Text, Button, View } from "react-native";
import { AiChatPresenter } from "src/presenters/AiChatPresenter"

export default function AiChat() {
    return <AiChatPresenter AiChatModel={reactAiChatModel} />
  }