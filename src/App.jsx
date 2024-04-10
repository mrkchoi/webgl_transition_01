import React, { useEffect, useRef, useMemo, useState, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

import useSmoothScroll from './hooks/useSmoothScroll';

import { create } from 'zustand';

import ViewRoutes from './ViewRoutes';
import Header from './components/Header';
import Scene from './canvas/Scene';

import displacementMap from './assets/images/disp1.jpg';
import './App.css';

import DATA from './data';

// create zustand store
export const useStore = create((set) => ({
  homeImages: [],
  setHomeImages: (homeImages) => set({ homeImages }),
  detailImages: [],
  setDetailImages: (detailImages) => set({ detailImages }),
  isTransition: false,
  setIsTransition: (isTransition) => set({ isTransition }),
  transitionImage: [],
  setTransitionImage: (transitionImage) => set({ transitionImage }),
  textures: {},
  setTextures: (textures) => set({ textures }),
  lockScroll: () => {},
  setLockScroll: (lockScroll) => set({ lockScroll }),
  resetScroll: () => {},
  setResetScroll: (resetScroll) => set({ resetScroll }),
}));

const PERSPECTIVE = 1000;
const FAR = PERSPECTIVE * 3;
const FOV =
  (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

function App() {
  const cameraRef = useRef(null);
  const scrollableRef = useRef(null);
  const { setTextures, setLockScroll, setResetScroll } = useStore();

  const { resetScroll, lockScroll, current, target } = useSmoothScroll({
    container: scrollableRef.current,
  });

  useEffect(() => {
    setLockScroll(lockScroll);
    setResetScroll(resetScroll);
  }, []);

  useEffect(() => {
    // cache all WebGL textures
    const textures = {};
    // cache images
    DATA.forEach((item) => {
      const texture = new THREE.TextureLoader().load(item.image);
      textures[item.id] = texture;
    });
    // cache displacement map
    textures['displacement'] = new THREE.TextureLoader().load(displacementMap);
    setTextures(textures);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // update camera fov
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.fov =
        (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence
        onExitComplete={() => {
          console.log('onExitComplete');
        }}
      >
        <main className="main">
          <div className="canvasWrapper">
            <Canvas>
              <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                position={[0, 0, PERSPECTIVE]}
                zoom={1}
                fov={FOV}
                aspect={window.innerWidth / window.innerHeight}
                near={0.01}
                far={FAR}
              />
              <Suspense fallback={<span>loading...</span>}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
          <Header />
          <div ref={scrollableRef} className="scrollable">
            <ViewRoutes />
          </div>
        </main>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
