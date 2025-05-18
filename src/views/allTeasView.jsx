// src/views/allTeasView.jsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView
} from "react-native";
import { Icon } from '../components/IconComponent';
import { useState } from "react";

const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色
  primaryDark: "#f7bd10",  // 深一点的黄色
  accent: "#f7bd10",       // 强调色：深黄色
  accentLight: "#f8ca69",  // 浅黄色
  background: "#f8ca69",   // 背景色：统一为黄色
  cardBackground: "#fff",  // 卡片背景保持白色
  text: "#333333",         // 文本保持不变
  textSecondary: "#666666",// 次要文本保持不变
  border: "#000000"        // 边框保持黑色
};

export function AllTeasView({
  teas,
  onTeaSelected,
  onBackPress,
  title,
  showCategories = true,
  onCategorySelect,
  currentCategory
}) {
  const [sortOption, setSortOption] = useState("default"); // default, name, prepTime
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 所有可能的分类
  const categories = [
    { id: 1, name: "Milk Cap", icon: "ice-cream-outline" },
    { id: 2, name: "Milk Tea", icon: "cafe-outline" },
    { id: 3, name: "Coffee", icon: "cafe-outline" },
    { id: 4, name: "Fruit Tea", icon: "wine-outline" },
    { id: 5, name: "Herbal Tea", icon: "leaf-outline" },
  ];

  // 处理排序逻辑
  const sortedTeas = [...teas].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "prepTime") {
      return (a.prepTime || 0) - (b.prepTime || 0);
    }
    return 0; // 默认排序(按原始顺序)
  });

  // 处理搜索过滤
  const filteredTeas = sortedTeas.filter(tea =>
    tea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tea.description && tea.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 处理排序选项点击
  function handleSortOptionPress(option) {
    setSortOption(option);
    setShowSortOptions(false);
  }

  // 处理搜索输入变化
  function handleSearchChange(text) {
    setSearchQuery(text);
  }

  // 渲染单个茶项目
  function renderTeaItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.teaCard}
        onPress={() => onTeaSelected(item)}
      >
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
          style={styles.teaImage}
          defaultSource={require('../assets/placeholder.png')}
        />
        <View style={styles.teaInfo}>
          <Text style={styles.teaName}>{item.name}</Text>
          {item.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
          <Text style={styles.teaPrep}>制作时间: {item.prepTime || "未知"} 分钟</Text>
          <Text numberOfLines={2} style={styles.teaDescription}>
            {item.description || "暂无描述"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "All Bubble Teas"}</Text>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortOptions(!showSortOptions)}>
          <Icon name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 排序选项下拉菜单 */}
      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === "default" && styles.selectedSortOption]}
            onPress={() => handleSortOptionPress("default")}
          >
            <Text style={styles.sortOptionText}>Default Sort</Text>
            {sortOption === "default" && (
              <Icon name="checkmark" size={18} color={COLORS.accent} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === "name" && styles.selectedSortOption]}
            onPress={() => handleSortOptionPress("name")}
          >
            <Text style={styles.sortOptionText}>Sort by Name</Text>
            {sortOption === "name" && (
              <Icon name="checkmark" size={18} color={COLORS.accent} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === "prepTime" && styles.selectedSortOption]}
            onPress={() => handleSortOptionPress("prepTime")}
          >
            <Text style={styles.sortOptionText}>Sort by Prep Time</Text>
            {sortOption === "prepTime" && (
              <Icon name="checkmark" size={18} color={COLORS.accent} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bubble teas..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 分类横向滚动 */}
      {showCategories && (
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                currentCategory === null && styles.activeCategoryButton
              ]}
              onPress={() => onCategorySelect(null)}
            >
              <Icon 
                name="grid-outline" 
                size={18} 
                color={currentCategory === null ? "#fff" : COLORS.accent} 
              />
              <Text style={[
                styles.categoryButtonText,
                currentCategory === null && styles.activeCategoryText
              ]}>All</Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  currentCategory === category.name && styles.activeCategoryButton
                ]}
                onPress={() => onCategorySelect(category.name)}
              >
                <Icon
                  name={category.icon}
                  size={18}
                  color={currentCategory === category.name ? "#fff" : COLORS.accent}
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryButtonText,
                  currentCategory === category.name && styles.activeCategoryText
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 列表内容 */}
      <FlatList
        data={filteredTeas}
        renderItem={renderTeaItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="cafe-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyText}>
              {searchQuery ? `No bubble teas found containing "${searchQuery}"` : "No bubble tea data available"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // 统一为黄色
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  sortButton: {
    padding: 8,
  },
  sortOptionsContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  selectedSortOption: {
    backgroundColor: "rgba(138, 43, 226, 0.1)",
  },
  sortOptionText: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 20,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.primary, // 改为黄色
    borderBottomLeftRadius: 0,       // 移除圆角
    borderBottomRightRadius: 0,      // 移除圆角
    shadowColor: "transparent",      // 移除阴影
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,                    // 移除阴影
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16, // 增加内边距
    height: 50, // 增加高度
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12, // 增加垂直内边距
    marginLeft: 8,
    fontSize: 15, // 增加字体大小
  },
  // 添加一个包裹分类容器的外层容器
  categoriesWrapper: {
    backgroundColor: COLORS.primary, // 改为相同的黄色
    paddingVertical: 10,
    marginBottom: 0,                 // 移除底部间距
    
  },
  categoriesContainer: {
    height: 45, // 设置适当的高度
  },
  categoriesContent: {
    paddingHorizontal: 16,
    alignItems: "center", // 垂直居中对齐
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // 增加按钮高度
    paddingHorizontal: 16, // 增加水平内边距
    borderRadius: 20, // 增加圆角
    backgroundColor: "#fff",
    marginRight: 12, // 增加右侧间距
    
    height: 40, // 固定高度
  },
  activeCategoryButton: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // 添加阴影效果突出显示
  },
  categoryIcon: {
    marginRight: 8, // 增加图标和文字的间距
    fontSize: 18, // 增加图标大小
  },
  categoryButtonText: {
    fontSize: 15, // 增加文字大小
    fontWeight: "500", // 增加字体粗细
    color: COLORS.accent,
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "bold", // 选中状态加粗显示
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 120, 
    backgroundColor: COLORS.primary, // 改为黄色
  },
  teaCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12, // 增加圆角
    marginBottom: 20, // 增加卡片间距
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, // 增强阴影效果
    shadowRadius: 5,
    elevation: 5, // 增强阴影效果
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  teaImage: {
    width: '20%', // 改为相对宽度而非固定的120px
    aspectRatio: 0.5, // 保持1:1的宽高比
    borderRadius: 8,
    marginRight: 12,
  },
  teaInfo: {
    flex: 1,
    padding: 14, // 增加内边距
    justifyContent: "space-between", // 分散对齐内容
  },
  teaName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryTag: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#fff",
  },
  teaPrep: {
    fontSize: 12,
    color: COLORS.accent,
    marginBottom: 4,
  },
  teaDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});