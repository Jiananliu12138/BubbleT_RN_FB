// src/views/loginView.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Icon } from '../components/IconComponent';

const { width } = Dimensions.get('window');
const cardWidth = Math.min(width * 0.85, 380);

export function LoginView({
  onLogin,
  onRegister,
  loading,
  error,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* 票据卡片容器 */}
        <View style={styles.ticketContainer}>
          {/* LOGO圆形部分，半露在票据外部 */}
          <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logoImage} 
            />
          </View>
          </View>
          
          {/* 票据卡片上部分 */}
          <View style={styles.ticketTop}>
            {/* 标题文字 */}
            <Text style={styles.appTitle}>Bubble Tea Enthusiast</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isLogin ? "Email Login" : "Register"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* 票据中间部分 - 虚线和半圆切口 */}
          <View style={styles.ticketPerforation}>
            <View style={styles.leftCircle} />
            <View style={styles.dashedLine} />
            <View style={styles.rightCircle} />
          </View>
          
          {/* 票据卡片下部分 */}
          <View style={styles.ticketBottom}>
            {isLogin ? (
              <View>
                <TouchableOpacity onPress={() => setIsLogin(false)}>
                  <Text style={styles.registerText}>
                    <Text style={styles.grayText}>No account?</Text> Register now!
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={() => setIsLogin(true)}>
                  <Text style={styles.registerText}>
                    Already have an account? Back to login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <View style={styles.tipContainer}>
              <Icon name="information-circle-outline" size={16} color="#9FB58F" />
              <Text style={styles.tipText}>
                {isLogin 
                  ? "Tip: Please keep your account password safe" 
                  : "By registering, you agree to the User Agreement and Privacy Policy"}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8ca69", // Changed from #9FB58F to #f8ca69
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    alignItems: "center",
  },
  
  // Logo部分
  logoWrapper: {
    position: "absolute",
    top: -55, // 定位使一半在卡片外部
    alignSelf: "center",
    zIndex: 10,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#f7bd10", // Changed from #7B9E7F to #f7bd10
    justifyContent: "center",
    alignItems: "center",
  },
  
  // 票据整体容器
  ticketContainer: {
    width: cardWidth,
    borderRadius: 16,
    backgroundColor: "white",
    position: "relative",
    // 添加阴影增强立体感
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    marginTop: 55, // 为Logo留出空间
  },
  
  // 票据上半部分
  ticketTop: {
    padding: 24,
    paddingTop: 65, // 为Logo留出空间
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  
  // 应用标题
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f7bd10", // Changed from #9FB58F to #f7bd10
    textAlign: "center",
    marginBottom: 25,
  },
  
  // 中间的虚线和切口区域
  ticketPerforation: {
    height: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginHorizontal: -1, // 确保边缘能够延伸到票据边缘
  },
  leftCircle: {
    position: "absolute",
    left: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8ca69", // Changed from #9FB58F to #f8ca69
    // 调整z-index确保可见
    zIndex: 1,
  },
  rightCircle: {
    position: "absolute",
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8ca69", // Changed from #9FB58F to #f8ca69
    // 调整z-index确保可见
    zIndex: 1,
  },
  dashedLine: {
    width: "100%",
    height: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  
  // 票据下半部分
  ticketBottom: {
    padding: 24,
    paddingTop: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  
  // 输入框样式
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  
  // 登录按钮
  loginButton: {
    backgroundColor: "#f7bd10", // Changed from #7B9E7F to #f7bd10
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginButtonText: {
    color: "black", // Changed from white to black to match the second example
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // 注册链接和提示
  registerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#f7bd10", // Changed from #7B9E7F to #f7bd10
    fontWeight: "500",
    marginVertical: 10,
  },
  grayText: {
    color: "#888",
    fontWeight: "normal",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  tipText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
});