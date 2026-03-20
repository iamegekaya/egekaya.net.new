/* eslint-disable @next/next/no-img-element */

type PortfolioPhoto = {
  index: number;
  src: string;
  title: string;
};

type PortfolioCardViewProps = {
  photos: PortfolioPhoto[];
};

export default function PortfolioCardView({ photos }: PortfolioCardViewProps) {
  return (
    <div className="mt-6 columns-1 gap-6 sm:columns-2 xl:columns-3">
      {photos.map((photo) => (
        <a
          key={photo.src}
          href={photo.src}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 block break-inside-avoid"
          aria-label={`Open ${photo.title}`}
        >
          <article className="group overflow-hidden border border-[rgba(255,245,224,0.12)] bg-[rgba(12,18,16,0.88)] shadow-[0_24px_64px_rgba(0,0,0,0.34)] transition-transform duration-300 ease-out hover:-translate-y-1">
            <div className="relative overflow-hidden">
              <img
                src={photo.src}
                alt={photo.title}
                className="block h-auto w-full"
                loading={photo.index <= 4 ? "eager" : "lazy"}
              />
            </div>
          </article>
        </a>
      ))}
    </div>
  );
}
