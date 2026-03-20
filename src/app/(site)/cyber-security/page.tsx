import SplitReveal from "@/components/about/split-reveal";
import GradientCallout from "@/components/ui/gradient-callout";
import StaggerList from "@/components/about/stagger-list";
import GlarePanel from "@/components/ui/glare-panel";
import GlassPanel from "@/components/ui/glass-panel";
import {
  GLASS_LIST_TILE_CLASS_NAME,
  GLASS_LIST_TILE_SUBDUED_CLASS_NAME,
} from "@/components/ui/glass-tile";
import { SITE_ACCENT_COLOR, SITE_LIGHT_ACCENT_COLOR } from "@/lib/site-palette";

const activeSystems = [
  "Linux: Ubuntu (Server and Client Management)",
  "macOS: Development and Analysis Environment",
  "Windows: 11 Pro (Corporate Structure Simulations)",
];

const operatingSystemExperience = [
  "Security-focused systems: Kali Linux, Parrot OS",
  "Server and desktop systems: CentOS, Fedora, Linux Mint, Windows 10 / 7 / Vista",
];

const securityPrinciples = [
  {
    label: "Principle",
    value: "Zero Trust",
    detail: "I design around verification, segmentation, and controlled access instead of implicit trust.",
  },
  {
    label: "Focus",
    value: "Hybrid Architecture",
    detail: "I balance performance-critical native services with isolated containerized workloads.",
  },
  {
    label: "Approach",
    value: "Edge Visibility",
    detail: "I care about traffic observability, DNS hygiene, and practical logging over assumptions.",
  },
  {
    label: "Process",
    value: "SecOps Automation",
    detail: "I push repetitive security work toward event-driven scanning, analysis, and reporting flows.",
  },
];

const architectureSections = [
  {
    index: "01",
    title: "Hybrid Server Management (Docker & Native)",
    intro:
      "Instead of confining every service to a single structure, I use a distribution optimized according to the real need of the workload.",
    bullets: [
      "Micro-services: I run database, automation, and media services in isolated Docker containers.",
      "Web applications: I host performance-critical projects such as cv.egekaya.net and egekaya.net in a native Next.js environment.",
    ],
  },
  {
    index: "02",
    title: "Cloudflare Edge Security & Custom Logging",
    intro:
      "I manually manage DNS records and email security policies instead of relying on default settings.",
    bullets: [
      "DNS and mail security: I manage A, CNAME, MX, TXT, SPF, and DMARC configurations myself.",
      "Cloudflare Tunnels: I expose internal services securely without taking on the risk of opening ports directly.",
      "Custom HTTP traffic analysis: I built my own monitoring flow with Cloudflare Workers instead of depending only on ready-made logging tools.",
      "Edge workflow: Requests are captured at the edge, transmitted to my server by webhook, and archived locally with IP, method, path, and timestamp data.",
    ],
  },
  {
    index: "03",
    title: "SecOps & Automation (n8n + AI)",
    intro:
      "I move security processes away from manual repetition and toward event-driven automations that can run consistently.",
    bullets: [
      "Continuous discovery: Every day, an automated Nmap cycle maps open ports and active services across the environment.",
      "Automated vulnerability analysis: Nuclei and OWASP ZAP continue the workflow with deeper scans against detected services.",
      "AI-supported reporting: Findings are read from disk, analyzed by AI agents, and escalated to me as Telegram or email notifications when something matters.",
    ],
  },
  {
    index: "04",
    title: "Network Security & Access",
    intro:
      "My access model is built around controlled connectivity and filtering instead of broad exposure.",
    bullets: [
      "Mesh VPN: I use Tailscale to access servers and services from anywhere as if I were still on the local network.",
      "DNS filtering: I block ad and tracker traffic across the network with Pi-hole.",
    ],
  },
];

