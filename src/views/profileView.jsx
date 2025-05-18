// src/views/profileView.jsx
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList
} from "react-native";
import { Icon } from '../components/IconComponent';

// Use the yellow color scheme from allTeasView.jsx
const COLORS = {
  primary: "#f8ca69",      // Main color: yellow
  primaryDark: "#f7bd10",  // Darker yellow
  accent: "#f7bd10",       // Accent color: dark yellow
  accentLight: "#f8ca69",  // Light yellow
  background: "#f8ca69",   // Background: yellow
  cardBackground: "#fff",  // Card background: white
  text: "#333333",         // Text: dark gray
  textSecondary: "#666666",// Secondary text: medium gray
  border: "#000000"        // Border: black
};

export function ProfileView({
  user,
  userProfile,
  favorites,
  onLogout,
  onViewTeaDetails,
  onResetOnboarding,
  isLoading,
  loadingFavorites,
  onEditProfile
}) {
  // Get display name and avatar URL
  const displayName = userProfile?.nickname || (user?.email ? user.email.split('@')[0] : "用户");
  const avatarUrl = userProfile?.avatarUrl || null;
  const phoneNumber = userProfile?.phoneNumber || user?.phoneNumber || "185****6019"; // Default format phone number

  // Render user info, action buttons, and non-scrollable content
  const renderHeader = () => (
    <>
      {/* User card */}
      <View style={styles.userCard}>
        <View style={styles.userInfoSection}>
          {/* Left section: avatar and user info */}
          <View style={styles.leftSection}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {avatarUrl ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {displayName ? displayName[0].toUpperCase() : "U"}
                  </Text>
                </View>
              )}
            </View>
            
            {/* User text info */}
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userPhone}>{phoneNumber}</Text>
            </View>
          </View>
          
          {/* Edit profile button */}
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={onEditProfile}
            disabled={isLoading}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onLogout}
          disabled={isLoading}
        >
          <Icon name="log-out-outline" size={22} color="#666" style={styles.actionIcon} />
          <Text style={styles.actionText}>
            {isLoading ? "Processing..." : "Log Out"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onResetOnboarding}
        >
          <Icon name="refresh-outline" size={22} color="#666" style={styles.actionIcon} />
          <Text style={styles.actionText}>Reset Onboarding</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites section - title */}
      <View style={styles.favoritesHeader}>
        <Text style={styles.sectionTitle}>My Favorites</Text>
      </View>
      
      {/* Favorites content - loading or empty state */}
      {loadingFavorites ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : favorites && favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No favorited bubble teas yet</Text>
          <Text style={styles.emptySubText}>
            Click the heart icon on the bubble tea detail page to save your favorites
          </Text>
        </View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Use FlatList instead of nested ScrollView */}
      {favorites && favorites.length > 0 && !loadingFavorites ? (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.teaItem}
              onPress={() => onViewTeaDetails(item)}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.teaImage}
                defaultSource={require('../assets/logo-placeholder.png')}
              />
              <View style={styles.teaInfo}>
                <Text style={styles.teaName}>{item.name}</Text>
                {/* Removed price display since tea data doesn't have price field */}
                <Text style={styles.teaPrep}>Prep Time: {item.prepTime || "Unknown"} min</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.container}>
          {renderHeader()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: COLORS.border, // Using black color for better contrast on yellow
    fontSize: 18,
    fontWeight: "bold",
  },
  userCard: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.8, // Limit width to ensure edit button doesn't go off screen
  },
  avatarSection: {
    marginRight: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.border, // Using black text for better contrast on yellow
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.text,
  },
  editProfileButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  editProfileText: {
    color: COLORS.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  actionSection: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },
  favoritesHeader: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 5,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    maxWidth: 250,
  },
  // Tea item styles for FlatList
  teaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  teaImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  teaInfo: {
    flex: 1,
    marginLeft: 15,
  },
  teaName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  teaPrep: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '600',
  },
});