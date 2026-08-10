import React, { useEffect, useMemo, useState } from 'react';
import {
  Castle,
  Crown,
  Gamepad2,
  Home as HomeIcon,
  Lock,
  LogOut,
  Medal,
  Minus,
  Plus,
  RotateCcw,
  Save,
  ScrollText,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Unlock,
  Users
} from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Marotta2026';
const ADMIN_SESSION_KEY = 'limatoliadi-admin';
const SCORE_STORAGE_KEY = 'limatoliadi-scores';

const navItems = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'giochi', label: 'Giochi', Icon: Gamepad2 },
  { id: 'squadre', label: 'Team', Icon: Users },
  { id: 'regole', label: 'Regole', Icon: ScrollText },
  { id: 'albo', label: 'Albo', Icon: Crown }
];

const games = [
  {
    name: 'Tiro della Gloria',
    tag: 'Precisione e nervi saldi',
    points: '1° 10 pt - 2° 8 pt - 3° 6 pt - 4° 4 pt',
    text: 'Serietà da finale olimpica, tecnica da allenamento improvvisato.',
    color: 'from-[#FFD166] to-[#EF476F]'
  },
  {
    name: 'Staffetta del Disonore',
    tag: 'Velocità familiare',
    points: 'Punteggio standard',
    text: 'Si corre, si passa il testimone, ci si accusa. Tutto regolare, purché con stile.',
    color: 'from-[#06D6A0] to-[#118AB2]'
  },
  {
    name: 'Quiz Marotta',
    tag: 'Cultura e bluff',
    points: 'Bonus velocità da definire',
    text: 'Domande facili solo per chi le scrive. Per gli altri resta il nobile tentativo.',
    color: 'from-[#7B2CBF] to-[#EF476F]'
  }
];

const teams = [
  {
    name: 'I Mastini del Volturno',
    double: 'Tiro della Gloria',
    logo: 'MV',
    badge: { type: 'oro', year: '2024' },
    color: 'bg-[#FFD166]',
    members: [
      { name: 'Partecipante 1', quote: 'Crede nel gruppo, soprattutto quando vince lui.' },
      { name: 'Partecipante 2', quote: 'Non cerca scuse. Le prepara in anticipo.' }
    ]
  },
  {
    name: 'Le Comete di Biancano',
    double: 'Quiz Marotta',
    logo: 'CB',
    badge: { type: 'bronzo', year: '2023' },
    color: 'bg-[#06D6A0]',
    members: [
      { name: 'Partecipante 3', quote: 'La calma è la sua arma. Il sospetto è il suo metodo.' },
      { name: 'Partecipante 4', quote: 'Punta al podio. Poi eventualmente anche alla pace familiare.' }
    ]
  },
  {
    name: 'Squadra placeholder',
    double: 'Da dichiarare',
    logo: 'SP',
    badge: null,
    color: 'bg-[#EF476F]',
    members: [
      { name: 'Partecipante 5', quote: 'La strategia è semplice: negare tutto.' },
      { name: 'Partecipante 6', quote: 'Non partecipa per vincere. Partecipa per ricordarlo agli altri.' }
    ]
  }
];

const hall = [
  { year: '2025', rows: [['1°', 'Squadra da inserire', '00 pt'], ['2°', 'Squadra da inserire', '00 pt'], ['3°', 'Squadra da inserire', '00 pt']] },
  { year: '2024', rows: [['1°', 'I Mastini del Volturno', '00 pt'], ['2°', 'Squadra da recuperare', '00 pt'], ['3°', 'Squadra da recuperare', '00 pt']] },
  { year: '2023', rows: [['1°', 'Squadra da recuperare', '00 pt'], ['2°', 'Squadra da recuperare', '00 pt'], ['3°', 'Le Comete di Biancano', '00 pt']] }
];

const defaultScores = teams.map((team) => ({
  team: team.name,
  points: 0,
  double: team.double
}));

function loadScores() {
  try {
    const savedScores = localStorage.getItem(SCORE_STORAGE_KEY);
    return savedScores ? JSON.parse(savedScores) : defaultScores;
  } catch {
    return defaultScores;
  }
}

