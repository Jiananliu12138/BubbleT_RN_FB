// 修改 CommunityModel.js 增强用户资料处理
import { makeAutoObservable, observable, action, runInAction } from "mobx";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp,
  increment,
  deleteDoc 
} from 'firebase/firestore';
import { db, auth, storage } from "../services/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage key for favorites
const FAVORITES_STORAGE_KEY = '@community_favorites';

class CommunityModel {
  // 可观察状态
  allPosts = [];
  favoriteIds = [];
  favoritePosts = [];
  isLoadingPosts = false;
  loadPostsError = null;
  isLoadingComments = false;
  postComments = {};
  userProfileCache = {}; // 用户资料缓存
  userProfileLoading = {}; // 跟踪正在加载中的用户资料

  constructor() {
    makeAutoObservable(this, {
      allPosts: observable,
      favoriteIds: observable,
      favoritePosts: observable,
      isLoadingPosts: observable,
      loadPostsError: observable,
      isLoadingComments: observable,
      postComments: observable,
      userProfileCache: observable,
      userProfileLoading: observable,
      loadAllPosts: action,
      createPost: action,
      createPostWithMedia: action,
      deletePost: action,
      likePost: action,
      unlikePost: action,
      addComment: action,
      loadPostComments: action,
      toggleFavorite: action,
      loadFavorites: action,
      saveFavorites: action,
      removeFromFavorites: action,
      resetStates: action,
      getUserProfileById: action
    });
  }

  // 重置状态
  resetStates() {
    this.allPosts = [];
    this.favoriteIds = [];
    this.favoritePosts = [];
    this.isLoadingPosts = false;
    this.loadPostsError = null;
    this.isLoadingComments = false;
    this.postComments = {};
    // 保留用户资料缓存以便快速恢复
  }

