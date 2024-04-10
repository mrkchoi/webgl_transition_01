import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

import DATA from '../data';
import { useStore } from '../App';
import HomeImage from '../components/HomeImage';

function Home() {
  const imageRef = useRef(null);
  const {
    homeImages,
    setHomeImages,
    setTransitionImage,
    setIsTransition,
    textures,
    resetScroll,
    lockScroll,
  } = useStore();

  useEffect(() => {
    history.scrollRestoration = 'manual';
    resetScroll();
  }, []);

  // RESET TRANSITION IMAGE ON MOUNT
  useEffect(() => {
    setTransitionImage([]);
    setIsTransition(false);
    lockScroll(false);
  }, []);

  useEffect(() => {
    // get all images from DOM and set them to state for use in canvas scene
    const allImages = [...document.querySelectorAll('.home__itemImg')];

    const data = [];
    allImages.forEach((image) => {
      const { path, id, src } = image.dataset;
      data.push({
        id,
        path,
        src,
        element: image,
      });
    });

    setHomeImages(data);

    return () => {
      setHomeImages([]);
    };
  }, []);

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <ul className="home__list">
        {DATA.map((item, idx) => (
          <HomeImage key={idx} item={item} />
        ))}
      </ul>
    </motion.div>
  );
}

export default Home;
