import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

import { useStore } from '../App';

import tVertexDefault from './shaders/tVertexDefault';
import tVertexWave from './shaders/tVertexWave';
import tFragmentBubble from './shaders/tFragmentBubble';
import tFragmentBubbleSide from './shaders/tFragmentBubbleSide';
import tFragmentAir from './shaders/tFragmentAir';
import tFragmentNoise from './shaders/tFragmentNoise';

function TransitionMesh() {
  const {
    transitionImage: image,
    setTransitionImage,
    textures,
    isTransition,
    setIsTransition,
    lockScroll,
  } = useStore();

  const meshRef = useRef(null);
  const { id, path, src, element, bounds } = image[0];
  const boundsRef = useRef(bounds);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (meshRef.current) {
        meshRef.current.material.uniforms.uImageSize.value.set(
          img.naturalWidth,
          img.naturalHeight
        );
      }
    };
  }, [src]);

  useFrame((state) => {
    const { clock } = state;

    const detailImage = document.querySelector(`.detail__img[data-id="${id}"]`);

    if (detailImage && isTransition) {
      const finalBounds = detailImage.getBoundingClientRect();

      gsap.to(boundsRef.current, {
        width: finalBounds.width,
        height: finalBounds.height,
        top: finalBounds.top,
        left: finalBounds.left,
        duration: 0.75,
      });

      gsap.to(meshRef.current.material.uniforms.uProgress, {
        value: 0,
        duration: 0.75,
      });

      if (
        Math.abs(boundsRef.current.width - finalBounds.width) < 1 &&
        Math.abs(boundsRef.current.height - finalBounds.height) < 1 &&
        Math.abs(boundsRef.current.top - finalBounds.top) < 1 &&
        Math.abs(boundsRef.current.left - finalBounds.left) < 1
      ) {
        setIsTransition(false);
        setTransitionImage([]);
      }
    }

    meshRef.current.position.x =
      boundsRef.current.left -
      window.innerWidth / 2 +
      boundsRef.current.width / 2;
    meshRef.current.position.y =
      -boundsRef.current.top +
      window.innerHeight / 2 -
      boundsRef.current.height / 2;
    meshRef.current.scale.x = boundsRef.current.width;
    meshRef.current.scale.y = boundsRef.current.height;

    meshRef.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  useEffect(() => {
    const handleResize = () => {
      meshRef.current.material.uniforms.uViewportSize.value.set(
        window.innerWidth,
        window.innerHeight
      );
      meshRef.current.material.uniforms.uPlaneSize.value.set(
        meshRef.current.scale.x,
        meshRef.current.scale.y
      );
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: textures[id] },
      uDisplacement: {
        value: textures['displacement'],
      },
      uImageSize: {
        value: new THREE.Vector2(0, 0),
      },
      uPlaneSize: {
        value: new THREE.Vector2(0, 0),
      },
      uViewportSize: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: { value: 0 },
      uProgress: { value: 1 },
    }),
    [image.src]
  );

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          key={uuidv4()}
          uniforms={uniforms}
          transparent={true}
          // side={THREE.DoubleSide}
          // vertexShader={tVertexWave}
          vertexShader={tVertexDefault}
          fragmentShader={tFragmentNoise}
        />
      </mesh>
    </>
  );
}

export default TransitionMesh;
