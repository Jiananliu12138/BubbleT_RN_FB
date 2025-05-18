import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";

const COLORS = {
  primary: "#f8ca69",      // Main color: Yellow background (originally #a7b794 light green)
  darkGreen: "#f7bd10",    // Dark part: Deep yellow (originally #667761 dark green)
  lightGreen: "#fce8b0",   // Light part: Light yellow (originally #d7e0cc light green)
  accent: "#f7bd10",       // Accent color: Deep yellow (originally #8a2be2 purple)
  accentLight: "#f8ca69",  // Lighter accent color (originally #b57eeb light purple)
  background: "#f8ca69",   // Background color: Yellow (originally #a7b794 light green)
  cardBackground: "#fff",  // Card background: White
  text: "#333333",         // Main text: Dark gray
  textSecondary: "#666666",// Secondary text: Medium gray
  border: "#000000",       // Border color: Black (originally #e0e0e0 light gray)
  highlight: "#f7bd10",    // Highlight color: Deep yellow (originally #24c960 bright green)
};

export function PostDetailView(props) {
  const {
    post,
    currentUser,
    onBack,
    onLike,
    onComment,
    loadComments,
    comments,
    isLoadingComments
  } = props;

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const flatListRef = useRef(null);
  
  const isLiked = post.likes && currentUser && post.likes.includes(currentUser.uid);

  // Check and standardize media data
  let mediaItems = [];
  if (post.mediaItems && post.mediaItems.length > 0) {
    mediaItems = [...post.mediaItems];
  } else if (post.media) {
    mediaItems = [{
      uri: post.media,
      type: post.mediaType || 'image'
    }];
  }

  // Log media data for debugging
  useEffect(() => {
    console.log("PostDetailView - Post ID:", post.id);
    console.log("Media items count:", mediaItems.length);
    if (mediaItems.length > 0) {
      console.log("First media item:", JSON.stringify(mediaItems[0], null, 2));
    }
  }, []);

  // Load comments when component mounts
  useEffect(() => {
    loadComments();
  }, []);

  // Handle comment submission
  async function handleSubmitComment() {
    if (!commentText.trim() || !currentUser) return;
    
    setIsSubmittingComment(true);
    
    try {
      const success = await onComment(post.id, commentText);
      if (success) {
        setCommentText("");
      }
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // Format timestamp to readable date
  function formatDate(timestamp) {
    if (!timestamp) return "Just now";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 7) return `${diffDay} days ago`;
    
    // Return full date for older posts
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Render a single media item
  const renderMediaItem = ({ item, index }) => {
    // Safety check to ensure media item is valid
    if (!item || !item.uri) {
      console.warn("Invalid media item:", item);
      return (
        <View style={[styles.mediaItem, styles.invalidMediaItem]}>
          <Ionicons name="image-outline" size={60} color="#aaa" />
          <Text style={styles.invalidMediaText}>Media couldn't be loaded</Text>
        </View>
      );
    }
    
    if (item.type === 'video') {
      return (
        <View style={styles.mediaItem}>
          <Video
            source={{ uri: item.uri }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </View>
      );
    } else {
      // Default to image type
      return (
        <View style={styles.mediaItem}>
          <Image
            source={{ uri: item.uri }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        </View>
      );
    }
  };

  // Render media pagination indicator
  const renderPagination = () => {
    if (mediaItems.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {mediaItems.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.paginationDot,
              index === activeMediaIndex ? styles.paginationDotActive : {}
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView style={styles.content}>
          {/* Post content - Xiaohongshu style */}
          <View style={styles.postContainer}>
            {/* Media carousel */}
            {mediaItems.length > 0 && (
              <View style={styles.mediaContainer}>
                <FlatList
                  ref={flatListRef}
                  data={mediaItems}
                  renderItem={renderMediaItem}
                  keyExtractor={(item, index) => `media-${index}-${item.uri ? item.uri.slice(-10) : index}`}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    // Calculate the index of currently displayed media item
                    const contentOffset = e.nativeEvent.contentOffset.x;
                    const viewSize = e.nativeEvent.layoutMeasurement.width;
                    const index = Math.floor(contentOffset / viewSize);
                    setActiveMediaIndex(index);
                  }}
                />
                {renderPagination()}
              </View>
            )}
            
            {/* Post text and author information */}
            <View style={styles.postContentContainer}>
              {/* User information */}
              <View style={styles.postHeader}>
                <View style={styles.userAvatar}>
                  {post.userProfile && post.userProfile.avatarUrl ? (
                    <Image 
                      source={{ uri: post.userProfile.avatarUrl }} 
                      style={styles.avatarImage} 
                    />
                  ) : (
                    <Ionicons name="person-circle" size={40} color={COLORS.darkGreen} />
                  )}
                </View>
                <View>
                  <Text style={styles.userName}>
                    {post.userProfile && post.userProfile.nickname 
                      ? post.userProfile.nickname 
                      : `User ${post.userId.substring(0, 6)}`}
                  </Text>
                  <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
                </View>
              </View>

              {/* Post body */}
              {post.body && (
                <Text style={styles.postText}>{post.body}</Text>
              )}

              {/* Post actions */}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onLike}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={isLiked ? "#e74c3c" : COLORS.text}
                  />
                  <Text style={styles.actionText}>
                    {post.likes ? post.likes.length : 0} Likes
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={22} color={COLORS.text} />
                  <Text style={styles.actionText}>
                    {post.commentsCount || 0} Comments
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comments section - Changed to white background, black dashed line separator */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            
            {/* Loading indicator */}
            {isLoadingComments && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>Loading comments...</Text>
              </View>
            )}
            
            {/* Comments list */}
            {!isLoadingComments && comments.length === 0 && (
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            )}
            
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    {/* Modified: Display comment user avatar */}
                    {comment.userProfile && comment.userProfile.avatarUrl ? (
                      <Image 
                        source={{ uri: comment.userProfile.avatarUrl }} 
                        style={styles.commentAvatarImage} 
                      />
                    ) : (
                      <Ionicons name="person-circle" size={28} color={COLORS.darkGreen} />
                    )}
                  </View>
                  <View style={styles.commentMeta}>
                    {/* Modified: Display comment user nickname */}
                    <Text style={styles.commentUser}>
                      {comment.userProfile && comment.userProfile.nickname
                        ? comment.userProfile.nickname
                        : `User ${comment.userId.substring(0, 6)}`}
                    </Text>
                    <Text style={styles.commentTime}>
                      {formatDate(comment.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment input box - White background */}
        {currentUser && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() || isSubmittingComment ? styles.sendButtonDisabled : {}
              ]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary // Overall background is still light green
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    backgroundColor: COLORS.primary, // Keep dark green header
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  backBtn: {
    padding: "1%"
  },
  placeholder: {
    width: "8%"
  },
  keyboardView: {
    flex: 1,
    backgroundColor: 'white' // Set keyboard avoidance view background to white
  },
  content: {
    flex: 1,
    backgroundColor: 'white' // Main content area background set to white
  },
  // Xiaohongshu style post
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 0 // Remove bottom margin
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    position: 'relative'
  },
  mediaItem: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  invalidMediaItem: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invalidMediaText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: "3%",
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  postContentContainer: {
    padding: "4%",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "3%"
  },
  userAvatar: {
    marginRight: "3%"
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  postText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: "4%"
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: "3%"
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "6%"
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.text
  },
  // Comments section - Changed to white background, black dashed line separator
  commentsSection: {
    backgroundColor: 'white', // White background
    padding: "4%",
    paddingTop: "2.5%",
    paddingBottom: "6%",
    borderTopWidth: 1,  // Add top border
    borderTopColor: '#000', // Black border
    borderTopStyle: 'dashed', // Dashed style
    marginTop: "2%" // Add a little top margin for the separator
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGreen,
    marginBottom: "4%"
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "4%"
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.darkGreen
  },
  noCommentsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    padding: "4%"
  },
  commentItem: {
    marginBottom: "4%",
    paddingBottom: "4%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)"
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%"
  },
  commentAvatar: {
    marginRight: "2%"
  },
  // New: Comment user avatar style
  commentAvatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentMeta: {
    flex: 1
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text
  },
  commentTime: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  commentText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: "9%",
    lineHeight: 20
  },
  // Comment input box - Changed to white background
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'white', // White background
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    padding: "3%"
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Slightly gray background to distinguish the input box
    borderRadius: 20,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    maxHeight: 100,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  sendButton: {
    backgroundColor: COLORS.accent, // Purple button
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%"
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.accentLight // Light purple disabled state
  }
});