function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-[#17202A] text-white hover:bg-[#283440]',
    secondary: 'bg-white text-[#17202A] hover:bg-[#FFF7E8]',
    danger: 'bg-[#EF476F] text-white hover:bg-[#d93d62]'
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-black transition active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function EventMark({ small = false }) {
  return (
    <div className={`relative shrink-0 ${small ? 'h-12 w-12' : 'h-24 w-24'}`}>
      <div className="absolute inset-0 rounded-full bg-[#FFD166] shadow-xl" />
      <div className="absolute inset-1.5 rounded-full bg-[#FFF7E8]" />
      <Castle className={`absolute left-1/2 -translate-x-1/2 text-[#17202A] ${small ? 'top-3 h-5 w-5' : 'top-5 h-8 w-8'}`} />
      {!small && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-2xl">🔥</div>}
      {!small && <div className="absolute -right-1 top-2 rounded-full bg-[#06D6A0] px-2 py-1 text-[10px] font-black">LM</div>}
    </div>
  );
}

function Shell({ page, setPage, isAdmin, onLogout, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF7E8] text-[#17202A]">
      <header className="fixed left-0 right-0 top-0 z-50 hidden px-8 pt-5 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/75 px-3 py-2 shadow-lg backdrop-blur-xl">
          <button onClick={() => setPage('home')} className="flex items-center gap-2 rounded-full px-2 py-1 text-left">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#FFD166]"><Castle className="h-5 w-5" /></div>
            <div className="leading-none">
              <div className="text-sm font-black tracking-tight">Limatoliadi</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#17202A]/60">Arena Marotta</div>
            </div>
          </button>
          <nav className="flex gap-1 rounded-full p-1">
            {navItems.map(({ id, label }) => (
              <button key={id} onClick={() => setPage(id)} className={`rounded-full px-4 py-2 text-sm font-bold ${page === id ? 'bg-[#17202A] text-white' : 'hover:bg-white'}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <header className="fixed left-0 right-0 top-0 z-50 bg-[#FFF7E8]/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EventMark small />
            <div>
              <div className="text-xl font-black leading-none">Limatoliadi</div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#EF476F]">Arena Marotta</div>
            </div>
          </div>
          <button onClick={isAdmin ? onLogout : undefined} className={`rounded-full px-3 py-2 text-xs font-black shadow ${isAdmin ? 'bg-[#06D6A0]' : 'bg-white'}`}>
            {isAdmin ? 'Regia attiva' : 'Live'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-24 md:px-8 md:pb-20 md:pt-32">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/90 px-2 pb-3 pt-2 shadow-[0_-12px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`rounded-2xl px-1 py-2 text-[10px] font-black ${page === id ? 'bg-[#17202A] text-white' : 'text-[#17202A]/65'}`}>
              <Icon className="mx-auto mb-1 h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function AdminGate({ isAdmin, onLogin, onLogout }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdmin) {
    return (
      <div className="mt-4 rounded-2xl bg-[#06D6A0]/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-black"><Unlock className="h-5 w-5" /> Regia attiva</div>
            <p className="mt-1 text-xs text-[#17202A]/60">I comandi punti sono abilitati su questo dispositivo.</p>
          </div>
          <Button variant="secondary" onClick={onLogout}><LogOut className="h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setPassword('');
      setError('');
      onLogin();
    } else {
      setError('Password errata. La giuria respinge il ricorso.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-2xl bg-[#17202A] p-4 text-white">
      <div className="mb-3 flex items-center gap-2 font-black"><Lock className="h-5 w-5 text-[#FFD166]" /> Accedi alla regia</div>
      <div className="flex gap-2">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 font-bold text-[#17202A] outline-none"
        />
        <Button variant="secondary" type="submit">Entra</Button>
      </div>
      {error && <div className="mt-3 rounded-xl bg-[#EF476F]/20 p-3 text-xs font-bold">{error}</div>}
    </form>
  );
}

function Scoreboard({ scores, setScores, compact = false, isAdmin, onLogin, onLogout }) {
  const sortedScores = useMemo(() => [...scores].sort((a, b) => b.points - a.points), [scores]);

  function updateScore(team, delta) {
    setScores((currentScores) => currentScores.map((score) => (
      score.team === team ? { ...score, points: Math.max(0, score.points + delta) } : score
    )));
  }

  function resetScore(team) {
    setScores((currentScores) => currentScores.map((score) => (
      score.team === team ? { ...score, points: 0 } : score
    )));
  }

  return (
    <section className={`overflow-hidden border-0 bg-white/85 shadow-xl backdrop-blur ${compact ? 'rounded-[1.5rem]' : 'rounded-[2rem]'}`}>
      <div className={compact ? 'p-4' : 'p-5 md:p-7'}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#EF476F]">Live score</div>
            <h3 className={compact ? 'text-xl font-black' : 'text-2xl font-black'}>Classifica provvisoria</h3>
          </div>
          <Trophy className="h-8 w-8 text-[#FFD166]" />
        </div>

        <div className="space-y-2">
          {sortedScores.map((score, index) => (
            <div key={score.team} className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-2xl bg-[#FFF7E8] p-3">
              <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black ${index === 0 ? 'bg-[#FFD166]' : index === 1 ? 'bg-slate-200' : index === 2 ? 'bg-orange-200' : 'bg-white'}`}>{index + 1}</div>
              <div className="min-w-0">
                <div className="truncate font-black">{score.team}</div>
                <div className="truncate text-xs text-[#17202A]/60">Raddoppio: {score.double}</div>
              </div>
              <div className="text-right text-2xl font-black">{score.points}</div>
            </div>
          ))}
        </div>

        <AdminGate isAdmin={isAdmin} onLogin={onLogin} onLogout={onLogout} />

        {isAdmin && (
          <details open className="mt-4 rounded-2xl bg-[#17202A] p-4 text-white">
            <summary className="cursor-pointer font-black">Comandi regia</summary>
            <div className="mt-4 space-y-3">
              {scores.map((score) => (
                <div key={score.team} className="rounded-xl bg-white/10 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-bold">{score.team}</span>
                    <span className="font-black">{score.points} pt</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <Button variant="secondary" onClick={() => updateScore(score.team, -5)}>-5</Button>
                    <Button variant="secondary" onClick={() => updateScore(score.team, -1)}><Minus className="h-4 w-4" /></Button>
                    <Button variant="secondary" onClick={() => updateScore(score.team, 1)}><Plus className="h-4 w-4" /></Button>
                    <Button variant="secondary" onClick={() => updateScore(score.team, 5)}>+5</Button>
                    <Button variant="danger" onClick={() => resetScore(score.team)}><RotateCcw className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/70"><Save className="h-4 w-4" /> I punti vengono salvati su questo browser.</div>
          </details>
        )}
      </div>
    </section>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#FFF7E8] p-4">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-[#EF476F]">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}

function HomePage({ scores, setScores, isAdmin, onLogin, onLogout }) {
  return (
    <>
      <div className="space-y-4 md:hidden">
        <Scoreboard scores={scores} setScores={setScores} compact isAdmin={isAdmin} onLogin={onLogin} onLogout={onLogout} />
        <section className="rounded-[1.75rem] bg-white/80 p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <EventMark small />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#EF476F]">Olimpiade familiare</div>
              <h1 className="text-4xl font-black leading-none tracking-tight">Limatoliadi</h1>
            </div>
          </div>
          <p className="text-2xl font-black leading-tight">Il giorno in cui la famiglia smette di fingere disinteresse per la vittoria.</p>
          <p className="mt-4 text-base leading-relaxed text-[#17202A]/70">Giochi, coppie, scelte tattiche e classifiche che verranno ricordate più del dovuto.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <InfoTile label="Data" value="Da annunciare" />
            <InfoTile label="Format" value="Coppie" />
          </div>
        </section>
        <CountdownBox />
      </div>

      <div className="hidden gap-6 md:grid lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] bg-white/65 p-10 shadow-xl backdrop-blur">
          <div className="mb-8 flex items-center gap-5">
            <EventMark />
            <div>
              <div className="mb-2 inline-flex rounded-full bg-[#06D6A0]/20 px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">Arena Marotta</div>
              <h1 className="text-7xl font-black leading-[0.95] tracking-tight">Limatoliadi</h1>
            </div>
          </div>
          <p className="max-w-2xl text-3xl font-black leading-tight">Il giorno in cui la famiglia smette di fingere disinteresse per la vittoria.</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#17202A]/75">Una giornata di giochi, coppie, alleanze fragili e classifiche ricordate per anni.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <InfoTile label="Data" value="Da annunciare" />
            <InfoTile label="Format" value="Coppie in gara" />
            <InfoTile label="Spirito" value="Sana rivalità" />
          </div>
          <div className="mt-8"><CountdownBox /></div>
        </section>
        <Scoreboard scores={scores} setScores={setScores} isAdmin={isAdmin} onLogin={onLogin} onLogout={onLogout} />
      </div>
    </>
  );
}

function CountdownBox() {
  return (
    <section className="rounded-[1.75rem] bg-[#17202A] p-5 text-white shadow-xl md:rounded-[2rem]">
      <div className="flex items-center gap-2"><Timer className="h-5 w-5 text-[#FFD166]" /><div className="text-xs font-black uppercase tracking-[0.2em]">Countdown ufficiale</div></div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {['--\ngiorni', '--\nore', '--\nmin', '--\nsec'].map((value) => (
          <div key={value} className="whitespace-pre-line rounded-2xl bg-white/10 p-3 text-xs font-black">{value}</div>
        ))}
      </div>
    </section>
  );
}

function PageTitle({ icon, title, kicker, subtitle }) {
  return (
    <div className="mb-5 rounded-[1.75rem] bg-white/75 p-5 shadow-xl backdrop-blur md:mb-7 md:rounded-[2rem] md:p-8">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFD166] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] md:text-xs">{icon}{kicker}</div>
      <h2 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-[#17202A]/70 md:text-base">{subtitle}</p>
    </div>
  );
}

function GamesPage() {
  return (
    <div>
      <PageTitle icon={<Gamepad2 className="h-4 w-4" />} title="Giochi" kicker="Programma tecnico" subtitle="Card pronte per ospitare giochi reali, spiegazione e punti." />
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {games.map((game) => (
          <section key={game.name} className="overflow-hidden rounded-[1.5rem] border-0 bg-white/85 shadow-xl md:rounded-[2rem]">
            <div className={`h-36 bg-gradient-to-br ${game.color} p-4 md:h-48 md:p-5`}>
              <div className="grid h-full place-items-center rounded-[1.25rem] border-4 border-white/60 bg-white/20"><Sparkles className="h-12 w-12 text-white md:h-16 md:w-16" /></div>
            </div>
            <div className="p-4 md:p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#118AB2] md:text-xs">{game.tag}</div>
              <h3 className="mt-2 text-2xl font-black">{game.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#17202A]/70">{game.text}</p>
              <div className="mt-4 rounded-2xl bg-[#FFF7E8] p-3 text-sm font-black">{game.points}</div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Badge({ badge }) {
  if (!badge) return null;
  const styles = { oro: 'bg-[#FFD166]', argento: 'bg-slate-200', bronzo: 'bg-orange-200' };
  return <div className={`${styles[badge.type]} inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase`}><Medal className="h-4 w-4" /> {badge.type} {badge.year}</div>;
}

function TeamsPage() {
  return (
    <div>
      <PageTitle icon={<Users className="h-4 w-4" />} title="Squadre" kicker="Coppie e loghi" subtitle="Foto singole, frasi, raddoppio e badge storici." />
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {teams.map((team) => (
          <section key={team.name} className="overflow-hidden rounded-[1.5rem] border-0 bg-white/85 shadow-xl md:rounded-[2rem]">
            <div className="p-4 md:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-[#EF476F]">Squadra</div>
                  <h3 className="text-2xl font-black">{team.name}</h3>
                </div>
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${team.color} text-lg font-black shadow`}>{team.logo}</div>
              </div>
              <Badge badge={team.badge} />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {team.members.map((member) => (
                  <div key={member.name} className="rounded-2xl bg-[#FFF7E8] p-3">
                    <div className="mb-3 grid aspect-square place-items-center rounded-2xl bg-white"><Users className="h-9 w-9 text-[#17202A]/30" /></div>
                    <div className="font-black">{member.name}</div>
                    <p className="mt-1 text-xs leading-relaxed text-[#17202A]/65">“{member.quote}”</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-[#17202A] p-4 text-white"><div className="text-xs uppercase tracking-[0.2em] text-white/60">Gioco raddoppiato</div><div className="mt-1 font-black">{team.double}</div></div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RulesPage() {
  const rules = [
    'La vittoria è importante. La dignità anche, ma arriva seconda.',
    'Ogni contestazione va presentata con tono fermo, prove deboli e assoluta convinzione.',
    'Il gioco raddoppiato si dichiara prima: il pentimento è previsto, il cambio no.',
    'La sana competizione è obbligatoria. L’ostilità permanente è rimandata al pranzo.',
    'Chi bara viene squalificato moralmente, poi eventualmente anche in classifica.',
    'Il rispetto reciproco vale sempre, soprattutto mentre si perde in modo inspiegabile.',
    'L’arbitro può sbagliare. La famiglia può ricordarglielo per anni.',
    'Ogni medaglia diventa titolo nobiliare fino all’edizione successiva.'
  ];

  return (
    <div>
      <PageTitle icon={<ScrollText className="h-4 w-4" />} title="Costituzione" kicker="Caos organizzato" subtitle="Poche regole, chiare e abbastanza elastiche da generare discussione." />
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {rules.map((rule, index) => (
          <div key={rule} className="rounded-[1.5rem] bg-white/85 p-5 shadow-lg">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#118AB2]">Articolo {index + 1}</div>
            <div className="text-lg font-black leading-snug">{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HallPage() {
  return (
    <div>
      <PageTitle icon={<Crown className="h-4 w-4" />} title="Albo d'oro" kicker="Storia ufficiale" subtitle="Classifiche precedenti e spazio per highlights memorabili." />
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {hall.map((edition) => (
          <section key={edition.year} className="rounded-[1.5rem] border-0 bg-white/85 shadow-xl md:rounded-[2rem]">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-3xl font-black">{edition.year}</h3><Trophy className="h-7 w-7 text-[#FFD166]" /></div>
              <div className="space-y-3">
                {edition.rows.map(([position, team, points]) => (
                  <div key={position + team} className="grid grid-cols-[44px_1fr_auto] gap-2 rounded-2xl bg-[#FFF7E8] p-3 text-sm">
                    <div className="font-black">{position}</div><div className="font-bold">{team}</div><div className="font-black text-[#EF476F]">{points}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="mt-5 rounded-[1.5rem] bg-[#17202A] p-5 text-white md:mt-6 md:rounded-[2rem] md:p-6">
        <div className="mb-2 flex items-center gap-2 font-black"><Star className="h-5 w-5 text-[#FFD166]" /> Highlights da tramandare</div>
        <p className="text-white/70">Spazio per rimonte improbabili, ricorsi respinti e dichiarazioni a caldo.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [scores, setScores] = useState(loadScores);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  function loginAdmin() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    setIsAdmin(true);
  }

  function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }

  return (
    <Shell page={page} setPage={setPage} isAdmin={isAdmin} onLogout={logoutAdmin}>
      {page === 'home' && <HomePage scores={scores} setScores={setScores} isAdmin={isAdmin} onLogin={loginAdmin} onLogout={logoutAdmin} />}
      {page === 'giochi' && <GamesPage />}
      {page === 'squadre' && <TeamsPage />}
      {page === 'regole' && <RulesPage />}
      {page === 'albo' && <HallPage />}
    </Shell>
  );
}
