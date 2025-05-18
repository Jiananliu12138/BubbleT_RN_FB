// src/views/communityView.jsx - 完整修改版
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Alert
} from "react-native";
import { Icon } from '../components/IconComponent';
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色背景 (原 #a7b794 淡绿色)
  darkGreen: "#f7bd10",    // 深色部分：深黄色 (原 #667761 深绿色)
  lightGreen: "#fce8b0",   // 浅色部分：浅黄色 (原 #d7e0cc 浅绿色)
  accent: "#f7bd10",       // 强调色：深黄色 (原 #8a2be2 紫色)
  accentLight: "#f8ca69",  // 浅一点的强调色 (原 #b57eeb 浅紫色)
  background: "#f8ca69",   // 背景色：黄色 (原 #a7b794 淡绿色)
  cardBackground: "#fff",  // 卡片背景：白色
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色 (原 #e0e0e0 浅灰色)
  highlight: "#f7bd10",    // 高亮色：深黄色 (原 #24c960 亮绿色)
};

export function CommunityView(props) {
  const {
    posts,
    currentUser,
    onCreatePost,
    onSelectPost,
    onLike,
    onFavorite,
    onDeletePost,
    onRefresh,
    refreshing,
    loadingError,
    favoritePosts,
    searchText,
    onSearchChange,
    filteredPosts,
    filteredFavorites
  } = props;

  // 本地状态 - 选项卡
  const [activeTab, setActiveTab] = useState('community'); // 'community', 'favorites', 或 'myPosts'

  // 计算屏幕尺寸用于响应式布局
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const postWidth = screenWidth / 2 - 16; // 两列布局，减去边距

  // 格式化时间戳为可读日期
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
    if (diffMin < 60) return `${diffMin}minutes ago`;
    if (diffHour < 24) return `${diffHour}hours ago`;
    if (diffDay < 7) return `${diffDay}days ago`;
    
    return date.toLocaleDateString();
  }

  // 确认删除帖子
  const confirmDelete = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDeletePost(postId),
          style: "destructive"
        }
      ]
    );
  };

  // 小红书风格的帖子项，网格布局
  const renderPostItemGrid = ({ item, index }) => {
    const isLiked = item.likes && currentUser && item.likes.includes(currentUser.uid);
    const isFavorited = favoritePosts && favoritePosts.some(post => post.id === item.id);
    const isOwnPost = currentUser && item.userId === currentUser.uid;
    
    // 确定显示的媒体 (支持多图)
    const mediaItem = item.mediaItems && item.mediaItems.length > 0 
                      ? item.mediaItems[0] 
                      : item.media 
                        ? { uri: item.media, type: item.mediaType } 
                        : null;
    
    return (
      <TouchableOpacity
        style={[styles.gridPostCard, { width: postWidth }]}
        onPress={() => onSelectPost(item)}
        activeOpacity={0.8}
      >
        {/* 媒体部分 - 上半部分 */}
        <View style={styles.gridPostImageContainer}>
          {mediaItem ? (
            <Image
              source={{ uri: mediaItem.uri }}
              style={styles.gridPostImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.gridPostImagePlaceholder}>
              <Text style={styles.gridPostImagePlaceholderText}>No Image</Text>
            </View>
          )}
          
          {/* 角标指示器 - 多图 */}
          {item.mediaItems && item.mediaItems.length > 1 && (
            <View style={styles.multipleImagesIndicator}>
              <Text style={styles.multipleImagesIndicatorText}>
                {item.mediaItems.length}Images
              </Text>
            </View>
          )}
        </View>
        
        {/* 内容部分 - 下半部分 */}
        <View style={styles.gridPostContent}>
          <Text 
            style={styles.gridPostText} 
            numberOfLines={2}
          >
            {item.body}
          </Text>
          
          {/* 用户信息和操作 */}
          <View style={styles.gridPostFooter}>
            <View style={styles.gridPostUser}>
              {item.userProfile && item.userProfile.avatarUrl ? (
                <Image 
                  source={{ uri: item.userProfile.avatarUrl }} 
                  style={styles.gridUserAvatar} 
                />
              ) : (
                <Icon name="person-circle" size={20} color={COLORS.darkGreen} />
              )}
              <Text style={styles.gridUserName} numberOfLines={1}>
                {item.userProfile && item.userProfile.nickname 
                  ? item.userProfile.nickname 
                  : `User ${item.userId.substring(0, 3)}`}
              </Text>
            </View>
            
            <View style={styles.gridPostStats}>
              <TouchableOpacity
                onPress={() => onLike(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
              >
                <Icon
                  name={isLiked ? "heart" : "heart-outline"}
                  size={16}
                  color={isLiked ? "#e74c3c" : COLORS.textSecondary}
                />
              </TouchableOpacity>
              <Text style={styles.gridStatsText}>{item.likes ? item.likes.length : 0}</Text>
              
              <TouchableOpacity
                onPress={() => onFavorite(item)}
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
              >
                <Icon
                  name={isFavorited ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={isFavorited ? COLORS.accent : COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* 删除按钮 - 只在"我的帖子"中显示 */}
        {isOwnPost && activeTab === 'myPosts' && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item.id)}
          >
            <Icon name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染收藏项，使用矩形装饰风格
  function renderFavoriteItem({ item }) {
    const isLiked = item.likes && currentUser && item.likes.includes(currentUser.uid);
    
    return (
      <View style={styles.favoriteNoteWrapper}>
        {/* 顶部两个矩形装饰，替换原来的圆形图钉 */}
        <View style={styles.noteDecorationContainer}>
          <View style={styles.rectangleDecoration} />
          <View style={styles.rectangleDecoration} />
        </View>
        
        <TouchableOpacity
          style={styles.favoriteNoteCard}
          onPress={() => onSelectPost(item)}
          activeOpacity={0.8}
        >
          {/* 用户信息部分 */}
          <View style={styles.favoriteHeader}>
            {item.userProfile && item.userProfile.avatarUrl ? (
              <Image 
                source={{ uri: item.userProfile.avatarUrl }} 
                style={styles.smallAvatarImage} 
              />
            ) : (
              <Icon name="person-circle" size={24} color={COLORS.accent} />
            )}
            <Text style={styles.favoriteUserName}>
              {item.userProfile && item.userProfile.nickname 
                ? item.userProfile.nickname 
                : `用户 ${item.userId.substring(0, 6)}`}
            </Text>
            <TouchableOpacity 
              style={styles.removeFavoriteButton}
              onPress={() => onFavorite(item)}
            >
              <Icon name="close-circle" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          
          {/* 内容预览 */}
          <View style={styles.favoriteContent}>
            {/* 文本 */}
            {item.body && (
              <Text style={styles.favoriteText} numberOfLines={3}>
                {item.body}
              </Text>
            )}
            
            {/* 媒体缩略图 */}
            {item.mediaItems && item.mediaItems.length > 0 ? (
              <Image
                source={{ uri: item.mediaItems[0].uri }}
                style={styles.favoriteImage}
                resizeMode="cover"
              />
            ) : item.media && item.mediaType === 'image' ? (
              <Image
                source={{ uri: item.media }}
                style={styles.favoriteImage}
                resizeMode="cover"
              />
            ) : item.media && item.mediaType === 'video' ? (
              <View style={styles.favoriteVideoPlaceholder}>
                <Icon name="play-circle" size={30} color="white" />
              </View>
            ) : null}
          </View>
          
          {/* 统计页脚 */}
          <View style={styles.favoriteFooter}>
            <View style={styles.favoriteStats}>
              <Icon
                name="heart"
                size={16}
                color="#e74c3c"
              />
              <Text style={styles.favoriteStatsText}>
                {item.likes ? item.likes.length : 0}
              </Text>
            </View>
            
            <View style={styles.favoriteStats}>
              <Icon name="chatbubble" size={14} color="#555" />
              <Text style={styles.favoriteStatsText}>
                {item.commentsCount || 0}
              </Text>
            </View>
            
            <Text style={styles.favoriteTime}>{formatDate(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // 渲染帖子列表的空状态
  function renderEmptyPostsList() {
    const message = searchText.trim() 
      ? "No matching posts found" 
      : "No posts";
      
    const subMessage = searchText.trim()
      ? "Try different search terms" 
      : activeTab === 'myPosts' 
        ? "You haven't posted anything yet" 
        : "Be the first to share with the community!";
    
    return (
      <View style={styles.emptyContainer}>
        <Icon 
          name="chatbubbles-outline" 
          size={60} 
          color="#fff" 
        />
        <Text style={styles.emptyText}>{message}</Text>
        <Text style={styles.emptySubtext}>{subMessage}</Text>
      </View>
    );
  }

  // 渲染收藏夹的空状态
  function renderEmptyFavoritesList() {
    const message = searchText.trim() 
      ? "No matching favorites found" 
      : "No favorites yet";
      
    const subMessage = searchText.trim()
      ? "Try different search terms" 
      : "Favorited posts will appear here!";
    
    return (
      <View style={styles.emptyContainer}>
        <Icon 
          name="bookmark" 
          size={60} 
          color="#fff" 
        />
        <Text style={styles.emptyText}>{message}</Text>
        <Text style={styles.emptySubtext}>{subMessage}</Text>
      </View>
    );
  }

  // 搜索栏组件
  function renderSearchBar() {
    return (
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 标签导航组件
  function renderTabs() {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'community' && styles.activeTabButton]}
          onPress={() => setActiveTab('community')}
        >
          <Text style={[styles.tabText, activeTab === 'community' && styles.activeTabText]}>
            Community
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'favorites' && styles.activeTabButton]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'myPosts' && styles.activeTabButton]}
          onPress={() => setActiveTab('myPosts')}
        >
          <Text style={[styles.tabText, activeTab === 'myPosts' && styles.activeTabText]}>
            My Posts
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 渲染收藏区域 - 修改为占满更多空间
  function renderFavoritesSection() {
    const favoritesToDisplay = searchText.trim() ? filteredFavorites : favoritePosts;
    
    if (favoritesToDisplay.length === 0) {
      return renderEmptyFavoritesList();
    }
    
    return (
      <FlatList
        key="favoritesList"
        data={favoritesToDisplay}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => `favorite-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesListContent}
        snapToInterval={screenWidth * 0.9 + 20} // 修改：卡片宽度 + 边距
        snapToAlignment="start"
        decelerationRate="fast"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor="#ffffff"
          />
        }
      />
    );
  }

  // 渲染"我的帖子"列表 - 网格布局
  function renderMyPostsSection() {
    // 过滤只属于当前用户的帖子
    const myPosts = currentUser 
      ? posts.filter(post => post.userId === currentUser.uid)
      : [];
    
    const myPostsToDisplay = searchText.trim() 
      ? myPosts.filter(post => post.body && post.body.toLowerCase().includes(searchText.toLowerCase()))
      : myPosts;
    
    if (myPostsToDisplay.length === 0) {
      return renderEmptyPostsList();
    }
    
    return (
      <FlatList
        key="myPostsGrid"
        data={myPostsToDisplay}
        renderItem={renderPostItemGrid}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridColumnWrapper}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor="#ffffff"
          />
        }
      />
    );
  }

  // 渲染社区帖子 - 网格布局
  function renderCommunityGridSection() {
    const postsToDisplay = searchText.trim() ? filteredPosts : posts;
    
    if (postsToDisplay.length === 0) {
      return renderEmptyPostsList();
    }
    
    return (
      <FlatList
        key="communityGrid"
        data={postsToDisplay}
        renderItem={renderPostItemGrid}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridColumnWrapper}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor="#ffffff"
          />
        }
      />
    );
  }

  // 根据当前标签页确定显示的内容
  function renderContent() {
    if (activeTab === 'community') {
      return renderCommunityGridSection();
    } else if (activeTab === 'favorites') {
      return renderFavoritesSection();
    } else if (activeTab === 'myPosts') {
      return renderMyPostsSection();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* 带标签的页眉 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreatePost}
        >
          <Icon name="add-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 标签导航 */}
      {renderTabs()}

      {/* 搜索栏 */}
      {renderSearchBar()}

      {/* 错误信息（如果有） */}
      {loadingError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {loadingError}。下拉刷新重试。
          </Text>
        </View>
      )}

      {/* 基于标签的内容 */}
      {renderContent()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  createButton: {
    padding: 4,
  },
  // 标签导航
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeTabButton: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  activeTabText: {
    color: COLORS.accent,
  },
  // 搜索栏样式
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  
  // 小红书风格网格布局
  gridContent: {
    padding: 8,
    paddingBottom: 20,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    padding: 4,
  },
  gridPostCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    position: 'relative',
  },
  gridPostImageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  gridPostImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  gridPostImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPostImagePlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  multipleImagesIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  multipleImagesIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridPostContent: {
    padding: 10,
  },
  gridPostText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  gridPostFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  gridPostUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gridUserAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
  },
  gridUserName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  gridPostStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
    marginRight: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(220, 20, 60, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  // 收藏标签页样式 - 修改尺寸，接近全屏显示
  favoritesListContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  favoriteNoteWrapper: {
    width: Dimensions.get("window").width * 0.75, // 修改：占屏幕宽度90%
    height: Dimensions.get('window').height * 0.6, // 修改：占更多垂直空间
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: "visible",
  },
  // 顶部装饰改为矩形
  noteDecorationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    zIndex: 1,
  },
  // 新增的矩形装饰样式
  rectangleDecoration: {
    width: 25,
    height: 40,
    backgroundColor: COLORS.darkGreen, // 深绿色矩形
    marginBottom: -12, // 使矩形部分轻微重叠在卡片上
    borderRadius: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  favoriteNoteCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  smallAvatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  favoriteUserName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 8,
  },
  removeFavoriteButton: {
    padding: 2,
  },
  // 更多空间给内容
  favoriteContent: {
    flex: 1,
    marginVertical: 10,
  },
  favoriteText: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 8,
    maxHeight: 72, // 限制最大高度，大约可显示3行 (3 * 24)
  },
  // 图片大小调整
  favoriteImage: {
    aspectRatio: 1.5, // 设置宽高比
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center', // This centers the image horizontally
  },
  favoriteVideoPlaceholder: {
    height: 220,
    width: "70%",
    backgroundColor: "#222",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  favoriteFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  favoriteStats: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  favoriteStatsText: {
    fontSize: 12,
    color: "#555555",
    marginLeft: 4,
  },
  favoriteTime: {
    fontSize: 12,
    color: "#888888",
    marginLeft: "auto",
  },
  
  // 空状态样式
  emptyContainer: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#ffffff",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  
  // 错误信息样式
  errorContainer: {
    padding: 12,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 14,
  },
});