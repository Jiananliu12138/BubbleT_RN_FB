// 改进后的 communityService.js 文件

import { db, auth, storage } from "../services/firebaseConfig";
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
  increment 
} from 'firebase/firestore';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// 创建新帖子
export const createPost = async (postData, mediaFile, mediaType) => {
  try {
    console.log("开始上传处理...");
    
    // 初始化帖子对象
    const post = {
      ...postData,
      createdAt: serverTimestamp(),
      likes: [],
      commentsCount: 0
    };
    
    // 如果提供了媒体文件则上传
    if (mediaFile && mediaType) {
      try {
        console.log("文件详情:", {
          name: mediaFile.name,
          type: mediaFile.type,
          size: mediaFile.size,
          mediaType: mediaType
        });
        
        // 创建唯一文件名
        const timestamp = new Date().getTime();
        const fileExtension = mediaFile.name.split('.').pop();
        const uniqueFileName = `${timestamp}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        
        // 根据媒体类型确定存储路径
        const storagePath = mediaType === 'video' ? 'posts/videos' : 'posts/images';
        const fullPath = `${storagePath}/${uniqueFileName}`;
        
        // 创建 storage 引用
        const storageRef = ref(storage, fullPath);
        
        // 将图片 URI 转换为 blob
        console.log("将图片转换为 blob...");
        let blob;
        
        try {
          // 尝试直接使用 fetch 方法获取 blob
          console.log("尝试使用 fetch 方法获取 blob");
          const response = await fetch(mediaFile.uri);
          blob = await response.blob();
          console.log("成功创建 blob, 大小:", blob.size);
        } catch (fetchError) {
          console.error("fetch 获取 blob 错误:", fetchError);
          throw fetchError;
        }
        
        // 使用可恢复上传方法
        console.log("开始上传到 Firebase Storage...");
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
              console.log('上传进度: ' + progress.toFixed(2) + '%');
            },
            (error) => {
              // 上传错误处理
              console.error("上传错误:", error);
              reject(error);
            },
            () => {
              // 上传完成
              console.log("上传完成!");
              resolve();
            }
          );
        });
        
        // 获取下载 URL
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("下载 URL:", downloadUrl);
        
        // 将媒体信息添加到帖子
        post.media = downloadUrl;
        post.mediaType = mediaType;
        post.mediaPath = fullPath;
        
        console.log("媒体上传成功，路径:", fullPath);
      } catch (error) {
        console.error("媒体上传错误:", error);
        throw error;
      }
    }
    
    // 将帖子添加到 Firestore
    console.log("添加帖子到 Firestore:", post);
    const docRef = await addDoc(collection(db, 'posts'), post);
    console.log("帖子已添加，ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("创建帖子错误:", error);
    throw error;
  }
};

// 获取所有帖子（保持不变）
export const getAllPosts = async () => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().getTime() : Date.now()
    }));
  } catch (error) {
    console.error("获取帖子错误:", error);
    throw error;
  }
};

// 获取特定用户的帖子
export const getUserPosts = async (userId) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().getTime() : Date.now()
    }));
  } catch (error) {
    console.error("获取用户帖子错误:", error);
    throw error;
  }
};

// 通过 ID 获取特定帖子
export const getPostById = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("帖子未找到");
    }
    
    return {
      id: postDoc.id,
      ...postDoc.data(),
      createdAt: postDoc.data().createdAt ? postDoc.data().createdAt.toDate().getTime() : Date.now()
    };
  } catch (error) {
    console.error("获取帖子错误:", error);
    throw error;
  }
};

// 点赞帖子
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId)
    });
    return true;
  } catch (error) {
    console.error("点赞帖子错误:", error);
    throw error;
  }
};

// 取消点赞
export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId)
    });
    return true;
  } catch (error) {
    console.error("取消点赞错误:", error);
    throw error;
  }
};

// 获取帖子点赞
export const getPostLikes = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("帖子未找到");
    }
    
    return postDoc.data().likes || [];
  } catch (error) {
    console.error("获取帖子点赞错误:", error);
    throw error;
  }
};

// 添加评论
export const addComment = async (postId, userId, text) => {
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
    
    return commentRef.id;
  } catch (error) {
    console.error("添加评论错误:", error);
    throw error;
  }
};

// 获取帖子评论
export const getPostComments = async (postId) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().getTime() : Date.now()
    }));
  } catch (error) {
    console.error("获取帖子评论错误:", error);
    throw error;
  }
};