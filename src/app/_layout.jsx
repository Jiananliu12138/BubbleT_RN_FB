import "src/bootstrapping"

import { Text } from "react-native"
//tw3.3 Navigation
import { Tabs } from "expo-router"
//tw3.1
import { observer } from "mobx-react-lite"
import { reactiveModel } from "src/bootstrapping"


export default observer(function RootLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: function renderIndexTabIconACB() {
            return <Text>🍽</Text>
          },
        }}
      />
      <Tabs.Screen
        name="AiChat"
        options={{
          title: "AI",
          tabBarIcon: function renderSearchTabIconACB() {
            return <Text>🔍</Text>
          },
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: function renderSearchTabIconACB() {
            return <Text>🔍</Text>
          },
        }}
      />
    </Tabs>
  )
})
