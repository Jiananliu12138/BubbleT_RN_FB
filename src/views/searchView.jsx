// src/views/searchView.jsx
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { TeaListView } from "./teaListView";
import { Icon } from "../components/IconComponent";

export function SearchView({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searchResults,
  onTeaSelected,
  isLoading,
  onMenuPress, // 新增菜单按钮点击处理函数
}) {
  function handleChangeACB(text) {
    onSearchQueryChange(text);
  }

  function handleSearchACB() {
    onSearch();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Icon name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{width: 24}}></View>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bubble teas..."
          value={searchQuery}
          onChangeText={handleChangeACB}
          returnKeyType="search"
          onSubmitEditing={handleSearchACB}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchACB}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchResults && searchResults.length > 0 ? (
        <TeaListView teas={searchResults} onTeaSelected={onTeaSelected} />
      ) : (
        <View style={styles.emptyContainer}>
          {isLoading ? (
            <Text style={styles.emptyText}>Searching...</Text>
          ) : searchQuery ? (
            <Text style={styles.emptyText}>No related bubble teas found</Text>
          ) : (
            <Text style={styles.emptyText}>
              Enter keywords to search for bubble teas
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#8a2be2",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});