// src/app/all-teas.jsx
import { View } from "react-native";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { AllTeas } from "../presenters/allTeasPresenter";
import { useEffect } from "react";

export default observer(function AllTeasPage() {
  // 确保在页面加载时已获取所有茶数据
  useEffect(() => {
    if (reactiveModel.tea.allTeas.length === 0) {
      reactiveModel.tea.loadAllTeas();
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AllTeas model={reactiveModel} />
    </View>
  );
});