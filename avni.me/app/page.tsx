import { Twitter, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8 pb-12">
      <section>
        <div>
          <p className="leading-relaxed text-foreground/90">
            I'm a person who chases fascinating things. I'm currently working on multiple fascinating projects at once, 
            including:
          </p>
          <ul className="list-disc list-inside mt-4" style={{ listStyleType: 'disc' }}>
            <li>Improving the build system of OpenMS through Google Summer of Code</li>
            <li>Creating a classification model for Epic Systems for auto triage of millions of helpdesk tickets</li>
            <li>Building a tool for inferring proteins from intact mass spectrometry data through training a model on open-source datasets and utilizing some basic statistics</li>
          </ul>
        </div>
      </section>
      <section id="research">
        <div>
          <p className="leading-relaxed text-foreground/90">
          </p>
        </div>
      </section>
      <section>
        <div>
          <p className="leading-relaxed text-foreground/90">
            When I'm not coding, you can find me cooking (indian) food, cuddling with my cat, or napping around my apartment.
            I'm also just a naturally argumentative and skeptical person, and I enjoy engaging in random debates.
          </p>
        </div>
      </section>
      <div className="flex items-center space-x-3">

        <Link href="https://github.com/Avni2000" className="text-foreground/60 hover:text-foreground transition-colors">
          <Github size={20} />
        </Link>
        <Link href="https://www.linkedin.com/in/avni-badiwale/" className="text-foreground/60 hover:text-foreground transition-colors">
          <Linkedin size={20} />
        </Link>
        <Link href="mailto:badiwale@wisc.edu" className="text-foreground/60 hover:text-foreground transition-colors">
          <Mail size={20} />
        </Link>
      </div>
    </div>
  )
}
