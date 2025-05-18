// src/services/teaService.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  deleteDoc,
  addDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const TEAS_COLLECTION = "bubbleTeas";
const FAVORITES_COLLECTION = "userFavorites";

// Get all bubble teas
export async function getAllBubbleTeas() {
  try {
    const teaCollection = collection(db, TEAS_COLLECTION);
    const teaSnapshot = await getDocs(teaCollection);
    return teaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting bubble teas:", error);
    throw error;
  }
}

// Get a specific bubble tea by ID
export async function getBubbleTeaById(teaId) {
  try {
    const teaDoc = doc(db, TEAS_COLLECTION, teaId);
    const teaSnapshot = await getDoc(teaDoc);
    
    if (teaSnapshot.exists()) {
      return {
        id: teaSnapshot.id,
        ...teaSnapshot.data()
      };
    } else {
      throw new Error("Bubble tea not found");
    }
  } catch (error) {
    console.error("Error getting bubble tea:", error);
    throw error;
  }
}

// Search bubble teas by name
export async function searchBubbleTeas(searchTerm) {
  try {
    // Note: Firestore doesn't support native text search
    // For a small dataset, we can fetch all and filter client-side
    const teas = await getAllBubbleTeas();
    return teas.filter(tea => 
      tea.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching bubble teas:", error);
    throw error;
  }
}

// 新增: 根据类别获取奶茶
export async function getBubbleTeasByCategory(category) {
  try {
    const teaCollection = collection(db, TEAS_COLLECTION);
    const q = query(teaCollection, where("category", "==", category));
    const teaSnapshot = await getDocs(q);
    
    return teaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting bubble teas by category ${category}:`, error);
    throw error;
  }
}

// Get user favorites
export async function getUserFavorites(userId) {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );
    
    const favSnapshot = await getDocs(favoritesQuery);
    return favSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw error;
  }
}

// Add a tea to user favorites
export async function addToFavorites(userId, teaId) {
  try {
    // Check if already in favorites to avoid duplicates
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("teaId", "==", teaId)
    );
    
    const querySnapshot = await getDocs(favoritesQuery);
    
    if (querySnapshot.empty) {
      // Not in favorites, add it
      await addDoc(collection(db, FAVORITES_COLLECTION), {
        userId,
        teaId,
        addedAt: new Date()
      });
      return true;
    }
    
    return false; // Already in favorites
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

// Remove a tea from user favorites
export async function removeFromFavorites(userId, teaId) {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("teaId", "==", teaId)
    );
    
    const querySnapshot = await getDocs(favoritesQuery);
    
    if (!querySnapshot.empty) {
      // Found in favorites, remove it
      const favoriteDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteDoc.id));
      return true;
    }
    
    return false; // Not in favorites
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

// Check if a tea is in user favorites
export async function isTeaInFavorites(userId, teaId) {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("teaId", "==", teaId)
    );
    
    const querySnapshot = await getDocs(favoritesQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking favorites:", error);
    throw error;
  }
}