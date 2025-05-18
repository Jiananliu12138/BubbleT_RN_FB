// src/presenters/searchPresenter.jsx
import { observer } from "mobx-react-lite";
import { SearchView } from "../views/searchView";
import { router } from "expo-router";
import { useState } from "react";
import { Sidebar } from "./sidebarPresenter";

export const Search = observer(function Search(props) {
  const { tea, user } = props.model;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Handle search query changes
  function searchQueryChangeACB(query) {
    tea.setSearchQuery(query);
  }
  
  // Trigger search
  function searchACB() {
    tea.doSearch();
  }
  
  // Handle tea selection
  function teaSelectedACB(selectedTea) {
    tea.setCurrentTeaId(selectedTea.id);
    router.push("/details");
  }
  
  // 处理侧边栏显示
  function toggleSidebarACB() {
    setSidebarVisible(!sidebarVisible);
  }
  
  // 关闭侧边栏
  function closeSidebarACB() {
    setSidebarVisible(false);
  }
  
  // Get search results if available
  const searchResults = tea.searchResultsPromiseState.data || [];
  
  // Check if search is loading
  const isLoading = tea.searchResultsPromiseState.promise && 
                    !tea.searchResultsPromiseState.data && 
                    !tea.searchResultsPromiseState.error;
  
  return (
    <>
      {sidebarVisible && (
        <Sidebar 
          model={props.model} 
          onClose={closeSidebarACB}
        />
      )}
      <SearchView
        searchQuery={tea.searchQuery}
        onSearchQueryChange={searchQueryChangeACB}
        onSearch={searchACB}
        searchResults={searchResults}
        onTeaSelected={teaSelectedACB}
        isLoading={isLoading}
        onMenuPress={toggleSidebarACB}
      />
    </>
  );
});