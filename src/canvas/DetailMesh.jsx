import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useStore } from '../App';
import { useLocation } from 'react-router-dom';

import tVertexDefault from './shaders/tVertexDefault';
import tVertexWave from './shaders/tVertexWave';

function DetailMesh({ image }) {
  const meshRef = useRef(null);
  const { textures, isTransition } = useStore();
  const { id, path, src, element } = image;
  const { pathname } = useLocation();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uImageSize.value.set(
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
      uProgress: { value: 0 },
    }),
    [image.src]
  );

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          key={uuidv4()}
          uniforms={uniforms}
          transparent={true}
          // side={THREE.DoubleSide}
          vertexShader={tVertexWave}
          fragmentShader={
            /* GLSL */
            `
            uniform sampler2D uTexture;
            uniform float uAlpha;

            varying vec2 vUv;

            void main() {
              vec2 uv = vUv;

              vec3 color = texture2D(uTexture, uv).rgb;
              gl_FragColor = vec4(color, uAlpha);
            }
          `
          }
        />
      </mesh>
    </>
  );
}

export default DetailMesh;
