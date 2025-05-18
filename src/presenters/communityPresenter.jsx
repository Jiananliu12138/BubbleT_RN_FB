// 修改 communityPresenter.jsx - 增强用户资料加载和评论关联用户资料
import { observer } from "mobx-react-lite";
import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { CommunityView } from "../views/communityView";
import { CreatePostView } from "../views/community/createPostView";
import { PostDetailView } from "../views/community/postDetailView";
import { LoadingView } from "../views/commonComponents/loadingView";
import { router } from "expo-router";
import { pickMultipleImages } from "../services/mediaPickerService";

export const Community = observer(function Community(props) {
  const { community, user } = props.model;
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postBody, setPostBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [processedPosts, setProcessedPosts] = useState([]);
  const [processedFavorites, setProcessedFavorites] = useState([]);
  const [processedComments, setProcessedComments] = useState({});

  // 组件挂载时加载帖子
  useEffect(() => {
    const init = async () => {
      await loadPosts();
      await loadFavorites();
    };
    init();
  }, []);

  // 基于搜索文本过滤帖子
  useEffect(() => {
    if (searchText.trim()) {
      // 过滤主列表帖子
      const postsResults = processedPosts.filter(post => 
        post.body && post.body.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPosts(postsResults);
      
      // 过滤收藏
      const favoritesResults = processedFavorites.filter(post => 
        post.body && post.body.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFavorites(favoritesResults);
    } else {
      // 当搜索为空时重置为显示所有帖子
      setFilteredPosts(processedPosts);
      setFilteredFavorites(processedFavorites);
    }
  }, [searchText, processedPosts, processedFavorites]);

  // 当帖子加载后，获取所有发帖用户的资料
  useEffect(() => {
    if (community.allPosts && community.allPosts.length > 0) {
      loadUserProfiles();
    }
  }, [community.allPosts]);

  // 当社区模型中的收藏帖子更新时，更新处理过的收藏帖子
  useEffect(() => {
    if (community.favoritePosts) {
      processPostsWithExistingProfiles(community.favoritePosts, false);
    }
  }, [community.favoritePosts, userProfiles]);

  // 监听评论变化，为评论添加用户资料
  useEffect(() => {
    // 当评论数据更新时，处理评论并添加用户资料
    processComments();
  }, [community.postComments, userProfiles]);

  // 从存储加载收藏
  async function loadFavorites() {
    try {
      await community.loadFavorites();
      processPostsWithExistingProfiles(community.favoritePosts, false);
    } catch (error) {
      console.error("加载收藏时出错:", error);
    }
  }

  // 加载发帖用户的资料信息 - 增强版
  async function loadUserProfiles() {
    try {
      const userIds = new Set();
      
      // 收集所有不重复的用户ID（包括帖子和评论）
      community.allPosts.forEach(post => {
        if (post.userId) {
          userIds.add(post.userId);
        }
      });

      // 收集所有评论中的用户ID
      Object.values(community.postComments).forEach(comments => {
        comments.forEach(comment => {
          if (comment.userId) {
            userIds.add(comment.userId);
          }
        });
      });
      
      // 创建一个存储用户资料的临时对象
      const profiles = { ...userProfiles };
      let profilesUpdated = false;
      
      // 获取每个用户的资料
      const profilePromises = Array.from(userIds).map(async (userId) => {
        // 如果我们已经有了这个用户的资料，跳过
        if (profiles[userId]) return;
        
        try {
          // 使用社区模型中的方法获取用户资料
          const profile = await community.getUserProfileById(userId);
          if (profile) {
            profiles[userId] = profile;
            profilesUpdated = true;
          }
        } catch (err) {
          console.log(`无法获取用户 ${userId} 的资料:`, err);
        }
      });

      // 等待所有资料加载完成
      await Promise.all(profilePromises);
      
      // 只有在有新的用户资料时才更新状态
      if (profilesUpdated) {
        setUserProfiles(profiles);
        
        // 处理帖子数据，使用现有的用户资料
        processPostsWithExistingProfiles(community.allPosts, true);
        
        // 也处理所有评论
        processComments();
      }
    } catch (error) {
      console.error("加载用户资料时出错:", error);
    }
  }

  // 处理评论，为每个评论添加用户资料
  function processComments() {
    const processed = {};
    
    // 遍历所有帖子的评论
    Object.entries(community.postComments).forEach(([postId, comments]) => {
      // 为每个评论添加用户资料
      processed[postId] = comments.map(comment => {
        const processedComment = { ...comment };
        
        // 添加用户资料
        if (comment.userId && userProfiles[comment.userId]) {
          processedComment.userProfile = userProfiles[comment.userId];
        }
        
        return processedComment;
      });
    });
    
    // 更新处理后的评论状态
    setProcessedComments(processed);
  }

  // 处理帖子数据，确保媒体项格式正确并添加用户资料，但不更新社区模型
  function processPostsWithExistingProfiles(posts, isMainPosts) {
    // 将用户资料附加到帖子上，同时标准化媒体项格式
    const postsWithProfiles = posts.map(post => {
      // 创建新的帖子对象
      const processedPost = { ...post };
      
      // 添加用户资料
      if (post.userId && userProfiles[post.userId]) {
        processedPost.userProfile = userProfiles[post.userId];
      }
      
      // 标准化媒体项
      if (post.media && (!post.mediaItems || post.mediaItems.length === 0)) {
        processedPost.mediaItems = [{
          uri: post.media,
          type: post.mediaType || 'image' // 默认为图片类型
        }];
      } else if (post.mediaItems && post.mediaItems.length > 0) {
        // 确保第一个媒体项同时也设置为主媒体
        if (!processedPost.media) {
          processedPost.media = post.mediaItems[0].uri;
          processedPost.mediaType = post.mediaItems[0].type || 'image';
        }
      }
      
      return processedPost;
    });
    
    // 更新对应的状态，但不直接更新 community.allPosts
    if (isMainPosts) {
      setProcessedPosts(postsWithProfiles);
      setFilteredPosts(postsWithProfiles);
    } else {
      setProcessedFavorites(postsWithProfiles);
      setFilteredFavorites(postsWithProfiles);
    }
  }

  // 处理搜索文本变化
  function handleSearchChangeACB(text) {
    setSearchText(text);
  }

  // 加载帖子函数
  async function loadPosts() {
    try {
      await community.loadAllPosts();
      processPostsWithExistingProfiles(community.allPosts, true);
    } catch (error) {
      console.error("加载帖子时出错:", error);
    }
  }

  // 处理下拉刷新
  async function handleRefreshACB() {
    setRefreshing(true);
    try {
      await loadPosts();
      await loadFavorites();
      await loadUserProfiles();
    } finally {
      setRefreshing(false);
    }
  }

  // 切换创建帖子视图
  function toggleCreatePostACB() {
    setShowCreatePost(!showCreatePost);
    // 关闭时重置状态
    if (showCreatePost) {
      resetPostForm();
    }
  }

  // 重置帖子表单
  function resetPostForm() {
    setPostBody("");
    setMediaFiles([]);
  }

  // 处理文本输入变化
  function handlePostBodyChangeACB(text) {
    setPostBody(text);
  }

  // 从图库选择多张图片
  async function pickImagesACB() {
    try {
      const selectedImages = await pickMultipleImages();
      
      if (selectedImages && selectedImages.length > 0) {
        // 限制最多9张图片
        const totalImages = [...mediaFiles, ...selectedImages].slice(0, 9);
        
        // 更新每个图片对象，添加类型信息
        const imagesWithType = totalImages.map(file => ({
          ...file,
          type: 'image' // 指定媒体类型为图片
        }));
        
        setMediaFiles(imagesWithType);
      }
    } catch (error) {
      console.error("选择图片时出错:", error);
      Alert.alert("错误", "选择图片失败: " + error.message);
    }
  }

  // 移除选定的媒体文件
  function removeMediaACB(index) {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);
  }

  // 提交帖子
  async function handleSubmitACB() {
    if (!postBody.trim() && mediaFiles.length === 0) {
      Alert.alert("需要输入", "请输入一些文字或添加图片到您的帖子。");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("准备提交带媒体的帖子:", mediaFiles.length > 0 ? "是" : "否");
      
      // 创建帖子数据
      const postData = {
        body: postBody.trim(),
        userId: user.currentUser.uid,
      };
      
      // 如果有多个媒体文件
      if (mediaFiles.length > 0) {
        // 提交帖子和多个媒体文件到Firebase
        const postId = await community.createPostWithMedia(postData, mediaFiles);
        
        // 重置表单并关闭创建帖子视图
        resetPostForm();
        setShowCreatePost(false);
        
        // 刷新帖子
        await loadPosts();
        
        return postId;
      } else {
        // 没有媒体文件，提交普通帖子
        const postId = await community.createPost(postData);
        
        // 重置表单并关闭创建帖子视图
        resetPostForm();
        setShowCreatePost(false);
        
        // 刷新帖子
        await loadPosts();
        
        return postId;
      }
    } catch (error) {
      console.error("提交帖子时出错:", error);
      
      // 更详细的错误信息
      let errorMessage = "创建帖子失败: ";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage += "您没有权限上传文件。请检查Firebase存储规则。";
      } else if (error.code === 'storage/unknown') {
        errorMessage += "Firebase存储错误。这可能是由于网络问题或文件大小限制导致的。";
      } else if (error.code) {
        errorMessage += `${error.code} - ${error.message}`;
      } else {
        errorMessage += error.message || "发生未知错误";
      }
      
      Alert.alert("上传错误", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 删除帖子
  async function handleDeletePostACB(postId) {
    if (!user.currentUser) {
      Alert.alert("需要认证", "请登录以删除帖子");
      return;
    }
    
    try {
      // 确保帖子存在
      const post = processedPosts.find(p => p.id === postId);
      if (!post) return;
      
      // 确保用户有权限删除该帖子
      if (post.userId !== user.currentUser.uid) {
        Alert.alert("无权操作", "您只能删除自己的帖子");
        return;
      }
      
      await community.deletePost(postId);
      
      // 如果正在查看该帖子的详情，关闭详情视图
      if (selectedPost && selectedPost.id === postId) {
        setShowPostDetail(false);
        setSelectedPost(null);
      }
      
      // 刷新帖子列表
      await loadPosts();
      await loadFavorites();
      
      Alert.alert("成功", "帖子已删除");
    } catch (error) {
      console.error("删除帖子时出错:", error);
      Alert.alert("错误", "删除帖子失败: " + error.message);
    }
  }

  // 处理帖子选择
  function selectPostACB(post) {
    console.log("选择帖子:", post.id);
    
    // 确保帖子具有标准化的媒体项
    const processedPost = { ...post };
    if (post.media && (!post.mediaItems || post.mediaItems.length === 0)) {
      processedPost.mediaItems = [{
        uri: post.media,
        type: post.mediaType || 'image'
      }];
    }
    
    setSelectedPost(processedPost);
    setShowPostDetail(true);
  }

  // 关闭帖子详情视图
  function closePostDetailACB() {
    setShowPostDetail(false);
    setSelectedPost(null);
  }

  // 处理点赞/取消点赞
  async function handleLikeACB(postId) {
    if (!user.currentUser) {
      Alert.alert("需要认证", "请登录后点赞帖子");
      return;
    }
    
    try {
      const userId = user.currentUser.uid;
      const post = processedPosts.find(p => p.id === postId);
      
      if (!post) return;
      
      const isLiked = post.likes && post.likes.includes(userId);
      
      if (isLiked) {
        await community.unlikePost(postId, userId);
      } else {
        await community.likePost(postId, userId);
      }
      
      // 点赞/取消点赞后刷新帖子
      await loadPosts();
      
      // 如果该帖子在收藏中，也更新收藏
      await loadFavorites();
    } catch (error) {
      console.error("处理点赞时出错:", error);
      Alert.alert("错误", "处理点赞失败: " + error.message);
    }
  }

  // 处理收藏/取消收藏
  async function handleFavoriteACB(post) {
    if (!user.currentUser) {
      Alert.alert("需要认证", "请登录后添加收藏");
      return;
    }
    
    try {
      await community.toggleFavorite(post);
      await loadFavorites(); // 切换后重新加载收藏
    } catch (error) {
      console.error("切换收藏状态时出错:", error);
      Alert.alert("错误", "更新收藏失败: " + error.message);
    }
  }

  // 处理评论提交
  async function handleCommentACB(postId, commentText) {
    if (!commentText.trim()) {
      Alert.alert("需要输入", "请输入评论");
      return;
    }
    
    if (!user.currentUser) {
      Alert.alert("需要认证", "请登录后评论");
      return;
    }
    
    try {
      await community.addComment(postId, user.currentUser.uid, commentText.trim());
      
      // 刷新评论
      await community.loadPostComments(postId);
      
      // 加载当前用户的资料 (如果尚未加载)
      if (!userProfiles[user.currentUser.uid]) {
        const profile = await community.getUserProfileById(user.currentUser.uid);
        if (profile) {
          setUserProfiles(prev => ({
            ...prev,
            [user.currentUser.uid]: profile
          }));
        }
      }
      
      // 处理评论，添加用户资料
      processComments();
      
      // 刷新帖子以更新评论计数
      await loadPosts();
      await loadFavorites();
      
      return true;
    } catch (error) {
      console.error("添加评论时出错:", error);
      Alert.alert("错误", "添加评论失败: " + error.message);
      return false;
    }
  }

  // 自定义评论加载函数，加载后处理评论添加用户资料
  async function loadPostCommentsWithProfiles(postId) {
    try {
      // 先让社区模型加载评论
      await community.loadPostComments(postId);
      
      // 获取评论中的所有用户ID
      const comments = community.postComments[postId] || [];
      const commentUserIds = new Set(comments.map(comment => comment.userId));
      
      // 为每个评论用户加载资料（如果尚未加载）
      const newProfiles = { ...userProfiles };
      let hasNewProfiles = false;
      
      for (const userId of commentUserIds) {
        if (!userProfiles[userId]) {
          try {
            const profile = await community.getUserProfileById(userId);
            if (profile) {
              newProfiles[userId] = profile;
              hasNewProfiles = true;
            }
          } catch (err) {
            console.log(`无法获取评论用户 ${userId} 的资料:`, err);
          }
        }
      }
      
      // 如果有新的用户资料，更新状态
      if (hasNewProfiles) {
        setUserProfiles(newProfiles);
      }
      
      // 处理评论，添加用户资料
      processComments();
      
      return comments;
    } catch (error) {
      console.error("加载评论时出错:", error);
      throw error;
    }
  }

  // 如果帖子正在加载，显示加载指示器
  if (community.isLoadingPosts && !refreshing && processedPosts.length === 0) {
    return <LoadingView message="加载帖子中..." />;
  }

  // 显示创建帖子视图
  if (showCreatePost) {
    return (
      <CreatePostView
        postBody={postBody}
        onPostBodyChange={handlePostBodyChangeACB}
        mediaFiles={mediaFiles}
        onPickImages={pickImagesACB}
        onRemoveMedia={removeMediaACB}
        onSubmit={handleSubmitACB}
        onCancel={toggleCreatePostACB}
        isSubmitting={isSubmitting}
      />
    );
  }

  // 显示帖子详情视图
  if (showPostDetail && selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        currentUser={user.currentUser}
        onBack={closePostDetailACB}
        onLike={() => handleLikeACB(selectedPost.id)}
        onComment={handleCommentACB}
        loadComments={() => loadPostCommentsWithProfiles(selectedPost.id)}
        comments={processedComments[selectedPost.id] || []}
        isLoadingComments={community.isLoadingComments}
      />
    );
  }

  // 显示带有基于标签页导航的主社区视图
  return (
    <CommunityView
      posts={processedPosts}
      favoritePosts={processedFavorites}
      currentUser={user.currentUser}
      onCreatePost={toggleCreatePostACB}
      onSelectPost={selectPostACB}
      onLike={handleLikeACB}
      onFavorite={handleFavoriteACB}
      onDeletePost={handleDeletePostACB}
      onRefresh={handleRefreshACB}
      refreshing={refreshing}
      loadingError={community.loadPostsError}
      searchText={searchText}
      onSearchChange={handleSearchChangeACB}
      filteredPosts={filteredPosts}
      filteredFavorites={filteredFavorites}
    />
  );
});