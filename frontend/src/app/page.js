import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Background from '@/components/home/Background';

export default function Home() {
  return (
    <div className="relative min-h-screen text-white selection:bg-cyan-500/30">
      {/* Light Rays Background */}
      <Background />

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
      </div>
    </div>
  );
}
