import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Heart, HandHeart, MapPin, Phone, Instagram, Calendar, ArrowRight, Users, Home, Sparkles } from "lucide-react";
import { listPublishedPosts } from "@/lib/posts.functions";
import heroImg from "@/assets/hero-hands.jpg";
import historyImg from "@/assets/history-room.jpg";
import teamImg from "@/assets/team.jpg";

const postsQuery = queryOptions({
  queryKey: ["posts", "published"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Landing,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-muted-foreground">Não foi possível carregar. {error.message}</p>
    </div>
  ),
});

const NAV = [
  { href: "#historia", label: "Nossa história" },
  { href: "#atualizacoes", label: "Atualizações" },
  { href: "#apoio", label: "Como apoiar" },
  { href: "#criadores", label: "Quem faz" },
  { href: "#contato", label: "Contato" },
];

const CATEGORY_LABEL: Record<string, string> = {
  atualizacao: "Atualização",
  evento: "Evento",
  doacao: "Doação",
  historia: "História",
};

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Stats />
      <History />
      <Updates />
      <Support />
      <Creators />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg text-ocean">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-ocean text-primary-foreground">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-semibold">Projeto Dignidade</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-ocean transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#apoio"
          className="inline-flex items-center gap-2 rounded-full gradient-ocean px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition"
        >
          <HandHeart className="h-4 w-4" /> Apoiar
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-sky-soft -z-10" />
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-ocean">
            <Sparkles className="h-3.5 w-3.5" /> Instituto Marcelo D. S. Mello · União da Vitória - PR
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl leading-[1.05] text-ocean">
            Você importa <em className="not-italic text-primary">para nós.</em>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
            Acolhemos, escutamos e caminhamos ao lado de homens em situação de rua, de passagem
            e famílias coletoras da nossa cidade. Um lugar de dignidade, todos os dias.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#apoio" className="inline-flex items-center gap-2 rounded-full gradient-ocean px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:translate-y-[-1px] transition">
              Quero apoiar <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#historia" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-ocean hover:bg-secondary transition">
              Conheça o projeto
            </a>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Seg 7h–17h · Ter 9h–17h</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> R. Joaquim Távora, 1434</div>
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 gradient-ocean rounded-3xl blur-2xl opacity-20" />
          <img
            src={heroImg}
            alt="Duas mãos se encontrando em gesto de acolhimento"
            width={1600}
            height={1100}
            className="relative rounded-3xl shadow-soft object-cover aspect-[4/3] w-full"
          />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { icon: Users, k: "1.254", v: "vidas caminhando junto" },
    { icon: Home, k: "273", v: "histórias registradas" },
    { icon: HandHeart, k: "2 dias", v: "de acolhimento por semana" },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((i) => (
          <div key={i.v} className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
              <i.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-2xl text-ocean">{i.k}</div>
              <div className="text-sm text-muted-foreground">{i.v}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function History() {
  return (
    <section id="historia" className="mx-auto max-w-6xl px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
      <img
        src={historyImg}
        alt="Sala de refeições do Instituto preparada para acolher"
        width={1400}
        height={1000}
        loading="lazy"
        className="rounded-3xl shadow-soft object-cover aspect-[4/3] w-full order-2 md:order-1"
      />
      <div className="order-1 md:order-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Nossa história</span>
        <h2 className="mt-3 text-3xl md:text-4xl text-ocean">Um lar de portas abertas em União da Vitória.</h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          O <strong className="text-foreground">Instituto Marcelo D. S. Mello</strong> nasceu do desejo de olhar de frente
          para quem a cidade muitas vezes prefere não ver. Hoje o Projeto Dignidade é tocado por{" "}
          <strong className="text-foreground">Simone Gaspari Mello</strong> ao lado de seus filhos e de dezenas
          de voluntários que dedicam seu tempo, cozinha e escuta.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Atendemos <strong className="text-foreground">exclusivamente homens</strong> em situação de rua, de passagem
          e famílias coletoras — segundas e terças, com café, refeição, banho, roupas limpas
          e, sobretudo, uma conversa sem pressa.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Pill label="Segunda-feira" value="7h às 17h" />
          <Pill label="Terça-feira" value="9h às 17h" />
        </div>
      </div>
    </section>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl text-ocean">{value}</div>
    </div>
  );
}

function Updates() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data: posts } = useSuspenseQuery({
    ...postsQuery,
    queryFn: () => fetchPosts(),
  });

  return (
    <section id="atualizacoes" className="bg-secondary/40 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Atualizações</span>
            <h2 className="mt-3 text-3xl md:text-4xl text-ocean">O que anda acontecendo por aqui</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Eventos, campanhas de doação e pequenas histórias que aquecem a semana.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-card p-10 text-center text-muted-foreground">
            Em breve, novas atualizações.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="group rounded-3xl bg-card overflow-hidden border border-border hover:shadow-soft transition">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/10] w-full gradient-sky-soft flex items-center justify-center">
                    <Heart className="h-10 w-10 text-primary/40" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    {CATEGORY_LABEL[p.category] ?? p.category}
                    <span className="text-muted-foreground">·</span>
                    <time className="text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="mt-3 font-display text-xl text-ocean leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Support() {
  return (
    <section id="apoio" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        <div className="rounded-3xl gradient-ocean text-primary-foreground p-8 md:p-10 shadow-soft flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Como apoiar</span>
          <h2 className="mt-3 text-3xl md:text-4xl">Um gesto pequeno vira uma refeição, um colchão, um abraço.</h2>
          <p className="mt-4 opacity-90 leading-relaxed">
            Sua doação sustenta café da manhã, almoço, roupas, colchões, produtos de higiene
            e o funcionamento da casa. Qualquer valor caminha com a gente.
          </p>
          <div className="mt-8 rounded-2xl bg-background/10 backdrop-blur p-6 border border-primary-foreground/20">
            <div className="text-xs uppercase tracking-wider opacity-80">Chave PIX</div>
            <div className="mt-2 font-display text-2xl">Em breve disponível</div>
            <p className="mt-2 text-sm opacity-80">
              Enquanto isso, fale conosco no WhatsApp para combinar doações em dinheiro,
              alimentos, roupas ou colchões.
            </p>
            <a
              href="https://wa.me/5542999309191"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-background text-ocean px-5 py-3 text-sm font-semibold hover:opacity-95 transition"
            >
              <Phone className="h-4 w-4" /> (42) 99930-9191
            </a>
          </div>
        </div>

        <div id="contato" className="rounded-3xl bg-card border border-border p-8 md:p-10 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Onde estamos</span>
          <h3 className="mt-3 font-display text-2xl text-ocean">Venha nos visitar</h3>
          <p className="mt-3 text-muted-foreground">
            R. Joaquim Távora, 1434 — São Bernardo<br />União da Vitória - PR · 84600-000
          </p>
          <div className="mt-6 rounded-2xl overflow-hidden border border-border">
            <iframe
              title="Localização do Instituto"
              src="https://www.google.com/maps?q=R.+Joaquim+T%C3%A1vora,+1434+-+S%C3%A3o+Bernardo,+Uni%C3%A3o+da+Vit%C3%B3ria+-+PR&output=embed"
              className="w-full aspect-[4/3]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href="https://instagram.com/proj.dignidade" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-secondary transition">
              <Instagram className="h-4 w-4 text-primary" /> @proj.dignidade
            </a>
            <a href="https://wa.me/5542999309191" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-secondary transition">
              <Phone className="h-4 w-4 text-primary" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Creators() {
  return (
    <section id="criadores" className="bg-secondary/40 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quem faz acontecer</span>
          <h2 className="mt-3 text-3xl md:text-4xl text-ocean">Uma família e uma cidade inteira.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            O Instituto <strong className="text-foreground">Marcelo Domicio Scaramella de Mello</strong> honra
            uma memória e sustenta um propósito. Hoje <strong className="text-foreground">Simone Gaspari Mello</strong>{" "}
            coordena o projeto com o apoio incansável de seus filhos e de um time de voluntários
            que se revezam na cozinha, no bazar, na escuta e na organização das doações.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Se você quer somar tempo, mãos ou ideias, esse convite também é para você.
          </p>
          <a href="https://wa.me/5542999309191" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full gradient-ocean px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:translate-y-[-1px] transition">
            Quero ser voluntário <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <img
          src={teamImg}
          alt="Time de voluntários do Projeto Dignidade"
          width={1200}
          height={900}
          loading="lazy"
          className="rounded-3xl shadow-soft object-cover aspect-[4/3] w-full"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full gradient-ocean text-primary-foreground">
            <Heart className="h-3.5 w-3.5" fill="currentColor" />
          </span>
          <span>Projeto Dignidade · Instituto Marcelo D. S. Mello</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://instagram.com/proj.dignidade" target="_blank" rel="noreferrer" className="hover:text-ocean transition">Instagram</a>
          <a href="https://wa.me/5542999309191" target="_blank" rel="noreferrer" className="hover:text-ocean transition">WhatsApp</a>
          <Link to="/auth" className="hover:text-ocean transition">Área admin</Link>
        </div>
      </div>
    </footer>
  );
}

// Silence unused warning from optional useQuery import when tree-shaken
void useQuery;
