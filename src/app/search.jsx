// src/app/search.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { Search } from "../presenters/searchPresenter";

export default observer(function SearchPage() {
  return (
    <View style={{ flex: 1 }}>
      <Search model={reactiveModel} />
    </View>
  );
});