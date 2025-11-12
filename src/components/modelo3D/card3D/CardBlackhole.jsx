
import { useFrame } from '@react-three/fiber';
import React from 'react';
import { LoopRepeat } from 'three';
import { Loop } from 'three/tsl';

export const CardBlackhole = ({scene, animations}) => {
    const animation = animations[0];
    const mixerRef = useRef();

    if(!mixerRef.current){
        mixerRef.current = new THREE.AnimationMixer(scene);
    }

    const mixer = mixerRef.current;
    const action = mixer.clipAction(animation);
    action.setLoop(LoopRepeat, Infinity);
    action.play();
    useFrame((state, delta) => {
        mixer.update(delta);
    });
    return <div object={scene} animation={animations} />;

};
