// src/app/community.jsx - 修改为使用observer模式
import React from "react";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { Community } from "../presenters/communityPresenter";

// 使用observer包装组件以确保MobX状态改变时组件会重新渲染
export default observer(function CommunityPage() {
  return <Community model={reactiveModel} />;
});