export default function CyberSecurityPage() {
  return (
    <main className="site-page">
      <section className="w-[min(1160px,100%)]">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <GlassPanel as="div">
            <p className="site-page-eyebrow">Cybersecurity</p>
            <SplitReveal
              as="h1"
              text="Hello, I'm Ege."
              className="site-page-title max-w-none"
            />

            <div className="mt-6 space-y-5 text-[1.02rem] leading-7 text-[rgba(245,247,242,0.82)]">
              <p>
                Cybersecurity is not just an area of interest for me, but a
                disciplined learning process and an architectural design mindset.
                I focus on understanding systems in depth, identifying
                vulnerabilities, and building structures around the Zero Trust
                principle.
              </p>

              <p>
                I have gained experience across a wide range of operating systems
                and infrastructure models in order to study how different
                architectures behave under real conditions.
              </p>

              <p>
                My work today sits at the intersection of system management, web
                technologies, traffic analysis, defensive operations, and security
                automation.
              </p>
            </div>
          </GlassPanel>

          <div className="grid gap-4 sm:grid-cols-2">
            {securityPrinciples.map((item) => (
              <GlarePanel
                key={item.value}
                className="min-h-[170px]"
                glareColor={SITE_ACCENT_COLOR}
                glareOpacity={0.16}
                glareSize={180}
              >
                <div className="relative z-[1] flex h-full flex-col justify-between">
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.58)] uppercase">
                    {item.label}
                  </p>
                  <div>
                    <p className="text-[1.55rem] leading-none font-semibold text-[var(--foreground)]">
                      {item.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[rgba(245,247,242,0.74)]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </GlarePanel>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlassPanel>
            <SplitReveal
              as="h2"
              text="Actively Used Systems"
              className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
            />
            <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.72)]">
              These are the environments I actively use for administration,
              development, simulation, and analysis.
            </p>

            <StaggerList
              items={activeSystems}
              className="mt-6 m-0 grid list-none gap-3 p-0"
              itemClassName={GLASS_LIST_TILE_CLASS_NAME}
            />
          </GlassPanel>

          <GlassPanel>
            <SplitReveal
              as="h2"
              text="System Experience"
              className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
            />
            <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.72)]">
              I have worked across multiple desktop, server, and security-focused
              operating systems to understand different behaviors and deployment
              patterns.
            </p>

            <StaggerList
              items={operatingSystemExperience}
              className="mt-6 m-0 grid list-none gap-3 p-0"
              itemClassName={GLASS_LIST_TILE_CLASS_NAME}
            />
          </GlassPanel>
        </div>

        <GlassPanel as="div" className="mt-6">
          <SplitReveal
            as="h2"
            text="Technical Infrastructure & Architectural Approach"
            className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
          />
          <p className="mt-3 max-w-[56rem] text-[1rem] leading-7 text-[rgba(245,247,242,0.74)]">
            Beyond standard installations, I manage a hybrid architecture that
            balances performance and security.
          </p>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {architectureSections.map((section) => (
              <GlarePanel
                key={section.index}
                className="min-h-[280px]"
                variant="feature"
                glareColor={SITE_LIGHT_ACCENT_COLOR}
                glareOpacity={0.12}
                glareSize={200}
              >
                <div className="relative z-[1]">
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
                    {section.index}
                  </p>
                  <h3 className="mt-4 text-[1.3rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {section.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.74)]">
                    {section.intro}
                  </p>

                  <ul className="mt-4 grid gap-3 list-none p-0 m-0">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={GLASS_LIST_TILE_SUBDUED_CLASS_NAME}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlarePanel>
            ))}
          </div>
        </GlassPanel>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel>
            <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
              Experience
            </p>
            <h2 className="mt-4 text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Aktif Yatırım Bankası A.Ş
            </h2>
            <p className="mt-2 text-[1rem] font-medium text-[rgba(245,247,242,0.8)]">
              Information Technologies Security Intern
            </p>
            <p className="mt-3 text-[0.92rem] uppercase tracking-[0.14em] text-[rgba(245,247,242,0.48)]">
              July 2, 2025 - August 27, 2025
            </p>
            <p className="mt-6 text-[1rem] leading-7 text-[rgba(245,247,242,0.76)]">
              During this period, I developed active work around system
              management, web technologies, and security automations, while
              continuing to strengthen my Blue Team perspective.
            </p>
          </GlassPanel>

          <GradientCallout className="p-6 sm:p-8">
            <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.74)] uppercase">
              Security Philosophy
            </p>
            <p className="mt-5 text-[1.16rem] leading-8 text-[rgba(245,247,242,0.92)] sm:text-[1.24rem]">
              &quot;Security is not a product, but a process. I aim to improve
              this process at every step, from the logging systems I wrote
              myself to the network topology I established.&quot;
            </p>
          </GradientCallout>
        </div>
      </section>
    </main>
  );
}
