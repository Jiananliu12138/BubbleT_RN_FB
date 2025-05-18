// src/presenters/detailsPresenter.jsx
import { observer } from "mobx-react-lite";
import { TeaDetailsView } from "../views/teaDetailsView"; 
import { LoadingView } from "../views/commonComponents/loadingView"; 
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

export const Details = observer(function Details(props) {
  const { tea, user } = props.model;
  const { currentTeaPromiseState, currentTeaId } = tea;
  const isUserLoggedIn = !!user.currentUser;
  const params = useLocalSearchParams();
  const [sourceScreen, setSourceScreen] = useState(null);

  useEffect(() => {
    // Detect source screen from navigation params if available
    if (params.source) {
      setSourceScreen(params.source);
    }
    
    console.log("Current tea ID:", tea.currentTeaId);
    console.log("Current tea data:", tea.currentTeaPromiseState?.data);
    console.log("Source screen:", params.source || "Not specified");
  }, [tea.currentTeaId, tea.currentTeaPromiseState?.data, params.source]);
  
  // Handle back navigation
  function handleBackACB() {
    // If source screen is specified, navigate to that screen
    if (sourceScreen === "profile") {
      router.push("/profile");
    } 
    // Otherwise, use the default back behavior
    else {
      router.back();
    }
  }

  // Show loading state
  if (currentTeaPromiseState.promise && !currentTeaPromiseState.data) {
    return <LoadingView message="Loading bubble tea details..." />;
  }

  // Show error state
  if (currentTeaPromiseState.error) {
    return <LoadingView error={currentTeaPromiseState.error} />;
  }

  // No selected tea
  if (!currentTeaId || !currentTeaPromiseState.data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bubble tea selected</Text>
      </View>
    );
  }

  const teaData = currentTeaPromiseState.data;
  const isFavorite = teaData.isFavorite;

  // Handle adding to favorites
  async function addToFavoritesACB() {
    if (!isUserLoggedIn) return;
    await tea.addToFavorites(teaData);
  }

  // Handle removing from favorites
  async function removeFromFavoritesACB() {
    if (!isUserLoggedIn) return;
    await tea.removeFromFavorites(teaData);
  }

  return (
    <TeaDetailsView
      tea={teaData}
      isFavorite={isFavorite}
      onAddToFavorites={addToFavoritesACB}
      onRemoveFromFavorites={removeFromFavoritesACB}
      isUserLoggedIn={isUserLoggedIn}
      onBackPress={handleBackACB}
    />
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});