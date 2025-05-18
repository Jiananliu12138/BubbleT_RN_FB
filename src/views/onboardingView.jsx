// src/views/onboardingView.jsx
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

// 滑动页数据
const slides = [
  {
    id: "1",
    image: require("../assets/onboarding/onboarding1.png"),
  },
  {
    id: "2",
    image: require("../assets/onboarding/onboarding2.png"),
  },
  {
    id: "3",
    image: require("../assets/onboarding/onboarding3.png"),
  },
  {
    id: "4",
    image: require("../assets/onboarding/onboarding4.png"),
  },
];

export function OnboardingView({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // 用状态而不是ref来跟踪导航锁，确保UI响应
  const [isNavigating, setIsNavigating] = useState(false);
  
  // 直接计算是否为最后一页
  const isLastSlide = currentIndex === slides.length - 1;

  // 添加安全定时器以确保导航锁定最终会释放
  useEffect(() => {
    if (isNavigating) {
      // 确保导航锁不会无限期保持 - 最多锁定800ms
      const safetyTimer = setTimeout(() => {
        setIsNavigating(false);
      }, 800);
      
      return () => clearTimeout(safetyTimer);
    }
  }, [isNavigating]);
  
  // 处理跳过按钮
  const handleSkip = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    try {
      await AsyncStorage.setItem("@onboarding_complete", "true");
      onComplete();
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      setIsNavigating(false);
    }
  };

  // 处理下一步按钮 - 简化实现
  const handleNext = () => {
    // 防止重复点击
    if (isNavigating) return;
    
    // 最后一页的处理
    if (currentIndex >= slides.length - 1) {
      setIsNavigating(true);
      AsyncStorage.setItem("@onboarding_complete", "true")
        .then(() => onComplete())
        .catch((error) => {
          console.error("Error saving onboarding status:", error);
          setIsNavigating(false);
        });
      return;
    }
    
    // 设置导航锁
    setIsNavigating(true);
    
    // 计算下一页索引
    const nextIndex = currentIndex + 1;
    
    // 立即更新状态
    setCurrentIndex(nextIndex);
    
    // 滚动到下一页
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: nextIndex * width,
        animated: true
      });
      
      // 设置一个合理的超时时间来释放导航锁
      // 300ms对大多数动画来说足够了
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    } else {
      // 如果引用不可用，立即释放锁
      setIsNavigating(false);
    }
  };

  // 简化的滚动处理
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // 处理滚动结束事件
  const handleMomentumScrollEnd = (event) => {
    // 如果正在手动导航，忽略这个事件
    if (isNavigating) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    
    if (newIndex >= 0 && newIndex < slides.length && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  // 渲染单个滑动页
  const renderSlide = ({ item }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Image source={item.image} style={styles.fullScreenImage} resizeMode="cover" />
      </View>
    );
  };

  // 渲染分页点
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: "#8a2be2",
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
       
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        initialNumToRender={slides.length}
        maxToRenderPerBatch={slides.length}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        style={styles.fullWidthList}
      />

      <Pagination />

      {/* 覆盖在图片上的控制按钮 */}
      <View style={styles.overlayControls}>
        <TouchableOpacity 
          style={[
            styles.skipButton,
            isNavigating && styles.disabledButton
          ]}
          onPress={handleSkip}
          disabled={isNavigating}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.nextButton,
            isNavigating && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={isNavigating}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6E0", // 改为黑色背景以避免图片加载时的白边
  },
  slide: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  fullScreenImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  fullWidthList: {
    width,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    zIndex: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  overlayControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  skipButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#8a2be2",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  debugInfo: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    zIndex: 1000,
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: '#ff6b6b',
    padding: 5,
    marginTop: 5,
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  }
});