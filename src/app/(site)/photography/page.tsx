import Link from "next/link";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import SplitReveal from "@/components/about/split-reveal";
import PortfolioCardView from "@/components/photography/portfolio-card-view";
import GlarePanel from "@/components/ui/glare-panel";
import GlassPanel from "@/components/ui/glass-panel";
import { SITE_ACCENT_COLOR, SITE_LIGHT_ACCENT_COLOR } from "@/lib/site-palette";

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const portfolioPhotos = readdirSync(join(process.cwd(), "public", "images", "portfolio"))
  .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
  .sort((left, right) => collator.compare(left, right))
  .map((fileName, index) => ({
    index: index + 1,
    src: `/images/portfolio/${fileName}`,
    title: `Portfolio Photo ${index + 1}`,
  }));

const photographyFacts = [
  {
    label: "Started On",
    value: "November 8, 2023",
    detail: "That was the day I bought my first camera and began learning the craft seriously.",
  },
  {
    label: "What It Means",
    value: "An Escape",
    detail: "Photography gives me a reason to step away from the screen and pay attention to what is around me.",
  },
  {
    label: "Current Body",
    value: "Fujifilm XM-5",
    detail: "My current camera after moving through Canon and Sony gear.",
  },
  {
    label: "Current Lens",
    value: "XC 15-45mm",
    detail: "A flexible everyday range that fits how I like to shoot and move.",
  },
];

const equipment = [
  {
    name: "Fujifilm XM-5 Body",
    href: "https://www.fujifilm-x.com/en-us/products/cameras/x-m5/",
    note: "My current camera body and the one I use now.",
  },
  {
    name: "Fujinon XC 15-45mm f/3.5-5.6 OIS PZ Lens",
    href: "https://www.fujifilm-x.com/global/products/lenses/xc15-45mmf35-56-ois-pz/",
    note: "The lens currently paired with the XM-5 in my kit.",
  },
];

export default function PhotographyPage() {
  return (
    <main className="site-page">
      <section className="w-[min(1180px,100%)]">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <GlassPanel as="div">
            <p className="site-page-eyebrow">Photography</p>
            <SplitReveal
              as="h1"
              text="Photography"
              className="site-page-title max-w-none"
            />

            <div className="mt-6 space-y-5 text-[1.02rem] leading-7 text-[rgba(245,247,242,0.82)]">
              <p>
                If you already read the about section, you now know who I am. If
                you have not, you can go back and read it{" "}
                <Link
                  href="/about"
                  className="font-semibold text-[var(--accent)] underline decoration-[rgba(65,176,110,0.38)] underline-offset-4"
                >
                  here
                </Link>
                . Now I can tell you my story about photography.
              </p>

              <p>
                Photography is somewhat of an escape from the screen for me.
                Usually, my day passes in front of the computer. That is why
                taking my camera, going outside, wandering around, and
                photographing things genuinely does me good.
              </p>

              <p>
                I enjoy turning the details I notice with my eyes into a frame
                and capturing the moment.
              </p>
            </div>
          </GlassPanel>

          <div className="grid gap-4 sm:grid-cols-2">
            {photographyFacts.map((fact) => (
              <GlarePanel
                key={fact.label}
                className="min-h-[170px]"
                glareColor={SITE_LIGHT_ACCENT_COLOR}
                glareOpacity={0.14}
                glareSize={180}
              >
                <div className="relative z-[1] flex h-full flex-col justify-between">
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.56)] uppercase">
                    {fact.label}
                  </p>
                  <div>
                    <p className="text-[1.45rem] leading-tight font-semibold text-[var(--foreground)]">
                      {fact.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[rgba(245,247,242,0.72)]">
                      {fact.detail}
                    </p>
                  </div>
                </div>
              </GlarePanel>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <GlassPanel>
            <SplitReveal
              as="h2"
              text="What does photography mean to me?"
              className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
            />
            <div className="mt-5 space-y-5 text-[1rem] leading-7 text-[rgba(245,247,242,0.76)]">
              <p>
                Photography is one of the clearest ways I disconnect from the
                constant rhythm of the screen. It gets me out of my chair and
                back into the world.
              </p>
              <p>
                I enjoy walking, observing, waiting for the right detail, and
                translating that moment into a frame. It is less about taking a
                picture quickly and more about noticing something worth keeping.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel>
            <SplitReveal
              as="h2"
              text="When did I start?"
              className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
            />
            <div className="mt-5 space-y-5 text-[1rem] leading-7 text-[rgba(245,247,242,0.76)]">
              <p>
                I bought my first camera, a Canon Rebel T7 with an 18-55mm lens,
                on November 8, 2023. With that setup, I learned the basics and
                later gained experience using 75-300mm and 50mm lenses as well.
              </p>
              <p>
                After that period, I sold my Canon setup and moved to a Sony A7M2
                with a 28-75mm lens. About two and a half months later, I decided
                to move again and bought the Fujifilm XM-5, which is the camera I
                currently use.
              </p>
            </div>
          </GlassPanel>
        </div>

        <GlassPanel as="div" className="mt-6">
          <SplitReveal
            as="h2"
            text="My Equipment"
            className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
          />
          <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.72)]">
            Below is the equipment I currently use. You can open each item to see
            the official details.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {equipment.map((item) => (
              <GlarePanel
                key={item.name}
                variant="feature"
                glareColor={SITE_ACCENT_COLOR}
                glareOpacity={0.14}
                glareSize={190}
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-[1] block"
                >
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.58)] uppercase">
                    Current Gear
                  </p>
                  <h3 className="mt-4 text-[1.25rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.74)]">
                    {item.note}
                  </p>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Open official page
                  </p>
                </a>
              </GlarePanel>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel as="div" className="mt-6">
          <SplitReveal
            as="h2"
            text="Photo Gallery"
            className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
          />
          <p className="mt-3 max-w-[50rem] text-[1rem] leading-7 text-[rgba(245,247,242,0.72)]">
            Click any card to open the original file in a new tab.
          </p>

          <PortfolioCardView photos={portfolioPhotos} />
        </GlassPanel>
      </section>
    </main>
  );
}
