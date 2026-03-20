import LetterGlitch from "@/components/backgrounds/letter-glitch";
import StaggeredMenu, {
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/components/navigation/staggered-menu";
import { SITE_GLITCH_COLORS } from "@/lib/site-palette";

type SiteLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const navigationItems = [
  { label: "About", link: "/about", ariaLabel: "Go to about page" },
  {
    label: "Cyber Security",
    link: "/cyber-security",
    ariaLabel: "Go to cyber security page",
  },
  { label: "Photography", link: "/photography", ariaLabel: "Go to photography page" },
  {
    label: "cv.egekaya.net",
    link: "https://cv.egekaya.net",
    ariaLabel: "Go to cv.egekaya.net",
  },
  {
    label: "ai.egekaya.net",
    link: "https://ai.egekaya.net",
    ariaLabel: "Go to ai.egekaya.net",
  },
  { label: "Contact", link: "/contact", ariaLabel: "Go to contact page" },
] satisfies StaggeredMenuItem[];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/iamegekaya/" },
  { label: "LinkedIn", link: "https://www.linkedin.com/in/iamegekaya/" },
  { label: "GitHub", link: "https://github.com/iamegekaya" },
] satisfies StaggeredMenuSocialItem[];

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="site-canvas">
      <div className="site-background" aria-hidden="true">
        <LetterGlitch
          glitchColors={SITE_GLITCH_COLORS}
          glitchSpeed={100}
          centerVignette
          outerVignette
          smooth
        />
      </div>

      <StaggeredMenu
        brand="Ege Kaya"
        brandHref="/"
        items={navigationItems}
        socialItems={socialItems}
        isFixed
      />

      {children}

      <footer className="relative z-[1] px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="mx-auto w-fit rounded-full border border-[var(--surface-border-footer)] bg-[var(--surface-footer-bg)] px-5 py-3 text-center text-[0.78rem] font-medium tracking-[0.08em] text-[var(--surface-text-footer)] shadow-[var(--surface-shadow-footer)] backdrop-blur-[16px]">
          © 2026 Ege Kaya - egekaya.net. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
