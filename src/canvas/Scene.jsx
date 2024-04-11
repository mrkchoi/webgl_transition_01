import React, { useEffect, useState } from 'react';
import { useStore } from '../App';
import HomeMesh from './HomeMesh';
import DetailMesh from './DetailMesh';
import TransitionMesh from './TransitionMesh';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Scene() {
  const { homeImages, detailImages, transitionImage, isTransition } =
    useStore();
  const { pathname } = useLocation();

  return (
    <group>
      <group>
        {pathname === '/' &&
          homeImages.map((image, idx) => {
            if (Number(image.id) != Number(transitionImage[0]?.id)) {
              return <HomeMesh key={idx} image={image} />;
            }
          })}
      </group>
      <group>
        {pathname.includes('/detail') &&
          detailImages.map((image, idx) => {
            if (Number(image.id) != Number(transitionImage[0]?.id)) {
              return <DetailMesh key={idx} image={image} />;
            }
          })}
      </group>
      <group>
        {transitionImage.length && isTransition ? (
          <TransitionMesh image={transitionImage[0]} />
        ) : null}
      </group>
    </group>
  );
}

export default Scene;
