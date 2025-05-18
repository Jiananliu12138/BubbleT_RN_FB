// src/presenters/allTeasPresenter.jsx
import { observer } from "mobx-react-lite";
import { AllTeasView } from "../views/allTeasView";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

export const AllTeas = observer(function AllTeas(props) {
  const { tea } = props.model;
  const params = useLocalSearchParams();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filteredTeas, setFilteredTeas] = useState([]);
  const { source } = params; // 获取来源页面参数 - 'featured' 或 'popular'

  // 初始加载时根据source参数确定要显示的页面标题和数据
  useEffect(() => {
    // 确保所有奶茶数据已加载
    if (tea.allTeas.length === 0) {
      tea.loadAllTeas();
    }
    
    // 根据source参数设置标题和筛选数据
    if (source === "featured") {
      // 如果是从"精选推荐"进来的，可以展示所有奶茶
      setFilteredTeas(tea.allTeas);
    } else if (source === "popular") {
      // 如果是从"热门推荐"进来的，可以根据某种规则筛选受欢迎的奶茶
      // 这里模拟热门奶茶，例如取前5个
      setFilteredTeas(tea.allTeas.slice(0, Math.min(5, tea.allTeas.length)));
    } else {
      // 默认显示所有奶茶
      setFilteredTeas(tea.allTeas);
    }
  }, [tea.allTeas, source]);

  // 当类别变化时筛选奶茶
  useEffect(() => {
    if (currentCategory) {
      const teasByCategory = tea.allTeas.filter(t => t.category === currentCategory);
      setFilteredTeas(teasByCategory);
    } else {
      // 如果没有选择类别，则根据source参数显示相应的奶茶
      if (source === "featured") {
        setFilteredTeas(tea.allTeas);
      } else if (source === "popular") {
        setFilteredTeas(tea.allTeas.slice(0, Math.min(5, tea.allTeas.length)));
      } else {
        setFilteredTeas(tea.allTeas);
      }
    }
  }, [currentCategory, tea.allTeas, source]);

  // 处理奶茶选择
  function handleTeaSelectedACB(selectedTea) {
    tea.setCurrentTeaId(selectedTea.id);
    router.push("/details");
  }

  // 处理返回上一页
  function handleBackACB() {
    router.back();
  }

  // 处理类别选择
  function handleCategorySelectACB(category) {
    setCurrentCategory(category);
  }

  // 获取页面标题
  function getPageTitle() {
    if (source === "featured") {
      return "精选奶茶";
    } else if (source === "popular") {
      return "热门奶茶";
    }
    return "全部奶茶";
  }

  return (
    <AllTeasView
      teas={filteredTeas}
      onTeaSelected={handleTeaSelectedACB}
      onBackPress={handleBackACB}
      title={getPageTitle()}
      onCategorySelect={handleCategorySelectACB}
      currentCategory={currentCategory}
    />
  );
});