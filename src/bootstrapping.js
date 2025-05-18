// src/bootstrapping.js
import { configure, observable, reaction } from "mobx";
import { bubbleTeaModel } from "./models/BubbleTeaModel";
import { userModel } from "./models/UserModel";
import { MapModel } from "./models/MapModel";
import { AiChatModel } from "./models/AiChatModel";
import { communityModel } from "./models/CommunityModel";
import 'react-native-get-random-values';

// Configure MobX
configure({ enforceActions: "never" });

// Create reactive models with MobX
export const reactiveBubbleTeaModel = observable(bubbleTeaModel);
export const reactiveUserModel = observable(userModel);
export const reactAiChatModel = observable(AiChatModel);
export const reactMapModel = MapModel;
export const reactiveCommunityModel = observable(communityModel);

// Setup auth state observation
reactiveUserModel.initAuth((user) => {
  reactiveBubbleTeaModel.setCurrentUser(user);
  // Reset community data when user logs out
  if (!user && reactiveCommunityModel.allPosts.length > 0) {
    reactiveCommunityModel.resetStates();
  }
});

// Watch for changes to currentTeaId
function teaIdChangeACB() {
  return reactiveBubbleTeaModel.currentTeaId;
}

function teaIdUpdateACB() {
  reactiveBubbleTeaModel.loadCurrentTea();
}

// Establish reaction for tea ID changes
reaction(teaIdChangeACB, teaIdUpdateACB);

// Watch for search query changes
function searchQueryChangeACB() {
  return reactiveBubbleTeaModel.searchQuery;
}

function searchQueryUpdateACB() {
  reactiveBubbleTeaModel.doSearch();
}

// Establish reaction for search query changes
reaction(searchQueryChangeACB, searchQueryUpdateACB);

// Add models to global for debugging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  global.teaModel = reactiveBubbleTeaModel;
  global.userModel = reactiveUserModel;
  global.mapModel = reactMapModel;
  global.communityModel = reactiveCommunityModel;
}

// Initialize data loading
reactiveBubbleTeaModel.loadAllTeas();

// Export a convenience object with all models
export const reactiveModel = {
  tea: reactiveBubbleTeaModel,
  user: reactiveUserModel,
  map: reactMapModel,
  ai: reactAiChatModel,
  community: reactiveCommunityModel
};