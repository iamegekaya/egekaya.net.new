import SplitReveal from "@/components/about/split-reveal";
import GradientCallout from "@/components/ui/gradient-callout";
import StaggerList from "@/components/about/stagger-list";
import GlarePanel from "@/components/ui/glare-panel";
import GlassPanel from "@/components/ui/glass-panel";
import { GLASS_LIST_TILE_CLASS_NAME } from "@/components/ui/glass-tile";
import { SITE_ACCENT_COLOR, SITE_LIGHT_ACCENT_COLOR } from "@/lib/site-palette";

const educationHistory = [
  "Lüleburgaz Elementary School (2008-2013)",
  "Lüleburgaz Middle School (2013-2017)",
  "Lüleburgaz Anatolian High School (2017-2019)",
  "Lüleburgaz Bahçeşehir Anatolian High School (2019-2021)",
  "Yeditepe University Preparatory School (2021-2022)",
  "Yeditepe University (2022-present)",
];

const quickFacts = [
  { label: "Age", value: "22", detail: "Born on July 11, 2003." },
  { label: "Started With Tech", value: "2011", detail: "First computer, then no turning back." },
  { label: "Base", value: "Lüleburgaz", detail: "Raised in Kırklareli, still shaped by it." },
  { label: "Interests", value: "Security + Visuals", detail: "Technology, photography, and story." },
];

const interestCards = [
  {
    title: "Photography",
    copy: "I enjoy taking photos and editing them in Lightroom when I want to slow down and pay attention.",
  },
  {
    title: "Sports & Music",
    copy: "I listen to music constantly, follow Formula 1 closely, and I am a big Fenerbahçe fan.",
  },
  {
    title: "Cities & Culture",
    copy: "I love exploring cities and spending time in museums, historical places, and cultural sites.",
  },
];

export default function AboutPage() {
  return (
    <main className="site-page">
      <section className="w-[min(1120px,100%)]">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel as="div">
            <p className="site-page-eyebrow">About Me</p>
            <SplitReveal
              as="h1"
              text="Hello! My name is Ege."
              className="site-page-title max-w-none"
            />

            <div className="mt-6 space-y-5 text-[1.02rem] leading-7 text-[rgba(245,247,242,0.82)]">
              <p>
                Hello! My name is Ege, and I am 22 years old. I was born on July 11,
                2003, in Lüleburgaz district of Kırklareli. I am part of the last
                generation that grew up playing soccer in the streets and playing
                cards and marbles.
              </p>

              <p>
                I first encountered my first computer in 2011; since that day,
                technology has become an integral part of my life. My interest in
                technology deepened during university.
              </p>

              <p>
                In short, I enjoy working with technology, creating things, and
                learning something new every day.
              </p>
            </div>
          </GlassPanel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {quickFacts.map((fact) => (
              <GlarePanel
                key={fact.label}
                className="min-h-[152px]"
                glareColor={SITE_ACCENT_COLOR}
                glareOpacity={0.18}
                glareSize={170}
              >
                <div className="relative z-[1] flex h-full flex-col justify-between">
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.56)] uppercase">
                    {fact.label}
                  </p>
                  <div>
                    <p className="text-[1.7rem] leading-none font-semibold text-[var(--foreground)]">
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

        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassPanel className="lg:flex lg:h-full lg:flex-col">
            <SplitReveal
              as="h2"
              text="Education"
              className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]"
            />
            <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-7 text-[rgba(245,247,242,0.72)]">
              In order, I studied at the following schools.
            </p>

            <StaggerList
              items={educationHistory}
              className="mt-6 m-0 grid list-none gap-3 p-0 lg:flex-1"
              itemClassName={GLASS_LIST_TILE_CLASS_NAME}
            />
          </GlassPanel>

          <section className="grid h-full gap-4 content-start">
            {interestCards.map((card) => (
              <GlarePanel
                key={card.title}
                className="min-h-[180px]"
                variant="feature"
                glareColor={SITE_LIGHT_ACCENT_COLOR}
                glareOpacity={0.14}
                glareSize={200}
              >
                <div className="relative z-[1]">
                  <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
                    Interests
                  </p>
                  <h3 className="mt-4 text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[rgba(245,247,242,0.74)]">
                    {card.copy}
                  </p>
                </div>
              </GlarePanel>
            ))}
          </section>
        </div>

        <div className="mt-6 mx-auto w-full max-w-[780px]">
          <GradientCallout className="p-5 text-center sm:p-6">
            <p className="text-[0.74rem] font-bold tracking-[0.22em] text-[rgba(245,247,242,0.74)] uppercase">
              Closing Note
            </p>
            <p className="mt-4 text-[1.02rem] leading-7 text-[rgba(245,247,242,0.88)]">
              In my free time, I enjoy taking photos, editing them in Lightroom,
              listening to music, and playing games. I am a big Formula 1 and
              Fenerbahçe fan. I also love exploring cities and visiting cultural
              sites such as museums and historical places.
            </p>
          </GradientCallout>
        </div>
      </section>
    </main>
  );
}
