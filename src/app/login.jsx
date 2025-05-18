// src/app/login.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { Login } from "../presenters/loginPresenter";

export default observer(function LoginPage() {
  return (
    <View style={{ flex: 1 }}>
      <Login model={reactiveModel} />
    </View>
  );
});