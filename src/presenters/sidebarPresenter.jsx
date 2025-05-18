// src/presenters/sidebarPresenter.jsx
import { observer } from "mobx-react-lite";
import { SidebarView } from "../views/sidebarView";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const Sidebar = observer(function Sidebar(props) {
  const { model, onClose } = props;
  const { user } = model;
  const [userProfile, setUserProfile] = useState(null);
  
  // Fetch user profile when component mounts
  useEffect(() => {
    async function fetchUserProfile() {
      if (user.currentUser) {
        try {
          // If user profile is already loaded
          if (user.userProfile) {
            setUserProfile(user.userProfile);
          } else {
            // Otherwise load it
            const profile = await user.loadUserProfile();
            setUserProfile(profile);
          }
        } catch (error) {
          console.error("Error loading user profile for sidebar:", error);
        }
      }
    }
    
    fetchUserProfile();
  }, [user.currentUser]);
  
  // Handle navigation to profile
  function navigateToProfileACB() {
    router.push("/profile");
    onClose();
  }
  
  // Handle language selection
  function handleLanguageSelectACB() {
    // 这里可以实现语言选择逻辑
    // 例如打开一个语言选择模态框或导航到语言设置页面
    alert("语言选择功能将在i18n实现后启用");
    onClose();
  }
  
  // Handle logout
  async function handleLogoutACB() {
    try {
      await user.logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  
  // Handle clean cache
  async function handleCleanCacheACB() {
    try {
      // Clear app-specific cache
      // This is a simple implementation - you might want to expand this
      await AsyncStorage.removeItem('@onboarding_complete');
      alert("缓存已清除，应用将在下次启动时重新加载引导页面");
      onClose();
    } catch (error) {
      console.error("清除缓存错误:", error);
    }
  }
  
  // Handle contact us
  function handleContactUsACB() {
    // You can implement actual contact functionality here
    alert("联系我们: support@bubbletea.com");
    onClose();
  }
  
  return (
    <SidebarView
      user={user.currentUser}
      userProfile={userProfile || user.userProfile}
      onProfilePress={navigateToProfileACB}
      onLanguagePress={handleLanguageSelectACB}
      onLogoutPress={handleLogoutACB}
      onCleanCachePress={handleCleanCacheACB}
      onContactUsPress={handleContactUsACB}
      onClose={onClose}
    />
  );
});