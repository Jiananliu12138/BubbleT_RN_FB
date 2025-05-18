// src/views/editProfileView.jsx
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Icon } from '../components/IconComponent';

// 统一的配色方案 - 黄色系 (匹配 homeView.jsx)
const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色
  primaryDark: "#f7bd10",  // 深一点的主色调
  accent: "#f7bd10",       // 强调色：深黄色
  accentLight: "#f8ca69",  // 浅一点的强调色
  background: "#f8f8f8",   // 背景色：浅灰色
  cardBackground: "#fff",  // 卡片背景：白色
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色
};

export function EditProfileView({
  userProfile,
  nickname,
  onNicknameChange,
  onGoBack,
  onSaveProfile,
  onSelectAvatar,
  isLoading
}) {
  // 获取显示名称和头像 URL
  const avatarUrl = userProfile?.avatarUrl || null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onGoBack}
          disabled={isLoading}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={onSaveProfile}
          disabled={isLoading}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* 内容部分 */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          
          {/* 头像部分 */}
          <View style={styles.avatarSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={onSelectAvatar}
              disabled={isLoading}
            >
              {avatarUrl ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.avatarText}>
                    {nickname ? nickname[0].toUpperCase() : "U"}
                  </Text>
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Icon name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Avatar</Text>
          </View>
          
          {/* 表单部分 */}
          <View style={styles.formSection}>
            {/* 昵称输入 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nickname</Text>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={onNicknameChange}
                placeholder="Enter nickname"
                placeholderTextColor="#999"
                maxLength={20}
              />
            </View>
          </View>
          
          {/* 提示信息 */}
          <Text style={styles.hintText}>
            Note: After changing your nickname, the displayed name in messages and comments will also be updated.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhotoText: {
    marginTop: 8,
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "500",
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    padding: 0,
    color: COLORS.text,
  },
  hintText: {
    paddingHorizontal: 20,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
});