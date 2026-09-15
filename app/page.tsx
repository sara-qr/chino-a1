import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F1E8] text-[#12263F]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 md:px-10">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight">
            Chino A1
          </div>

          <Link href="/progress" className="rounded-full border border-[#12263F] px-5 py-2 text-sm font-medium">
            Mi progreso
          </Link>
        </header>

        <div className="grid gap-12 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1F5EFF]">
              Aprende chino desde cero
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight md:text-7xl">
              你好
              <span className="mt-3 block text-[#1F5EFF]">
                Nǐ hǎo
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#43546A]">
              Tu curso guiado de chino A1 con lecciones, pronunciación,
              listening, ejercicios y sesiones con tutor.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/course/lesson-1" className="rounded-full bg-[#1F5EFF] px-7 py-4 font-medium text-white">
                Empezar curso
              </Link>

              <Link href="/course" className="rounded-full border border-[#12263F] px-7 py-4 font-medium">
                Ver temario
              </Link>
            </div>
          </div>

          <div className="rounded-[40px] bg-[#1F5EFF] p-8 text-white md:p-12">
            <p className="text-sm uppercase tracking-[0.2em] opacity-80">
              Tu primera clase
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              Unidad 1
            </h2>

            <p className="mt-2 text-xl">
              你好 · Hola
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-3xl bg-white/10 p-5">
                Repaso · 10 min
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                Contenido nuevo · 15 min
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                Pronunciación · 15 min
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                Ejercicios · 10 min
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-[#12263F]/10 pt-6 text-sm text-[#657386]">
          A1 · 15 lecciones · HSK Standard Course 1
        </footer>
      </section>
    </main>
  );
}
