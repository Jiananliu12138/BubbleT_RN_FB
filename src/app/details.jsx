// src/app/details.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { Details } from "../presenters/detailsPresenter";

export default observer(function DetailsPage() {
  return (
    <View style={{ flex: 1 }}>
      <Details model={reactiveModel} />
    </View>
  );
});