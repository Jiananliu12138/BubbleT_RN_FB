import { Text, Button, View } from "react-native";
import { Tabs } from "expo-router"
import { reactiveModel } from "/src/bootstrapping"  // src/boostrapping also works
  
// TODO pass reactive model down to presenters
export default function IndexPage() { 
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Hello React Native Test!</Text>
          {/* <Button
            title="AiChat"
            onPress={() => router.push("/AiChat")}
          /> */}
        </View>
      );
}