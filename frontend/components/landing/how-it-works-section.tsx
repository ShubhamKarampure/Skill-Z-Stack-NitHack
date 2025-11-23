"use client"

const steps = [
  {
    step: "01",
    title: "Issuer Mints",
    text: "University signs degree with private key.",
  },
  {
    step: "02",
    title: "On-Chain Storage",
    text: "Hash stored on Ethereum (Immutable).",
  },
  {
    step: "03",
    title: "Instant Verify",
    text: "Employer scans QR to match hashes.",
  },
]

export const HowItWorksSection = () => {
  return (
    <section className="py-24 px-6 bg-black/40 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-12 text-center">How verification works</h3>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-zinc-800" />

          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xl font-bold font-mono mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
