import React from 'react';
import { MapPresenter } from "../presenters/MapPresenter";
import { reactMapModel } from "../bootstrapping";

/**
 * Route component for Map screen
 */
export default function Map() {
  return <MapPresenter MapModel={reactMapModel} />;
} 