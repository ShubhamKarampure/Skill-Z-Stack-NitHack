"use client"

import { FileX } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { CredentialScanner } from "./credential-scanner"

export const ProblemSection = () => {
  return (
    <section className="py-24 bg-zinc-900/20 border-y border-white/5 relative overflow-hidden backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <CredentialScanner />
          </div>

          <div className="order-1 md:order-2">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 mb-4">
                <FileX className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-bold tracking-widest text-xs uppercase">The Problem</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Degrees are easy to forge. <br />
                <span className="text-white/50">Hard to verify.</span>
              </h2>
              <div className="space-y-6 text-zinc-400">
                <p className="pl-4 border-l-2 border-zinc-700">
                  <strong className="text-white block mb-1">For HR & Employers</strong>
                  Manual verification is slow, expensive, and prone to human error. Fake degrees are increasing HR risk.
                </p>
                <p className="pl-4 border-l-2 border-zinc-700">
                  <strong className="text-white block mb-1">For Students</strong>
                  Carrying physical papers is outdated. Proving your skills often means revealing unnecessary private
                  data.
                </p>
                <p className="pl-4 border-l-2 border-zinc-700">
                  <strong className="text-white block mb-1">For Universities</strong>
                  No unified registry exists, making cross-border verification a nightmare.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
