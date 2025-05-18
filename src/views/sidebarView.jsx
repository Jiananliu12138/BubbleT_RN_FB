// src/views/sidebarView.jsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image
} from "react-native";
import { Icon } from '../components/IconComponent';
import { useRef, useEffect, useState } from "react";

export function SidebarView({
  user,
  userProfile,
  onProfilePress,
  onLanguagePress,
  onLogoutPress,
  onCleanCachePress,
  onContactUsPress,
  onClose
}) {
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width * 0.75)).current;
  
  // Get user nickname and avatar from userProfile prop
  const nickname = userProfile?.nickname || (user?.email ? user.email.split('@')[0] : "Guest");
  const avatarUrl = userProfile?.avatarUrl || null;
  
  useEffect(() => {
    // Animate the sidebar in when the component mounts
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Function to close the sidebar with animation
  function closeSidebar() {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  }
  
  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay to close sidebar on touch */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={closeSidebar}
      >
      </TouchableOpacity>
      
      {/* Sidebar content */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        {/* User avatar and info */}
        <View style={styles.userSection}>
          <TouchableOpacity onPress={onProfilePress}>
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={styles.avatarImage}
                defaultSource={require('../assets/logo-placeholder.png')}
                // 添加错误处理
                onError={() => {
                  console.log("Avatar image load error");
                
                }}
              />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {nickname ? nickname[0].toUpperCase() : "G"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.welcomeText}>
            Hello, {nickname}
          </Text>
        </View>
        
        {/* Menu items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={onProfilePress}>
            <Icon name="person-outline" size={24} color="white" />
            <Text style={styles.menuText}>Personal Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={onLanguagePress}>
            <Icon name="language-outline" size={24} color="white" />
            <Text style={styles.menuText}>Language</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={onCleanCachePress}>
            <Icon name="trash-outline" size={24} color="white" />
            <Text style={styles.menuText}>Clear Cache</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={onContactUsPress}>
            <Icon name="call-outline" size={24} color="white" />
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
        
        {/* Logout button at bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
            <Icon name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    position: "absolute",
    width: '70%',
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#f7bd10",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  userSection: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  menuText: {
    color: "white",
    fontSize: 18,
    marginLeft: 15,
  },
  bottomContainer: {
    paddingBottom: 30,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 69, 19, 0.3)", // Darker accent for the button
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});