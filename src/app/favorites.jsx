// src/app/favorites.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { Favorites } from "../presenters/favoritesPresenter";

export default observer(function FavoritesPage() {
  return (
    <View style={{ flex: 1 }}>
      <Favorites model={reactiveModel} />
    </View>
  );
});