// src/views/teaListView.jsx
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function TeaListView({ teas, onTeaSelected }) {
  function renderTeaItemACB({ item }) {
    function teaSelectedACB() {
      onTeaSelected(item);
    }

    return (
      <Pressable style={styles.teaCard} onPress={teaSelectedACB}>
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
          style={styles.teaImage}
        />
        <View style={styles.teaInfo}>
          <Text style={styles.teaName}>{item.name}</Text>
          <Text style={styles.teaPrep}>Prep Time: {item.prepTime} minutes</Text>
          <Text numberOfLines={2} style={styles.teaDescription}>
            {item.description}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <FlatList
      data={teas}
      renderItem={renderTeaItemACB}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  teaCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teaImage: {
    width: '25%', // 改为相对宽度而非固定的100px
    aspectRatio: 1, // 保持1:1的宽高比
    borderRadius: 8,
    marginRight: 12,
  },
  teaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  teaName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  teaPrep: {
    fontSize: 14,
    color: "#8a2be2",
    marginBottom: 4,
  },
  teaDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});