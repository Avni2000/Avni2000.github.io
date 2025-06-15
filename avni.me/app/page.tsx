import { Twitter, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8 pb-12">
      <section>
        <p className="leading-relaxed">
          I am the co-founder and CEO of Haize Labs. We are solving the ultimate extant problem in AI: ensuring its
          reliability, quality, and alignment for any application. You might also know of us for our red-teaming work.
        </p>
      </section>
      <section id="research">
        <p className="leading-relaxed">
          Prior to this, I had a liberating time studying mathematics and computer science at Harvard. My research then
          covered adversarial robustness, pitfalls in mathematical reasoning, computational neuroscience,
          interpretability, and large(-ish) language models. Much of that has now been distilled into the Haize
          technology agenda. I also dropped out of, before starting, a Stanford PhD in computer science.
        </p>
      </section>
      <section>
        <p className="leading-relaxed">
          In the limit of my life, I hope to be a <span className="underline">guitarist</span>,{" "}
          <span className="underline">writer</span>, <span className="underline">singer</span>, and{" "}
          <span className="underline">architect</span>. I am also chiefly invested in starting Bell Labs 2.0.
        </p>
      </section>
      <div className="flex items-center space-x-4">
        <Link href="#" className="text-foreground/60 hover:text-foreground">
          <Twitter size={20} />
        </Link>
        <Link href="#" className="text-foreground/60 hover:text-foreground">
          <Github size={20} />
        </Link>
        <Link href="#" className="text-foreground/60 hover:text-foreground">
          <Linkedin size={20} />
        </Link>
        <Link href="#" className="text-foreground/60 hover:text-foreground">
          <Mail size={20} />
        </Link>
      </div>
    </div>
  )
}
