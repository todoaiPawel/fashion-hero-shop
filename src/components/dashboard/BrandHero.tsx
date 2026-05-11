import Image from "next/image";

export function BrandHero() {
  return (
    <div className="w-full">
      <div className="bg-foreground text-background">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs">
          Free Shipping on Orders over 299 zł · Easy Returns.
        </p>
      </div>

      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold italic tracking-tight">FashionHero</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Seller Analytics
          </span>
        </div>
      </header>

      <section className="relative h-[200px] w-full overflow-hidden sm:h-[320px]">
        <Image
          src="/images/hero/hero-1.jpg"
          alt="Sneakers fashion editorial – FashionHero seller analytics"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
            Seller Dashboard
          </span>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-4xl">
            Know Your Sizes. Reduce Returns.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
            Spot fit problems before they cost you margin.
          </p>
        </div>
      </section>
    </div>
  );
}
