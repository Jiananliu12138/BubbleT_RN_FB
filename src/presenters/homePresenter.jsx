// src/presenters/homePresenter.jsx - Only modifying the teaSelectedACB function
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/homeView";
import { LoadingView } from "../views/commonComponents/loadingView";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Sidebar } from "./sidebarPresenter";

export const Home = observer(function Home(props) {
  const { tea, user } = props.model;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [filteredTeas, setFilteredTeas] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedTeaId, setRecommendedTeaId] = useState(null);

  // Initialize and update filtered results on category changes
  useEffect(() => {
    if (currentCategory) {
      if (tea.categoryResultsPromiseState.data) {
        setFilteredTeas(tea.categoryResultsPromiseState.data);
      } else {
        setFilteredTeas([]);
      }
    } else {
      setFilteredTeas(tea.allTeas);
    }
  }, [currentCategory, tea.categoryResultsPromiseState.data, tea.allTeas]);

  // Listen for search results
  useEffect(() => {
    if (tea.searchResultsPromiseState.data) {
      setSearchResults(tea.searchResultsPromiseState.data);
    }
  }, [tea.searchResultsPromiseState.data]);

  // Randomly select a recommended tea ID
  useEffect(() => {
    if (tea.allTeas && tea.allTeas.length > 0) {
      const randomIndex = Math.floor(Math.random() * tea.allTeas.length);
      setRecommendedTeaId(tea.allTeas[randomIndex].id);
    }
  }, [tea.allTeas]);

  // Refresh recommendation
  function refreshRecommendationACB() {
    if (tea.allTeas && tea.allTeas.length > 0) {
      const randomIndex = Math.floor(Math.random() * tea.allTeas.length);
      setRecommendedTeaId(tea.allTeas[randomIndex].id);
    }
  }

  // Handle category selection
  function handleCategorySelectACB(category) {
    if (currentCategory === category) {
      // Clicking the same category cancels filtering
      setCurrentCategory(null);
      tea.setSelectedCategory(null);
    } else {
      setCurrentCategory(category);
      tea.setSelectedCategory(category);
    }
    // Exit search mode
    setSearchActive(false);
  }

  // Handle tea selection - MODIFIED to include source parameter
  function teaSelectedACB(selectedTea) {
    // Prevent duplicate clicks
    if (isNavigating) return;
    setIsNavigating(true);
    
    console.log("Selected tea:", selectedTea.id);
    tea.setCurrentTeaId(selectedTea.id);
    
    // Use setTimeout to ensure state updates before navigation
    setTimeout(() => {
      router.push({
        pathname: "/details",
        params: { source: "home" }
      });
      
      // Reset state after navigation
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }, 0);
  }

  // Handle search query change
  function handleSearchQueryChangeACB(query) {
    tea.setSearchQuery(query);
  }
  
  // Trigger search
  function handleSearchACB() {
    tea.doSearch();
    setSearchActive(true);
  }
  
  // Cancel search
  function handleCancelSearchACB() {
    setSearchActive(false);
    tea.setSearchQuery("");
  }
  
  // Toggle sidebar
  function toggleSidebarACB() {
    setSidebarVisible(!sidebarVisible);
  }
  
  // Close sidebar
  function closeSidebarACB() {
    setSidebarVisible(false);
  }

  // Handle "More" button click - Featured recommendations
  function handleFeaturedMoreACB() {
    router.push({
      pathname: "/all-teas",
      params: { source: "featured" }
    });
  }

  // Handle "More" button click - Popular recommendations
  function handlePopularMoreACB() {
    router.push({
      pathname: "/all-teas",
      params: { source: "popular" }
    });
  }

  // Check if search is loading
  const isSearchLoading = tea.searchResultsPromiseState.promise && 
                         !tea.searchResultsPromiseState.data && 
                         !tea.searchResultsPromiseState.error;

  // Show loading state
  if (tea.allTeasPromiseState.promise && !tea.allTeasPromiseState.data) {
    return <LoadingView message="Loading bubble tea list..." />;
  }

  // Show error state
  if (tea.allTeasPromiseState.error) {
    return <LoadingView error={tea.allTeasPromiseState.error} />;
  }

  // Category filtering loading state
  const isCategoryLoading = currentCategory && 
                           tea.categoryResultsPromiseState.promise && 
                           !tea.categoryResultsPromiseState.data;

  // Category filtering error state
  const hasCategoryError = tea.categoryResultsPromiseState.error;

  // Determine which tea list to display
  let teaList;
  if (searchActive) {
    teaList = searchResults;
  } else if (currentCategory) {
    teaList = filteredTeas;
  } else {
    teaList = tea.allTeas;
  }

  // Get recommended tea
  const recommendedTea = tea.allTeas.find(t => t.id === recommendedTeaId) || (tea.allTeas.length > 0 ? tea.allTeas[0] : null);

  // Render home view
  return (
    <>
      {sidebarVisible && (
        <Sidebar 
          model={props.model} 
          onClose={closeSidebarACB}
        />
      )}
      <HomeView
        teas={teaList}
        onTeaSelected={teaSelectedACB}
        currentUser={user.currentUser}
        onMenuPress={toggleSidebarACB}
        onCategorySelect={handleCategorySelectACB}
        currentCategory={currentCategory}
        isCategoryLoading={isCategoryLoading}
        categoryError={hasCategoryError}
        
        // Search related
        searchQuery={tea.searchQuery}
        onSearchQueryChange={handleSearchQueryChangeACB}
        onSearch={handleSearchACB}
        onCancelSearch={handleCancelSearchACB}
        isSearchLoading={isSearchLoading}
        searchActive={searchActive}
        
        // Recommendation related
        recommendedTea={recommendedTea}
        onRefreshRecommendation={refreshRecommendationACB}
        
        // "More" button handlers
        onFeaturedMorePress={handleFeaturedMoreACB}
        onPopularMorePress={handlePopularMoreACB}
      />
    </>
  );
});