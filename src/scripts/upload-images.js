// scripts/upload-images.js
// 上传本地图片到Firebase Storage并更新Firestore中的URL

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../services/firebaseConfig.js';
import fs from 'fs';
import path from 'path';

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 图片文件夹路径
const imagesFolder = 'D:\\TeaData\\split';

async function uploadImagesAndUpdateFirestore() {
  console.log('开始上传图片并更新Firestore...');
  
  try {
    // 读取图片文件夹中的所有文件
    const files = fs.readdirSync(imagesFolder);
    
    // 过滤出茶图片文件
    const imageFiles = files.filter(file => 
      file.startsWith('tea') && file.endsWith('.png')
    );
    
    console.log(`找到 ${imageFiles.length} 个图片文件`);
    
    // 处理每个图片
    for (const imageFile of imageFiles) {
      // 从文件名中提取茶编号（tea1.png -> 1）
      const teaNumber = imageFile.replace('tea', '').replace('.png', '');
      const teaId = `tea${teaNumber}`;
      
      console.log(`处理图片 ${imageFile} 对应的茶ID ${teaId}`);
      
      // 上传图片到Firebase Storage
      const storagePath = `bubble-tea-images/${imageFile}`;
      const storageRef = ref(storage, storagePath);
      
      // 读取文件
      const filePath = path.join(imagesFolder, imageFile);
      const fileData = fs.readFileSync(filePath);
      
      // 上传到Firebase Storage
      await uploadBytes(storageRef, fileData, {
        contentType: 'image/png'
      });
      
      // 获取下载URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`上传图片 ${imageFile} 成功，URL: ${downloadURL}`);
      
      // 更新Firestore文档中的imageUrl
      const teaDocRef = doc(db, 'bubbleTeas', teaId);
      await updateDoc(teaDocRef, {
        imageUrl: downloadURL
      });
      
      console.log(`更新 ${teaId} 的图片URL成功`);
    }
    
    console.log('所有图片上传完成，Firestore中的URL已更新！');
  } catch (error) {
    console.error('上传过程中出错:', error);
  }
}

// 运行上传函数
uploadImagesAndUpdateFirestore();