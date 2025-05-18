// src/models/BubbleTeaModel.js
import { 
  getAllBubbleTeas, 
  getBubbleTeaById, 
  searchBubbleTeas,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  isTeaInFavorites
} from "../services/teaService";
import { resolvePromise } from "../services/resolvePromise";

export const bubbleTeaModel = {
  // App state
  ready: false,
  
  // User state 
  currentUser: null,
  
  // Bubble tea data
  allTeas: [],
  currentTeaId: null,
  favorites: [],
  
  // Search and filter state
  searchQuery: "",
  selectedCategory: null, // 新增: 当前选中的类别
  
  // Promise states
  allTeasPromiseState: {},
  currentTeaPromiseState: {},
  favoritesPromiseState: {},
  searchResultsPromiseState: {},
  categoryResultsPromiseState: {}, // 新增: 类别筛选结果状态
  
  // Methods to update state
  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      this.loadFavorites();
    } else {
      this.favorites = [];
      this.favoritesPromiseState = {};
    }
  },
  
  setCurrentTeaId(teaId) {
    this.currentTeaId = teaId;
    this.loadCurrentTea();
  },
  
  setSearchQuery(query) {
    this.searchQuery = query;
  },
  
  // 新增: 设置当前选中的类别
  setSelectedCategory(category) {
    this.selectedCategory = category;
    if (category) {
      this.loadTeasByCategory(category);
    } else {
      this.categoryResultsPromiseState = {};
    }
  },
  
  // Data loading methods
  async loadAllTeas() {
    try {
      const promise = getAllBubbleTeas();
      resolvePromise(promise, this.allTeasPromiseState);
      
      const teas = await promise;
      this.allTeas = teas;
      this.ready = true;
      return teas;
    } catch (error) {
      console.error("Error loading all teas:", error);
      throw error;
    }
  },
  
  async loadCurrentTea() {
    if (!this.currentTeaId) {
      this.currentTeaPromiseState = {};
      return null;
    }
    
    try {
      const promise = getBubbleTeaById(this.currentTeaId);
      resolvePromise(promise, this.currentTeaPromiseState);
      
      const tea = await promise;
      
      // Check if in favorites
      if (this.currentUser) {
        const isFavorite = await isTeaInFavorites(
          this.currentUser.uid, 
          this.currentTeaId
        );
        tea.isFavorite = isFavorite;
      }
      
      return tea;
    } catch (error) {
      console.error("Error loading current tea:", error);
      throw error;
    }
  },
  
  async loadFavorites() {
    if (!this.currentUser) return;
    
    try {
      const favoritesPromise = getUserFavorites(this.currentUser.uid);
      resolvePromise(favoritesPromise, this.favoritesPromiseState);
      
      const favoritesData = await favoritesPromise;
      
      // Get full tea details for each favorite
      const favoriteTeaIds = favoritesData.map(fav => fav.teaId);
      const favoriteTeaDetails = [];
      
      for (const teaId of favoriteTeaIds) {
        try {
          const tea = await getBubbleTeaById(teaId);
          favoriteTeaDetails.push(tea);
        } catch (error) {
          console.error(`Error loading favorite tea ${teaId}:`, error);
        }
      }
      
      this.favorites = favoriteTeaDetails;
      
      return favoriteTeaDetails;
    } catch (error) {
      console.error("Error loading favorites:", error);
      throw error;
    }
  },
  
  async doSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResultsPromiseState = {};
      return;
    }
    
    try {
      const searchPromise = searchBubbleTeas(this.searchQuery);
      resolvePromise(searchPromise, this.searchResultsPromiseState);
      
      const results = await searchPromise;
      return results;
    } catch (error) {
      console.error("Error searching teas:", error);
      throw error;
    }
  },
  
  // 新增: 按类别加载奶茶
  async loadTeasByCategory(category) {
    if (!category) {
      this.categoryResultsPromiseState = {};
      return;
    }
    
    try {
      // 使用本地过滤，因为我们已经有了所有奶茶数据
      // 如果数据量大，可以修改 teaService 添加按类别获取的服务
      const filterPromise = new Promise((resolve) => {
        // 确保我们已经加载了所有奶茶
        if (this.allTeas.length === 0) {
          this.loadAllTeas().then(() => {
            const filteredTeas = this.allTeas.filter(tea => tea.category === category);
            resolve(filteredTeas);
          });
        } else {
          const filteredTeas = this.allTeas.filter(tea => tea.category === category);
          resolve(filteredTeas);
        }
      });
      
      resolvePromise(filterPromise, this.categoryResultsPromiseState);
      
      const results = await filterPromise;
      return results;
    } catch (error) {
      console.error(`Error loading teas by category ${category}:`, error);
      throw error;
    }
  },
  
  // Favorite management methods
  async addToFavorites(tea) {
    if (!this.currentUser) return false;
    
    try {
      await addToFavorites(this.currentUser.uid, tea.id);
      await this.loadFavorites(); // Refresh favorites list
      
      // Update current tea if it's the one we just favorited
      if (this.currentTeaPromiseState.data && this.currentTeaPromiseState.data.id === tea.id) {
        this.currentTeaPromiseState.data.isFavorite = true;
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return false;
    }
  },
  
  async removeFromFavorites(tea) {
    if (!this.currentUser) return false;
    
    try {
      await removeFromFavorites(this.currentUser.uid, tea.id);
      await this.loadFavorites(); // Refresh favorites list
      
      // Update current tea if it's the one we just unfavorited
      if (this.currentTeaPromiseState.data && this.currentTeaPromiseState.data.id === tea.id) {
        this.currentTeaPromiseState.data.isFavorite = false;
      }
      
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return false;
    }
  },
};