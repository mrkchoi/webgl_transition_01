import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useStore } from '../App';
import { lerp } from '../util/math';

import vertexDefault from './shaders/home/vertexDefault';
import fragmentMask from './shaders/home/fragmentMask';

function HomeMesh({ image }) {
  const meshRef = useRef(null);
  const isEnteredRef = useRef(false);
  const mouseRef = useRef({
    viewport: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  });

  const { textures, isTransition } = useStore();
  const { id, path, src, element } = image;

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.viewport.x = e.clientX;
      mouseRef.current.viewport.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     console.log(
  //       'meshRef.current.material.uniforms: ',
  //       meshRef.current.material.uniforms
  //     );
  //     console.log('-------------------');
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uImageSize.value = new THREE.Vector2(
        element.naturalWidth,
        element.naturalHeight
      );
    }
  }, [element.naturalHeight, element.naturalWidth]);

  useFrame((state) => {
    const { clock } = state;
    const { width, height, top, left } = element.getBoundingClientRect();

    meshRef.current.position.x = left - window.innerWidth / 2 + width / 2;
    meshRef.current.position.y = -top + window.innerHeight / 2 - height / 2;
    meshRef.current.scale.x = width;
    meshRef.current.scale.y = height;

    mouseRef.current.current.x = lerp(
      mouseRef.current.current.x,
      mouseRef.current.target.x,
      0.075
    );
    mouseRef.current.current.y = lerp(
      mouseRef.current.current.y,
      mouseRef.current.target.y,
      0.075
    );

    meshRef.current.material.uniforms.uTime.value = clock.elapsedTime;

    if (
      mouseRef.current.viewport.x > left &&
      mouseRef.current.viewport.x < left + width &&
      mouseRef.current.viewport.y > top &&
      mouseRef.current.viewport.y < top + height
    ) {
      if (!isEnteredRef.current) {
        isEnteredRef.current = true;
        handleMouseEnter();
      }
    } else {
      if (isEnteredRef.current) {
        isEnteredRef.current = false;
        handleMouseLeave();
      }
    }
    mouseRef.current.target.x = (mouseRef.current.viewport.x - left) / width;
    mouseRef.current.target.y =
      1 - (mouseRef.current.viewport.y - top) / height;
    meshRef.current.material.uniforms.uMouse.value.set(
      mouseRef.current.current.x,
      mouseRef.current.current.y
    );

    // console.log(clock.elapsedTime);
  });

  const handleMouseEnter = () => {
    gsap.to(meshRef.current.material.uniforms.uHovered, {
      value: 1,
      duration: 1,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(meshRef.current.material.uniforms.uHovered, {
      value: 0,
      duration: 1,
    });
  };

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

  const uniforms = useMemo(() => {
    const data = {
      uTexture: { value: textures[id] },
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
      uAlpha: { value: 1 },
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uHovered: { value: 0 },
    };
    console.log(data);
    console.log('-------------------');
    return data;
  }, []);

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          key={uuidv4()}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          vertexShader={vertexDefault}
          fragmentShader={fragmentMask}
        />
      </mesh>
    </>
  );
}

export default HomeMesh;
