// src/views/teaDetailsView.jsx
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Icon } from '../components/IconComponent';

// 统一的配色方案 - 改为黄色系
const COLORS = {
  primary: "#f8ca69",      // 主色调：黄色
  primaryDark: "#f7bd10",  // 深一点的主色调：深黄色
  accent: "#f7bd10",       // 强调色：深黄色
  accentLight: "#f8ca69",  // 浅一点的强调色：浅黄色
  background: "#f8ca69",   // 背景色：黄色 (改为与primary相同)
  cardBackground: "#f7bd10", // 卡片背景：深黄色 (改为primaryDark)
  text: "#333333",         // 主要文本：深灰色
  textSecondary: "#666666",// 次要文本：中灰色
  border: "#000000",       // 边框色：黑色
  success: "#4caf50",      // 成功色：绿色
  favorite: "#ff5c8d"      // 收藏色：粉红色
};

export function TeaDetailsView({
  tea,
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  isUserLoggedIn,
  onBackPress,
}) {
  if (!tea || typeof tea !== 'object') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bubble Tea Details</Text>
          <View style={{width: 40}} />
        </View>
        <View style={styles.loadingContainer}>
          <Icon name="alert-circle-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.errorText}>Unable to load bubble tea details</Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log("渲染奶茶详情:", tea.id, tea.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Icon name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tea.name}</Text>
        <View style={{width: 40}} />
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: tea.imageUrl || "https://via.placeholder.com/350" }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {isUserLoggedIn && (
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorite ? styles.favoriteActive : {}
              ]}
              onPress={isFavorite ? onRemoveFromFavorites : onAddToFavorites}
            >
              <View style={styles.favoriteIconContainer}>
                <Icon 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? COLORS.favorite : "#000"} 
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* 顶部卡片 - 标题卡片 */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{tea.name}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.prepTimeContainer}>
                <Icon name="time-outline" size={16} color="#fff" />
                <Text style={styles.prepTime}>Prep Time: {tea.prepTime || "Unknown"} min</Text>
              </View>
              
              <View style={styles.categoryContainer}>
                <Icon name="pricetag-outline" size={16} color="#fff" />
                <Text style={styles.category}>{tea.category || "Uncategorized"}</Text>
              </View>
            </View>
          </View>

          {/* 描述部分 */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="information-circle-outline" size={20} color="#fff" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.description}>{tea.description || "No description available"}</Text>
          </View>

          {/* 原料部分 */}
          {tea.ingredients && tea.ingredients.length > 0 ? (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <Icon name="leaf-outline" size={20} color="#fff" />
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              {tea.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* 步骤部分 */}
          {tea.steps && tea.steps.length > 0 ? (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <Icon name="list-outline" size={20} color="#fff" />
                <Text style={styles.sectionTitle}>Preparation Steps</Text>
              </View>
              {tea.steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* 小贴士部分 */}
          {tea.tips && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <Icon name="bulb-outline" size={20} color="#fff" />
                <Text style={styles.sectionTitle}>Tips</Text>
              </View>
              <View style={styles.tipsContainer}>
                <Text style={styles.tips}>{tea.tips}</Text>
              </View>
            </View>
          )}
          
          {/* 添加底部空间以确保内容可以完全滚动 */}
          <View style={{height: 40}}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: '60%', // 替代固定的50%，使用更大比例
    maxWidth: 300, // 添加最大宽度限制
    height: undefined,
    aspectRatio: 0.7,
    resizeMode: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  favoriteButton: {
    position: "absolute",
    bottom: 20,
    right: '10%',
    width: 44,
    height: 44,
    zIndex: 10,
  },
  favoriteIconContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  favoriteActive: {
    backgroundColor: "transparent",
  },
  
  // 卡片相关样式
  headerContainer: {
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",  // 文字改为白色，在深黄色背景上更易读
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prepTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prepTime: {
    fontSize: 14,
    color: "#fff",  // 文字改为白色
    marginLeft: 6,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 14,
    color: "#fff",  // 文字改为白色
    marginLeft: 6,
  },
  
  // 内容区块样式
  sectionContainer: {
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",  // 文字改为白色
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",  // 文字改为白色
  },
  
  // 原料列表样式
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",  // 边框改为半透明白色
  },
  ingredientName: {
    fontSize: 16,
    color: "#fff",  // 文字改为白色
    fontWeight: "500",
  },
  ingredientAmount: {
    fontSize: 16,
    color: "#fff",  // 文字改为白色
    fontWeight: "bold",
  },
  
  // 步骤相关样式
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepNumber: {
    color: "#000",  // 数字为黑色，在黄色背景上更易读
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",  // 文字改为白色
  },
  
  // 小贴士样式
  tipsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",  // 半透明白色
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,  // 使用亮黄色
  },
  tips: {
    fontSize: 14,
    lineHeight: 22,
    color: "#fff",  // 文字改为白色
    fontStyle: "italic",
  },
  
  // 加载容器样式
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
});