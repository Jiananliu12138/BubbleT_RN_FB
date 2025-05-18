// src/presenters/profilePresenter.jsx
import { observer } from "mobx-react-lite";
import { ProfileView } from "../views/profileView";
import { EditProfileView } from "../views/editProfileView";
import { LoadingView } from "../views/commonComponents/loadingView";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const Profile = observer(function Profile(props) {
  const { user, tea } = props.model;
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [nickname, setNickname] = useState("");
  
  // Load favorites and profile when component mounts or user changes
  useEffect(() => {
    async function loadData() {
      if (user.currentUser) {
        // Load favorites
        setLoadingFavorites(true);
        try {
          await tea.loadFavorites();
        } catch (error) {
          console.error("Loading favorites failed:", error);
        } finally {
          setLoadingFavorites(false);
        }
        
        // Load profile if needed
        if (!user.userProfile) {
          try {
            await user.loadUserProfile();
            // Set initial nickname from profile after loading
            if (user.userProfile) {
              setNickname(user.userProfile.nickname || "");
            }
          } catch (error) {
            console.error("Loading user profile failed:", error);
          }
        } else {
          // Set nickname from existing profile
          setNickname(user.userProfile.nickname || "");
        }
      }
    }
    
    loadData();
  }, [user.currentUser?.uid]);
  
  // Handle logout
  async function handleLogout() {
    try {
      await user.logout();
      // Clear user-related data
      tea.favorites = [];
      tea.favoritesPromiseState = {};
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  
  // Navigate to tea details with source parameter
  function viewTeaDetails(selectedTea) {
    tea.setCurrentTeaId(selectedTea.id);
    // Navigate to details with source=profile parameter
    router.push({
      pathname: "/details",
      params: { source: "profile" }
    });
  }
  
  // Reset onboarding for development testing
  async function handleResetOnboarding() {
    try {
      await AsyncStorage.removeItem('@onboarding_complete');
      Alert.alert('Success', 'Onboarding has been reset, will take effect on app restart');
    } catch (error) {
      console.error("Reset onboarding error:", error);
      Alert.alert('Error', 'Reset failed, please try again');
    }
  }
  
  // Show edit profile page
  function handleEditProfile() {
    setShowEditProfile(true);
  }
  
  // Go back from edit profile
  function handleGoBack() {
    setShowEditProfile(false);
    // Reset nickname to original if not saved
    if (user.userProfile) {
      setNickname(user.userProfile.nickname || "");
    }
  }
  
  // Save profile changes
  async function saveProfile() {
    try {
      if (nickname && nickname !== user.userProfile?.nickname) {
        await user.updateNickname(nickname);
      }
      
      setShowEditProfile(false);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert('Error', `Update failed: ${error.message}`);
    }
  }
  
  // Handle avatar selection
  async function selectAvatar() {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Error', 'Gallery access permission needed to select avatar');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Prepare file object
        const imageFile = {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'profile-avatar.jpg',
        };
        
        // Upload avatar
        await user.updateAvatar(imageFile);
        Alert.alert('Success', 'Avatar updated');
      }
    } catch (error) {
      console.error("Select avatar error:", error);
      Alert.alert('Error', `Avatar update failed: ${error.message}`);
    }
  }
  
  // If user is still loading
  if (!user.currentUser) {
    return <LoadingView message="Loading user information..." />;
  }
  
  // Show edit profile page if in edit mode
  if (showEditProfile) {
    return (
      <EditProfileView
        userProfile={user.userProfile}
        nickname={nickname}
        onNicknameChange={setNickname}
        onGoBack={handleGoBack}
        onSaveProfile={saveProfile}
        onSelectAvatar={selectAvatar}
        isLoading={user.authLoading || user.profileLoading}
      />
    );
  }
  
  // Show profile page
  return (
    <ProfileView
      user={user.currentUser}
      userProfile={user.userProfile}
      favorites={tea.favorites || []}
      onLogout={handleLogout}
      onViewTeaDetails={viewTeaDetails}
      onResetOnboarding={handleResetOnboarding}
      isLoading={user.authLoading || user.profileLoading}
      loadingFavorites={loadingFavorites}
      onEditProfile={handleEditProfile}
    />
  );
});