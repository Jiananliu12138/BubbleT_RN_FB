import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Animated,
  Platform
} from "react-native";
import { Icon } from '../components/IconComponent';
import { useState, useRef, useEffect } from "react";
import { TeaListView } from "./teaListView";

// 统一的配色方案 - 黄色系
const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色 (原 #a7b794 淡绿色)
  primaryDark: "#f7bd10",  // 深一点的主色调 (原 #8a9977 深绿色)
  accent: "#f7bd10",       // 强调色：深黄色 (原 #8a2be2 紫色)
  accentLight: "#f8ca69",  // 浅一点的强调色 (原 #b57eeb 浅紫色)
  background: "#f8f8f8",   // 背景色：浅灰色
  cardBackground: "#fff",  // 卡片背景：白色
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色 (原 #e0e0e0 浅灰色)
  teaGreen: "#f7bd10",     // 茶色：用于推荐卡片中的文字 (原 #567354 绿茶色)
};

export function HomeView({ 
  teas, 
  onTeaSelected, 
  currentUser,
  onMenuPress,
  onCategorySelect,
  currentCategory,
  isCategoryLoading,
  categoryError,
  
  // 搜索相关属性
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onCancelSearch,
  isSearchLoading,
  searchActive,
  
  // 推荐相关属性
  recommendedTea,
  onRefreshRecommendation,
  
  // 新增: 更多按钮点击处理函数
  onFeaturedMorePress,
  onPopularMorePress
}) {
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const searchBarHeight = useRef(new Animated.Value(40)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // 搜索框动画
    Animated.timing(searchBarHeight, {
      toValue: searchBarFocused ? 50 : 40,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [searchBarFocused]);

  // 如果没有奶茶数据
  if (!teas || (teas.length === 0 && !searchActive)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bubble tea data available</Text>
      </View>
    );
  }

  // 确保有足够的数据来显示推荐和精选
  const featuredTeas = [];
  // 确保我们有足够的茶来填充UI
  for (let i = 0; i < 5; i++) {
    if (teas[i] && !searchActive) {
      featuredTeas.push(teas[i]);
    } else {
      // 如果没有足够的茶数据，使用默认值
      featuredTeas.push({
        id: `default-${i}`,
        name: "Bubble Tea",
        description: "Delicious Bubble Tea",
        imageUrl: "https://via.placeholder.com/150?text=Tea"
      });
    }
  }

  // 处理分类点击
  function handleCategoryPressACB(category) {
    onCategorySelect(category);
  }

  // 处理搜索栏焦点
  function handleSearchFocusACB() {
    setSearchBarFocused(true);
    setExpanded(true);
  }

  // 处理搜索栏失焦
  function handleSearchBlurACB() {
    setSearchBarFocused(false);
    if (!searchQuery) {
      setExpanded(false);
    }
  }

  // 处理搜索提交
  function handleSearchSubmitACB() {
    onSearch();
  }

  // 处理搜索输入变化
  function handleSearchChangeACB(text) {
    onSearchQueryChange(text);
  }

  // 截取描述文本，确保不会太长
  function truncateDescriptionACB(description, maxLength = 50) {
    if (!description) return "暂无描述";
    return description.length > maxLength 
      ? description.substring(0, maxLength) + "..." 
      : description;
  }

  // 渲染搜索栏
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Animated.View 
        style={[
          styles.searchBarWrapper,
          { height: searchBarHeight }
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search bubble teas..."
          value={searchQuery}
          onChangeText={handleSearchChangeACB}
          onFocus={handleSearchFocusACB}
          onBlur={handleSearchBlurACB}
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmitACB}
        />
        {expanded && (
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchQuery ? handleSearchSubmitACB : null}
          >
            <Icon name="search-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {searchActive && (
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={onCancelSearch}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // 渲染搜索结果
  if (searchActive) {
    return (
      <View style={styles.container}>
        {/* 搜索导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Icon name="menu-outline" size={24} color="#000" />
          </TouchableOpacity>
          
          {/* 替换 logo 为文本 */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Bubble Tea Enthusiast</Text>
          </View>
        </View>

        {/* 搜索栏 */}
        {renderSearchBar()}

        {/* 搜索结果 */}
        {isSearchLoading ? (
          <View style={styles.searchLoadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.searchLoadingText}>Searching...</Text>
          </View>
        ) : teas.length > 0 ? (
          <TeaListView teas={teas} onTeaSelected={onTeaSelected} />
        ) : (
          <View style={styles.noResultContainer}>
            <Icon name="search-outline" size={60} color="#ddd" />
            <Text style={styles.noResultText}>No results found for "${searchQuery}"</Text>
            <Text style={styles.noResultSubText}>Try searching with different keywords</Text>
          </View>
        )}
      </View>
    );
  }

  // 正常显示主页
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* 搜索导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Icon name="menu-outline" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* 替换 logo 为文本 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Bubble Tea Enthusiast</Text>
        </View>
      </View>

      {/* 搜索栏 */}
      {renderSearchBar()}

      {/* 分类图标 */}
      <View style={styles.categoriesContainer}>
        {[
          { id: 1, name: "Milk Cap", icon: "ice-cream-outline" },
          { id: 2, name: "Milk Tea", icon: "cafe-outline" },
          { id: 3, name: "Coffee", icon: "cafe-outline" },
          { id: 4, name: "Fruit Tea", icon: "wine-outline" },
          { id: 5, name: "Herbal Tea", icon: "leaf-outline" },
        ].map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[
              styles.categoryItem,
              currentCategory === category.name && styles.categoryItemActive
            ]}
            onPress={() => handleCategoryPressACB(category.name)}
          >
            <View style={[
              styles.categoryIcon,
              currentCategory === category.name && styles.categoryIconActive
            ]}>
              <Icon 
                name={category.icon} 
                size={28} 
                color={currentCategory === category.name ? COLORS.accent : "#fff"} 
              />
            </View>
            <Text style={[
              styles.categoryName,
              currentCategory === category.name && styles.categoryNameActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 类别筛选加载中状态 */}
      {isCategoryLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading ${currentCategory}...</Text>
        </View>
      )}

      {/* 类别筛选错误状态 */}
      {categoryError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={40} color="#ff6b6b" />
          <Text style={styles.errorText}>Loading failed, please try again</Text>
        </View>
      )}

      {/* 当前分类标题 */}
      {currentCategory && !isCategoryLoading && !categoryError && (
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{currentCategory}</Text>
          <TouchableOpacity onPress={() => handleCategoryPressACB(currentCategory)}>
            <Text style={styles.resetFilter}>Reset Filter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 精选推荐 - 仅在非筛选模式下显示 */}
      {!currentCategory && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Recommendations</Text>
            <TouchableOpacity onPress={onFeaturedMorePress}>
              <Text style={styles.seeMore}>More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredGrid}>
            {/* 左侧大图 */}
            <TouchableOpacity 
              style={styles.largeFeatureItem}
              onPress={() => onTeaSelected(featuredTeas[0])}
            >
              <Image
                source={{ uri: featuredTeas[0].imageUrl }}
                style={styles.largeFeatureImage}
                resizeMode="cover"
                defaultSource={require('../assets/placeholder.png')}
              />
            </TouchableOpacity>

            {/* 右侧四个小图 */}
            <View style={styles.smallFeaturesContainer}>
              <View style={styles.smallFeaturesRow}>
                <TouchableOpacity 
                  style={styles.smallFeatureItem}
                  onPress={() => onTeaSelected(featuredTeas[1])}
                >
                  <Image
                    source={{ uri: featuredTeas[1].imageUrl }}
                    style={styles.smallFeatureImage}
                    resizeMode="cover"
                    defaultSource={require('../assets/placeholder.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.smallFeatureItem}
                  onPress={() => onTeaSelected(featuredTeas[2])}
                >
                  <Image
                    source={{ uri: featuredTeas[2].imageUrl }}
                    style={styles.smallFeatureImage}
                    resizeMode="cover"
                    defaultSource={require('../assets/placeholder.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.smallFeaturesRow}>
                <TouchableOpacity 
                  style={styles.smallFeatureItem}
                  onPress={() => onTeaSelected(featuredTeas[3])}
                >
                  <Image
                    source={{ uri: featuredTeas[3].imageUrl }}
                    style={styles.smallFeatureImage}
                    resizeMode="cover"
                    defaultSource={require('../assets/placeholder.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.smallFeatureItem}
                  onPress={() => onTeaSelected(featuredTeas[4])}
                >
                  <Image
                    source={{ uri: featuredTeas[4].imageUrl }}
                    style={styles.smallFeatureImage}
                    resizeMode="cover"
                    defaultSource={require('../assets/placeholder.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {!currentCategory && recommendedTea && (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity onPress={onRefreshRecommendation}>
            <Text style={styles.seeMore}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* 票据式推荐卡片 - 修改后 */}
        <View style={styles.ticketWrapper}>
          <TouchableOpacity 
            style={styles.ticketRecommendationCard}
            onPress={() => onTeaSelected(recommendedTea)}
          >
            {/* 左侧包含图片和文字描述 */}
            <View style={styles.ticketLeftSection}>
              <Image
                source={{ uri: recommendedTea.imageUrl }}
                style={styles.ticketImage}
                resizeMode="cover"
                defaultSource={require('../assets/placeholder.png')}
              />
              <View style={styles.ticketTextContainer}>
                <Text style={styles.ticketTitle}>{recommendedTea.name}</Text>
                <Text style={styles.ticketDescription} numberOfLines={2}>
                  {truncateDescriptionACB(recommendedTea.description)}
                </Text>
              </View>
            </View>
            
            {/* 右侧显示类别 */}
            <View style={styles.ticketCategoryContainer}>
              <Text style={styles.ticketCategoryText}>
                {recommendedTea.category}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* 虚线和切口容器 - 独立覆盖在卡片上，位置调整到70% */}
          <View style={styles.perforationContainer}>
            <View style={styles.topCircle} />
            <View style={styles.dashedLine} />
            <View style={styles.bottomCircle} />
          </View>
        </View>
      </View>
    )}

      {/* 显示全部或按类别筛选结果 */}
      <View style={[styles.sectionContainer, {marginBottom: 50}]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {currentCategory ? `${currentCategory} List` : "Popular Recommendations"}
          </Text>
          {!currentCategory && (
            <TouchableOpacity onPress={onPopularMorePress}>
              <Text style={styles.seeMore}>More</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.teaListContainer}>
          {teas.slice(0, currentCategory ? teas.length : 4).map((tea, index) => (
            <TouchableOpacity 
              key={tea.id || index}
              style={styles.teaItem}
              onPress={() => onTeaSelected(tea)}
            >
              <Image
                source={{ uri: tea.imageUrl }}
                style={styles.teaItemImage}
                resizeMode="cover"
                defaultSource={require('../assets/placeholder.png')}
              />
              <View style={styles.teaItemInfo}>
                <Text style={styles.teaItemName} numberOfLines={1}>{tea.name}</Text>
                <Text style={styles.teaItemPrep}>Prep time: {tea.prepTime}min</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // 黄色背景
    paddingTop: 0, // 确保没有顶部填充
  },
  contentContainer: {
    paddingBottom: 30, // 大幅增加底部填充以确保可以滚动到底部
    flexGrow: 1, // 确保内容可以占满整个滚动区域
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  emptyText: {
    fontSize: 16,
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuButton: {
    padding: 8,
    borderRadius: 5,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // 新增 logo 文本样式
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.5,
  },
  // 更新后的搜索相关样式
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 5,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  cancelButton: {
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  cancelText: {
    color: "#000",
    fontSize: 14,
  },
  // 搜索结果相关样式
  searchLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.text,
  },
  noResultSubText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 10,
    backgroundColor: COLORS.primaryDark, // 深黄色的分类容器
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  categoryItem: {
    alignItems: "center",
    width: 65,
    
  },
  categoryItemActive: {
    // 选中状态样式
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // 半透明白色
  },
  categoryIconActive: {
    backgroundColor: "white", // 选中状态背景色
  },
  categoryName: {
    fontSize: 12,
    color: "white",
  },
  categoryNameActive: {
    color: "#000000", // 选中状态文字颜色 - 现在是深黄色
    fontWeight: "bold",
  },
  // 加载状态样式
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "white",
  },
  // 错误状态样式
  errorContainer: {
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: "#ff6b6b",
  },
  // 类别标题样式
  categoryTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 15,
    paddingVertical: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  resetFilter: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  seeMore: {
    fontSize: 14,
    color: "#000",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  featuredGrid: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    height: 300, // 设置固定高度
  },
  largeFeatureItem: {
    flex: 1,
    marginRight: 8,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  largeFeatureImage: {
    width: "100%",
    height: "100%",
  },
  smallFeaturesContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  smallFeaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "48%", // 设置为高度的48%
    marginBottom: 8,
  },
  smallFeatureItem: {
    width: "48%",
    height: "100%", // 高度设为100%
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  smallFeatureImage: {
    width: "100%",
    height: "100%",
  },
  
  // 票据式推荐卡片样式 - 修改后
  ticketWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  ticketRecommendationCard: {
    flexDirection: "row",
    height: 150,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  // 左侧包含图片和文字描述
  ticketLeftSection: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 5, // 添加右侧内边距，为虚线留出空间
  },
  ticketImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,

  },
  ticketTextContainer: {
    flex: 1,
    paddingRight: 5, // 确保文字不会太靠近虚线
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.teaGreen, // 现在是黄色
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLORS.teaGreen, // 现在是黄色
    lineHeight: 20,
  },
  // 右侧类别 - 白底黑字
  ticketCategoryContainer: {
    width: 80, // 固定宽度
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20, // 添加左侧内边距，为虚线留出空间

  },
  ticketCategoryText: {
    transform: [{ rotate: '90deg' }], // 旋转文本使其垂直显示
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    width: 100, // 确保旋转后的文本有足够空间
    textAlign: "center",
  },
  // 虚线和切口容器 - 覆盖在卡片上 - 位置改为80%
  perforationContainer: {
    position: "absolute",
    left: "80%",
    top: 0,
    height: "100%",
    width: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5, // 确保虚线显示在卡片上方
  },
  dashedLine: {
    height: "100%",
    width: 1,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  // 上下的圆形切口 - 确保与虚线对齐
  topCircle: {
    position: "absolute",
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary, // 使用背景色 - 现在是黄色
    zIndex: 10,

  },
  bottomCircle: {
    position: "absolute",
    bottom: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary, // 使用背景色 - 现在是黄色
    zIndex: 10,
  },
  
  // 茶列表样式
  teaListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  teaItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  teaItemImage: {
    width: '100%', // 或者指定固定宽度，如 200
    height: undefined, // 高度由 aspectRatio 决定
    aspectRatio: 0.7, // 默认使用 1:1 比例，你可以根据你的图片实际比例调整
    resizeMode: 'cover', // 确保图片覆盖整个容器，同时保持比例
    overflow: 'hidden', // 可选，如果需要圆角等效果
  },
  teaItemInfo: {
    padding: 10,
  },
  teaItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  teaItemPrep: {
    fontSize: 12,
    color: COLORS.accent,
  },
});