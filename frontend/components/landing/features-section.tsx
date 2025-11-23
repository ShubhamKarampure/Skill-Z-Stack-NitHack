"use client"

import { Building2, GraduationCap, Users } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const features = [
  {
    icon: Building2,
    title: "For Universities",
    desc: "Bulk issue thousands of tamper-proof degrees in seconds using our Batch-Minting API.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
  },
  {
    icon: GraduationCap,
    title: "For Students",
    desc: "A decentralized 'Skill Passport' wallet. You own your data. Share only what's needed.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
  },
  {
    icon: Users,
    title: "For Recruiters",
    desc: "Instant, zero-cost verification. Say goodbye to background check agencies.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
  },
]

export const FeaturesSection = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A Unified Credential Registry</h2>
          <p className="text-zinc-400 text-lg">Bridging the gap between Universities and the Workplace.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={i}>
              <div
                className={`h-full p-8 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-sm hover:bg-zinc-800/60 transition-all duration-300 group ${feature.border}`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
