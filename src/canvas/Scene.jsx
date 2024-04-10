import React from 'react';
import { useStore } from '../App';
import HomeMesh from './HomeMesh';
import DetailMesh from './DetailMesh';
import TransitionMesh from './TransitionMesh';

function Scene() {
  const { homeImages, detailImages, transitionImage, isTransition } =
    useStore();

  return (
    <>
      {homeImages.map((image, idx) => {
        if (Number(image.id) != Number(transitionImage[0]?.id)) {
          return <HomeMesh key={idx} image={image} />;
        }
      })}
      {detailImages.map((image, idx) => {
        if (Number(image.id) != Number(transitionImage[0]?.id)) {
          return <DetailMesh key={idx} image={image} />;
        }
      })}
      {transitionImage.length && isTransition ? (
        <TransitionMesh image={transitionImage[0]} />
      ) : null}
    </>
  );
}

export default Scene;
