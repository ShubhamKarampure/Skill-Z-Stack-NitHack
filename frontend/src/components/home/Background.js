"use client";

import dynamic from 'next/dynamic';

const LightRays = dynamic(() => import('@/components/ui/LightRays'), {
  ssr: false,
});

export default function Background() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <LightRays
        raysOrigin="top-center"
        raysColor="#555555"
        raysSpeed={1.5}
        lightSpread={1.5}
        rayLength={3.5}
        followMouse={false}
        mouseInfluence={0.2}
        noiseAmount={0.2}
        distortion={0.1}
        saturation={2.0}
      />
    </div>
  );
}
