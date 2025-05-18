// src/presenters/favoritesPresenter.jsx
import { observer } from "mobx-react-lite";
import { FavoritesView } from "../views/favoritesView";
import { LoadingView } from "../views/commonComponents/loadingView";
import { router } from "expo-router";
import { useEffect } from "react";

export const Favorites = observer(function Favorites(props) {
  const { tea, user } = props.model;
  const isUserLoggedIn = !!user.currentUser;
  
  // Load favorites when component mounts or user changes
  useEffect(() => {
    if (isUserLoggedIn) {
      tea.loadFavorites();
    }
  }, [isUserLoggedIn, user.currentUser?.uid]);

  // Handle tea selection with source parameter
  function teaSelectedACB(selectedTea) {
    tea.setCurrentTeaId(selectedTea.id);
    // Navigate to details with source=favorites parameter
    router.push({
      pathname: "/details",
      params: { source: "favorites" }
    });
  }
  
  // If loading
  if (isUserLoggedIn && tea.favoritesPromiseState.promise && !tea.favoritesPromiseState.data) {
    return <LoadingView message="Loading your favorites..." />;
  }
  
  // If error
  if (tea.favoritesPromiseState.error) {
    return <LoadingView error={tea.favoritesPromiseState.error} />;
  }
  
  return (
    <FavoritesView
      favorites={tea.favorites}
      onTeaSelected={teaSelectedACB}
      isUserLoggedIn={isUserLoggedIn}
    />
  );
});