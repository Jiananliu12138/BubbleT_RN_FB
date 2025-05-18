// src/views/favoritesView.jsx
import { View, Text, StyleSheet } from "react-native";
import { TeaListView } from "./teaListView";

export function FavoritesView({ favorites, onTeaSelected, isUserLoggedIn }) {
  // If user is not logged in
  if (!isUserLoggedIn) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Please log in to view your favorite bubble teas
        </Text>
      </View>
    );
  }

  // If no favorites
  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          You haven't added any bubble teas to your favorites yet
        </Text>
      </View>
    );
  }

  // Show favorites list
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite Bubble Teas</Text>
      <TeaListView teas={favorites} onTeaSelected={onTeaSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    color: "#333",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: 300,
  },
});