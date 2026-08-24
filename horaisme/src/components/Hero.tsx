import { Link } from 'react-router-dom'
import quebecAerial from '../assets/quebec-aerial.jpg'
import oeil from '../assets/hora-oeil.jpg'

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3rem)] items-center justify-center overflow-hidden rounded-xl border border-gold-dim/30 md:min-h-[calc(100svh-3.5rem)]">
      <img
        src={quebecAerial}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 size-full object-cover object-center"
        style={{ filter: 'saturate(0.55) brightness(0.5) contrast(1.08)' }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(125% 95% at 50% 40%, rgba(10,9,7,0) 0%, rgba(10,9,7,0.34) 55%, rgba(10,9,7,0.84) 100%), linear-gradient(to bottom, rgba(10,9,7,0.62) 0%, rgba(10,9,7,0.26) 34%, rgba(10,9,7,0.5) 70%, rgba(10,9,7,0.92) 100%)',
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative">
          <Rings />
          {/*
            L'œil est au centre exact des cercles : ils ne décorent pas le fond,
            ils partent de lui. Le glyphe « H » a cédé la place — il était
            redondant juste au-dessus du mot HORAÏSME, et il vit déjà dans la
            navigation et dans le mode poche.
          */}
          <span
            className="rise relative block size-20 md:size-[5.5rem]"
            style={{ animationDelay: '120ms' }}
          >
            <img
              src={oeil}
              alt=""
              aria-hidden="true"
              className="size-full rounded-full object-cover"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(201,169,97,0.5), 0 0 42px -6px rgba(95,179,169,0.42), 0 24px 60px -26px rgba(0,0,0,0.9)',
              }}
            />
            <span
              aria-hidden="true"
              className="breathe absolute -inset-1.5 rounded-full ring-1 ring-oeil/35"
            />
          </span>
        </div>

        <p
          className="rise mt-6 font-sans text-[0.64rem] font-light uppercase tracking-[0.42em] text-parchment/72 md:text-[0.7rem]"
          style={{ animationDelay: '260ms' }}
        >
          Le monde réel est ouvert
        </p>

        <h1
          className="rise mt-3 font-display text-[clamp(2.9rem,9.3vw,8.6rem)] font-normal leading-[1.02] tracking-[0.055em] text-[#fdfbf6]"
          style={{ animationDelay: '380ms', transform: 'translateX(0.028em)' }}
        >
          HORAÏSME
        </h1>

        <p
          className="rise mt-4 font-display text-[clamp(1.15rem,2.45vw,2.05rem)] italic text-parchment/95"
          style={{ animationDelay: '520ms' }}
        >
          Ta vie. Ton terrain de jeu.
        </p>

        <Link
          to="/aujourdhui"
          className="rise group mt-10 inline-flex items-center gap-3 rounded-[3px] bg-gold px-9 py-4 font-display text-[1.1rem] font-semibold tracking-[0.01em] text-ink shadow-[0_18px_50px_-18px_rgba(217,189,107,0.55)] transition duration-300 hover:bg-[#e6ce85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          style={{ animationDelay: '660ms' }}
        >
          Entrer sur le terrain
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            &#8594;
          </span>
        </Link>

        <p
          className="rise mt-5 font-display text-[0.82rem] italic text-parchment/55"
          style={{ animationDelay: '800ms' }}
        >
          La prochaine étape n’est pas ici.
        </p>
      </div>

      <div
        className="fade absolute bottom-5 right-6 text-right font-sans text-[0.6rem] uppercase leading-[1.85] tracking-[0.2em] text-parchment/45"
        style={{ animationDelay: '1100ms' }}
      >
        <div>46.8139° N · 71.2080° O</div>
        <div>Québec · Maintenant</div>
      </div>
    </section>
  )
}

function Rings() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ width: 'min(1120px, 172vw)' }}
    >
      {[
        { r: 156, o: 0.24 },
        { r: 312, o: 0.16 },
        { r: 499, o: 0.1 },
      ].map(({ r, o }) => (
        <circle
          key={r}
          cx="500"
          cy="500"
          r={r}
          fill="none"
          stroke="#c9a961"
          strokeOpacity={o}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
