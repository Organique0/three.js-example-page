import React, { useRef } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";

const Backdrop = () => {
  const shadows = useRef();
  return (
    <AccumulativeShadows
      position={[0, 0, -0.14]}
      ref={shadows}
      temporal
      frames={30}
      alphaTest={0.25}
      scale={3}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {/* Left Light */}
      <RandomizedLight
        amount={5} // Use only one light on the left
        radius={7}
        intensity={0.1} // Increase intensity for stronger left light
        ambient={0.7} // Reduce ambient for more contrast
        position={[5, 5, -9]} // Move the light to the left
      />

      {/* Right Light */}
      <RandomizedLight
        amount={4} // Use more lights on the right
        radius={3}
        intensity={0.6} // Decrease intensity for softer right light
        ambient={0.7}
        position={[-5, 9, -10]} // Move the lights to the right
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