  // 加载所有帖子
  async loadAllPosts() {
    try {
      this.isLoadingPosts = true;
      this.loadPostsError = null;
      
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // 标准化帖子数据，确保媒体项格式正确
        const post = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().getTime() : Date.now()
        };
        
        // 如果有media字段但没有mediaItems字段，则创建mediaItems
        if (post.media && (!post.mediaItems || post.mediaItems.length === 0)) {
          post.mediaItems = [{
            uri: post.media,
            type: post.mediaType || 'image'
          }];
        }
        
        return post;
      });
      
      runInAction(() => {
        this.allPosts = posts;
        this.isLoadingPosts = false;
      });
      
      // 帖子加载完成后，预加载所有发帖用户的资料
      this.preloadPostUserProfiles(posts);
      
      return posts;
    } catch (error) {
      console.error("加载帖子错误:", error);
      
      runInAction(() => {
        this.loadPostsError = `加载帖子失败: ${error.message}`;
        this.isLoadingPosts = false;
      });
      
      throw error;
    }
  }

  // 新增方法: 预加载帖子用户资料
  async preloadPostUserProfiles(posts) {
    try {
      // 收集所有帖子的用户ID
      const userIds = new Set(posts.map(post => post.userId));
      
      // 批量加载所有用户资料
      const profilePromises = Array.from(userIds).map(userId => 
        this.getUserProfileById(userId)
      );
      
      // 等待所有资料加载完成（不需要处理结果，因为已经存入缓存）
      await Promise.all(profilePromises);
      
      console.log("预加载了帖子用户资料:", userIds.size);
    } catch (error) {
      console.warn("预加载用户资料时出错:", error);
      // 继续执行，这只是一个性能优化
    }
  }

  // 创建新帖子
  async createPost(postData) {
    try {
      // 初始化帖子对象
      const post = {
        ...postData,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0
      };
      
      // 将帖子添加到 Firestore
      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log("帖子已添加，ID:", docRef.id);
      
      // 刷新帖子列表
      await this.loadAllPosts();
      
      return docRef.id;
    } catch (error) {
      console.error("创建帖子错误:", error);
      throw error;
    }
  }

  // 创建带媒体的帖子（支持多个媒体文件）
  async createPostWithMedia(postData, mediaFiles) {
    try {
      // 初始化帖子对象
      const post = {
        ...postData,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0
      };
      
      // 如果有媒体文件则上传
      if (mediaFiles && mediaFiles.length > 0) {
        // 存储所有媒体项的信息
        const mediaItems = [];
        
        // 逐个上传媒体文件
        for (let i = 0; i < mediaFiles.length; i++) {
          const mediaFile = mediaFiles[i];
          const mediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';
          
          console.log(`上传第 ${i+1}/${mediaFiles.length} 个媒体文件:`, {
            name: mediaFile.name,
            type: mediaFile.type,
            size: mediaFile.size
          });
          
          // 创建唯一文件名
          const timestamp = new Date().getTime();
          const fileExtension = mediaFile.name.split('.').pop();
          const uniqueFileName = `${timestamp}_${i}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
          
          // 根据媒体类型确定存储路径
          const storagePath = mediaType === 'video' ? 'posts/videos' : 'posts/images';
          const fullPath = `${storagePath}/${uniqueFileName}`;
          
          // 创建 storage 引用
          const storageRef = ref(storage, fullPath);
          
          // 将图片 URI 转换为 blob
          const response = await fetch(mediaFile.uri);
          const blob = await response.blob();
          
          // 使用可恢复上传方法
          const uploadTask = uploadBytesResumable(storageRef, blob, {
            contentType: mediaFile.type
          });
          
          // 等待上传完成
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // 上传进度更新
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`文件 ${i+1} 上传进度: ${progress.toFixed(2)}%`);
              },
              (error) => {
                // 上传错误处理
                console.error("上传错误:", error);
                reject(error);
              },
              () => {
                // 上传完成
                console.log(`文件 ${i+1} 上传完成!`);
                resolve();
              }
            );
          });
          
          // 获取下载 URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 将媒体信息添加到媒体项数组
          mediaItems.push({
            uri: downloadUrl,
            type: mediaType,
            path: fullPath,
            width: mediaFile.width,
            height: mediaFile.height
          });
          
          // 如果是第一个媒体文件，也作为主媒体添加到帖子
          if (i === 0) {
            post.media = downloadUrl;
            post.mediaType = mediaType;
            post.mediaPath = fullPath;
          }
        }
        
        // 将所有媒体项添加到帖子
        post.mediaItems = mediaItems;
      }
      
      // 将帖子添加到 Firestore
      console.log("添加帖子到 Firestore:", post);
      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log("帖子已添加，ID:", docRef.id);
      
      // 刷新帖子列表
      await this.loadAllPosts();
      
      return docRef.id;
    } catch (error) {
      console.error("创建带媒体的帖子错误:", error);
      throw error;
    }
  }

  // 删除帖子
  async deletePost(postId) {
    try {
      // 获取帖子信息
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error("帖子不存在");
      }
      
      const postData = postDoc.data();
      
      // 删除媒体文件
      if (postData.mediaPath) {
        try {
          const mediaRef = ref(storage, postData.mediaPath);
          await deleteObject(mediaRef);
        } catch (mediaError) {
          console.warn("删除媒体文件时出错:", mediaError);
          // 继续删除帖子，即使媒体删除失败
        }
      }
      
      // 删除其他媒体项
      if (postData.mediaItems && postData.mediaItems.length > 0) {
        for (let i = 0; i < postData.mediaItems.length; i++) {
          const item = postData.mediaItems[i];
          if (item.path && item.path !== postData.mediaPath) {
            try {
              const itemRef = ref(storage, item.path);
              await deleteObject(itemRef);
            } catch (itemError) {
              console.warn(`删除媒体项 ${i} 时出错:`, itemError);
              // 继续删除其他媒体项
            }
          }
        }
      }
      
      // 删除帖子关联的评论
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postId', '==', postId));
        const commentsSnapshot = await getDocs(q);
        
        const deleteCommentPromises = commentsSnapshot.docs.map(commentDoc => 
          deleteDoc(doc(db, 'comments', commentDoc.id))
        );
        
        await Promise.all(deleteCommentPromises);
      } catch (commentsError) {
        console.warn("删除帖子评论时出错:", commentsError);
        // 继续删除帖子，即使评论删除失败
      }
      
      // 删除帖子本身
      await deleteDoc(postRef);
      
      // 从收藏中移除该帖子
      await this.removeFromFavorites(postId);
      
      // 刷新帖子列表
      await this.loadAllPosts();
      
      return true;
    } catch (error) {
      console.error("删除帖子错误:", error);
      throw error;
    }
  }

  // 点赞帖子
  async likePost(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
      
      // 更新内存中的帖子
      const postIndex = this.allPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const post = {...this.allPosts[postIndex]};
        
        if (!post.likes) {
          post.likes = [userId];
        } else if (!post.likes.includes(userId)) {
          post.likes.push(userId);
        }
        
        runInAction(() => {
          this.allPosts[postIndex] = post;
        });
      }
      
      return true;
    } catch (error) {
      console.error("点赞帖子错误:", error);
      throw error;
    }
  }

  // 取消点赞
  async unlikePost(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
      
      // 更新内存中的帖子
      const postIndex = this.allPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const post = {...this.allPosts[postIndex]};
        
        if (post.likes && post.likes.includes(userId)) {
          post.likes = post.likes.filter(id => id !== userId);
        }
        
        runInAction(() => {
          this.allPosts[postIndex] = post;
        });
      }
      
      return true;
    } catch (error) {
      console.error("取消点赞错误:", error);
      throw error;
    }
  }

  // 添加评论
  async addComment(postId, userId, text) {
    try {
      // 创建评论
      const comment = {
        postId,
        userId,
        text,
        createdAt: serverTimestamp()
      };
      
      // 添加到评论集合
      const commentRef = await addDoc(collection(db, 'comments'), comment);
      
      // 更新帖子评论计数
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(1)
      });
      
      // 加载更新后的评论
      await this.loadPostComments(postId);
      
      // 更新内存中的帖子评论计数
      const postIndex = this.allPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const post = {...this.allPosts[postIndex]};
        post.commentsCount = (post.commentsCount || 0) + 1;
        
        runInAction(() => {
          this.allPosts[postIndex] = post;
        });
      }
      
      return commentRef.id;
    } catch (error) {
      console.error("添加评论错误:", error);
      throw error;
    }
  }

  // 加载帖子评论 - 增强版，添加资料预加载
  async loadPostComments(postId) {
    try {
      runInAction(() => {
        this.isLoadingComments = true;
      });
      
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().getTime() : Date.now()
      }));
      
      runInAction(() => {
        this.postComments = {
          ...this.postComments,
          [postId]: comments
        };
        this.isLoadingComments = false;
      });
      
      // 预加载评论用户的资料
      this.preloadCommentUserProfiles(comments);
      
      return comments;
    } catch (error) {
      console.error("加载评论错误:", error);
      
      runInAction(() => {
        this.isLoadingComments = false;
      });
      
      throw error;
    }
  }

  // 新增: 预加载评论用户资料
  async preloadCommentUserProfiles(comments) {
    try {
      // 收集所有不重复的用户ID
      const userIds = new Set(comments.map(comment => comment.userId));
      
      // 批量加载所有用户资料
      const profilePromises = Array.from(userIds).map(userId => 
        this.getUserProfileById(userId)
      );
      
      // 等待所有资料加载完成
      await Promise.all(profilePromises);
      
      console.log("预加载了评论用户资料:", userIds.size);
    } catch (error) {
      console.warn("预加载评论用户资料时出错:", error);
      // 继续执行，这只是一个性能优化
    }
  }

  // 切换收藏状态 - 修复循环依赖问题
  async toggleFavorite(post) {
    try {
      const postId = post.id;
      const isFavorited = this.favoriteIds.includes(postId);
      
      if (isFavorited) {
        // 从收藏中移除
        await this.removeFromFavorites(postId);
        return false; // 返回新的收藏状态
      } else {
        // 获取最新的帖子数据以确保收藏是最新的
        let postToFavorite = {...post};
        
        // 确保媒体项标准化
        if (postToFavorite.media && (!postToFavorite.mediaItems || postToFavorite.mediaItems.length === 0)) {
          postToFavorite.mediaItems = [{
            uri: postToFavorite.media,
            type: postToFavorite.mediaType || 'image'
          }];
        }
        
        // 添加到收藏
        const newFavoriteIds = [...this.favoriteIds, postId];
        const newFavoritePosts = [...this.favoritePosts, postToFavorite];
        
        // 使用runInAction以避免多次单独更新观察状态
        runInAction(() => {
          this.favoriteIds = newFavoriteIds;
          this.favoritePosts = newFavoritePosts;
        });
        
        // 保存到 AsyncStorage
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({
          ids: newFavoriteIds,
          posts: newFavoritePosts
        }));
        
        return true; // 返回新的收藏状态
      }
    } catch (error) {
      console.error("切换收藏状态错误:", error);
      throw error;
    }
  }

  // 从收藏中移除
  async removeFromFavorites(postId) {
    try {
      const newFavoriteIds = this.favoriteIds.filter(id => id !== postId);
      const newFavoritePosts = this.favoritePosts.filter(post => post.id !== postId);
      
      runInAction(() => {
        this.favoriteIds = newFavoriteIds;
        this.favoritePosts = newFavoritePosts;
      });
      
      // 保存到 AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({
        ids: newFavoriteIds,
        posts: newFavoritePosts
      }));
      
      return true;
    } catch (error) {
      console.error("从收藏移除错误:", error);
      throw error;
    }
  }

  // 加载收藏
  async loadFavorites() {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        
        const normalizedFavoritePosts = (favorites.posts || []).map(post => {
          const processedPost = { ...post };
          
          // 标准化媒体项
          if (post.media && (!post.mediaItems || post.mediaItems.length === 0)) {
            processedPost.mediaItems = [{
              uri: post.media,
              type: post.mediaType || 'image'
            }];
          }
          
          return processedPost;
        });
        
        runInAction(() => {
          this.favoriteIds = favorites.ids || [];
          this.favoritePosts = normalizedFavoritePosts;
        });
      }
      
      return this.favoritePosts;
    } catch (error) {
      console.error("加载收藏错误:", error);
      
      runInAction(() => {
        this.favoriteIds = [];
        this.favoritePosts = [];
      });
      
      throw error;
    }
  }

  // 保存收藏
  async saveFavorites(favoritePosts) {
    try {
      const favoriteIds = favoritePosts.map(post => post.id);
      
      runInAction(() => {
        this.favoriteIds = favoriteIds;
        this.favoritePosts = favoritePosts;
      });
      
      // 保存到 AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({
        ids: favoriteIds,
        posts: favoritePosts
      }));
      
      return true;
    } catch (error) {
      console.error("保存收藏错误:", error);
      throw error;
    }
  }

  // 获取用户资料并缓存结果 - 增强版，添加并发控制
  async getUserProfileById(userId) {
    try {
      // 如果用户资料已经缓存，直接返回
      if (this.userProfileCache[userId]) {
        return this.userProfileCache[userId];
      }
      
      // 如果正在加载这个用户的资料，等待加载完成
      if (this.userProfileLoading[userId]) {
        // 等待现有的加载完成
        await this.userProfileLoading[userId];
        return this.userProfileCache[userId];
      }
      
      // 创建一个Promise来跟踪加载状态
      let resolveLoading;
      this.userProfileLoading[userId] = new Promise(resolve => {
        resolveLoading = resolve;
      });
      
      try {
        // 从Firestore获取用户资料
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        let userProfile;
        if (userDoc.exists()) {
          userProfile = {
            id: userDoc.id,
            ...userDoc.data()
          };
        } else {
          // 如果用户资料不存在，返回带有基本信息的对象
          userProfile = {
            uid: userId,
            nickname: `用户 ${userId.substring(0, 6)}`,
            avatarUrl: null
          };
        }
        
        // 缓存用户资料
        runInAction(() => {
          this.userProfileCache[userId] = userProfile;
        });
        
        return userProfile;
      } finally {
        // 无论成功或失败，都标记加载已完成
        delete this.userProfileLoading[userId];
        if (resolveLoading) resolveLoading();
      }
    } catch (error) {
      console.error(`获取用户 ${userId} 资料错误:`, error);
      // 返回基本用户信息，以防请求失败
      return {
        uid: userId,
        nickname: `用户 ${userId.substring(0, 6)}`,
        avatarUrl: null
      };
    }
  }
}

// 创建单例实例
export const communityModel = new CommunityModel();