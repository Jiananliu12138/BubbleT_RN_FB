// src/views/community/createPostView.jsx - Xiaohongshu style post creation view
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  FlatList,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Color scheme - consistent with map page
const COLORS = {
  primary: "#f8ca69",      // Main color: Yellow background (originally #a7b794 light green)
  darkGreen: "#f7bd10",    // Dark tone: Deep yellow (originally #667761 dark green)
  accent: "#f7bd10",       // Accent color: Deep yellow (originally #8a2be2 purple)
  accentLight: "#f8ca69",  // Lighter accent color (originally #b57eeb light purple)
  background: "#f8ca69",   // Background color: Yellow (originally #a7b794 light green)
  cardBackground: "#fff",  // Card background: White
  text: "#333333",         // Main text: Dark gray
  textSecondary: "#666666",// Secondary text: Medium gray
  border: "#000000",       // Border color: Black (originally #e0e0e0 light gray)
  highlight: "#f7bd10",    // Highlight color: Deep yellow (originally #24c960 bright green)
};

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function CreatePostView(props) {
  const {
    postBody,
    onPostBodyChange,
    mediaFiles,
    onPickImages,
    onRemoveMedia,
    onSubmit,
    onCancel,
    isSubmitting
  } = props;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Render thumbnail list
  const renderThumbnails = () => {
    if (!mediaFiles || mediaFiles.length === 0) return null;
    
    return (
      <View style={styles.thumbnailsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mediaFiles}
          keyExtractor={(item, index) => `thumb-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.thumbnailItem,
                index === selectedImageIndex ? styles.selectedThumbnail : null
              ]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image 
                source={{ uri: item.uri }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeThumbnailBtn}
                onPress={() => onRemoveMedia(index)}
              >
                <Ionicons name="close-circle" size={18} color="#ff3b30" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Render large image preview area
  const renderImagePreview = () => {
    if (!mediaFiles || mediaFiles.length === 0) {
      // Display placeholder area for adding images
      return (
        <TouchableOpacity 
          style={styles.addImagesPlaceholder}
          onPress={onPickImages}
        >
          <Ionicons name="images-outline" size={60} color="rgba(255,255,255,0.7)" />
          <Text style={styles.addImagesText}>Add Images</Text>
          <Text style={styles.addImagesSubtext}>Add up to 9 images</Text>
        </TouchableOpacity>
      );
    }

    // Display selected image
    return (
      <View style={styles.selectedImageContainer}>
        <Image
          source={{ uri: mediaFiles[selectedImageIndex].uri }}
          style={styles.selectedImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={[
            styles.postBtn,
            (!postBody.trim() && (!mediaFiles || mediaFiles.length === 0)) || isSubmitting
              ? styles.postBtnDisabled
              : {}
          ]}
          onPress={onSubmit}
          disabled={(!postBody.trim() && (!mediaFiles || mediaFiles.length === 0)) || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Image preview area - top */}
        {renderImagePreview()}
        
        {/* Thumbnail list */}
        {renderThumbnails()}
        
        {/* Text content area - bottom */}
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            multiline
            value={postBody}
            onChangeText={onPostBodyChange}
            autoFocus={Platform.OS !== "web"}
            maxLength={2000}
          />
        </View>
      </ScrollView>

      {/* Bottom toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolbarBtn} 
          onPress={onPickImages}
        >
          <Ionicons name="images-outline" size={26} color="#ffffff" />
          <Text style={styles.toolbarBtnText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    backgroundColor: COLORS.darkGreen,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff"
  },
  cancelBtn: {
    padding: "1%"
  },
  postBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 20
  },
  postBtnDisabled: {
    backgroundColor: COLORS.accentLight
  },
  postBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14
  },
  content: {
    flex: 1,
  },
  // Xiaohongshu style - image preview area
  addImagesPlaceholder: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImagesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  addImagesSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  selectedImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: '#000',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  // Thumbnail list
  thumbnailsContainer: {
    padding: "2.5%",
    backgroundColor: 'white',
  },
  thumbnailItem: {
    width: "15%",
    aspectRatio: 1,
    marginRight: "2%",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedThumbnail: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeThumbnailBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  // Text area
  textContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: "4%",
    minHeight: "50%",
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlignVertical: 'top',
    height: '100%',
  },
  // Bottom toolbar
  toolbar: {
    flexDirection: "row",
    backgroundColor: COLORS.darkGreen,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: "3%",
    paddingHorizontal: "4%"
  },
  toolbarBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
    marginRight: "4%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: "3%"
  },
  toolbarBtnText: {
    color: "#ffffff",
    marginLeft: 6,
    fontSize: 14
  }
});