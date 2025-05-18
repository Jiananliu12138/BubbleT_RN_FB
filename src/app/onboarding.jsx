// src/app/onboarding.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { Onboarding } from "../presenters/onboardingPresenter";

export default observer(function OnboardingPage() {
  return (
    <View style={{ flex: 1 }}>
      <Onboarding />
    </View>
  );
});