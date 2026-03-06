import { useEffect, useRef, useCallback } from "react";

/* ─── SYNTAX TOKEN TYPES ─── */
type TokenClass =
  | "kw" | "fn" | "str" | "num" | "cmt"
  | "var" | "op" | "cls" | "prp" | "name-hi" | "";

interface Token { t: string; c: TokenClass; }
type CodeLine = Token[];

/* ─── CODE SCRIPT ─── */
const LINES: CodeLine[] = [
  [{ t: "// Initializing portfolio...", c: "cmt" }],
  [{ t: "", c: "" }],
  [{ t: "import ", c: "kw" }, { t: "{ Developer, Creator }", c: "op" }, { t: " from ", c: "kw" }, { t: '"@koustav/core"', c: "str" }, { t: ";", c: "op" }],
  [{ t: "import ", c: "kw" }, { t: "{ motion, aura }", c: "op" }, { t: " from ", c: "kw" }, { t: '"@koustav/portfolio"', c: "str" }, { t: ";", c: "op" }],
  [{ t: "", c: "" }],
  [{ t: "// ── Defining the engineer ──────────────", c: "cmt" }],
  [{ t: "const ", c: "kw" }, { t: "name", c: "var" }, { t: "     = ", c: "op" }, { t: '"', c: "str" }, { t: "Koustav Paul", c: "name-hi" }, { t: '"', c: "str" }, { t: ";", c: "op" }],
  [{ t: "const ", c: "kw" }, { t: "role", c: "var" }, { t: "     = ", c: "op" }, { t: '"Full-Stack Web Developer"', c: "str" }, { t: ";", c: "op" }],
  [{ t: "const ", c: "kw" }, { t: "passion", c: "var" }, { t: "  = ", c: "op" }, { t: '"UI/UX + System Design"', c: "str" }, { t: ";", c: "op" }],
  [{ t: "", c: "" }],
  [{ t: "const ", c: "kw" }, { t: "stack", c: "var" }, { t: "    = [", c: "op" }],
  [{ t: '  "React"', c: "str" }, { t: ", ", c: "op" }, { t: '"TypeScript"', c: "str" }, { t: ", ", c: "op" }, { t: '"Next.js"', c: "str" }, { t: ", ", c: "op" }, { t: '"Tailwind"', c: "str" }, { t: ",", c: "op" }],
  [{ t: '  "Node.js"', c: "str" }, { t: ", ", c: "op" }, { t: '"MongoDB"', c: "str" }, { t: ", ", c: "op" }, { t: '"Framer Motion"', c: "str" }, { t: ",", c: "op" }],
  [{ t: "];", c: "op" }],
  [{ t: "", c: "" }],
  [{ t: "function ", c: "kw" }, { t: "buildPortfolio", c: "fn" }, { t: "(", c: "op" }, { t: "config", c: "var" }, { t: ": ", c: "op" }, { t: "Developer", c: "cls" }, { t: ") {", c: "op" }],
  [{ t: "  ", c: "op" }, { t: "return ", c: "kw" }, { t: "{", c: "op" }],
  [{ t: "    ", c: "op" }, { t: "passion", c: "prp" }, { t: ": ", c: "op" }, { t: "true", c: "kw" }, { t: ",", c: "op" }],
  [{ t: "    ", c: "op" }, { t: "sleepDeprivation", c: "prp" }, { t: ": ", c: "op" }, { t: "Infinity", c: "num" }, { t: ",", c: "op" }],
  [{ t: "    ", c: "op" }, { t: "mission", c: "prp" }, { t: ": ", c: "op" }, { t: '"Craft interfaces people feel"', c: "str" }, { t: ",", c: "op" }],
  [{ t: "  ", c: "op" }, { t: "};", c: "op" }],
  [{ t: "}", c: "op" }],
  [{ t: "", c: "" }],
  [{ t: "// Compiling...", c: "cmt" }],
  [{ t: "buildPortfolio", c: "fn" }, { t: "({ ", c: "op" }, { t: "name", c: "prp" }, { t: ", ", c: "op" }, { t: "role", c: "prp" }, { t: ", ", c: "op" }, { t: "stack", c: "prp" }, { t: ", ", c: "op" }, { t: "passion", c: "prp" }, { t: " });", c: "op" }],
  [{ t: "", c: "" }],
  [{ t: "// ✓  Build successful — launching...", c: "cmt" }],
];

const TOTAL_CHARS = LINES.reduce((s, l) => s + l.reduce((a, t) => a + t.t.length, 0), 0);

const COLOR: Record<TokenClass, string> = {
  kw:       "#c586c0",
  fn:       "#dcdcaa",
  str:      "#ce9178",
  num:      "#b5cea8",
  cmt:      "#6a9955",
  var:      "#9cdcfe",
  op:       "#c8c8c8",
  cls:      "#4ec9b0",
  prp:      "#9cdcfe",
  "name-hi":"#ffffff",
  "":       "#c8c8c8",
};

const FONT_STYLE: Partial<Record<TokenClass, string>> = { cmt: "italic" };

/* ─── MAIN COMPONENT ─── */
export default function TerminalLoader({ onComplete }: { onComplete?: () => void }) {
  const caRef   = useRef<HTMLDivElement>(null);
  const pfRef   = useRef<HTMLDivElement>(null);
  const stRef   = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(0);
  const exitRef = useRef(false);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const updateProgress = useCallback(() => {
    const p = Math.min(100, Math.round(doneRef.current / TOTAL_CHARS * 100));
    if (pfRef.current)  pfRef.current.style.width = p + "%";
    if (stRef.current)  stRef.current.textContent  = p + "%";
  }, []);

  useEffect(() => {
    const ca = caRef.current!;
    const cursor = document.createElement("span");
    cursor.style.cssText = `
      display:inline-block;width:2px;height:1em;
      background:rgba(170,130,255,.95);vertical-align:text-bottom;
      margin-left:1px;animation:kp_blink .7s step-end infinite;
    `;

    let cancelled = false;

    async function run() {
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return;
        const toks = LINES[i];

        // Build row
        const row = document.createElement("div");
        row.style.cssText = "display:flex;";
        const gutter = document.createElement("span");
        gutter.textContent = String(i + 1);
        gutter.style.cssText = `
          min-width:24px;color:rgba(255,255,255,.11);user-select:none;
          font-size:.85em;padding-right:20px;text-align:right;padding-top:.06em;
        `;
        const content = document.createElement("span");
        content.style.flex = "1";
        row.appendChild(gutter);
        row.appendChild(content);
        ca.appendChild(row);
        content.appendChild(cursor);

        if (toks.length === 1 && toks[0].t === "") {
          await sleep(20);
          continue;
        }

        for (const tok of toks) {
          if (cancelled) return;
          const span = document.createElement("span");
          span.style.color     = COLOR[tok.c];
          span.style.fontStyle = FONT_STYLE[tok.c] ?? "normal";
          if (tok.c === "name-hi") {
            span.style.fontWeight  = "700";
            span.style.textShadow  = "0 0 18px rgba(170,130,255,.85),0 0 38px rgba(160,100,255,.4)";
          }
          content.insertBefore(span, cursor);

          for (const ch of tok.t) {
            if (cancelled) return;
            span.textContent += ch;
            doneRef.current++;
            updateProgress();
            const d =
              ch === " " ? 4 :
              /[{};:,()]/.test(ch) ? 14 :
              /["']/.test(ch) ? 10 :
              3 + Math.random() * 6;
            await sleep(d);
          }
        }

        const isName = toks.some(t => t.c === "name-hi");
        const isLast = i === LINES.length - 1;
        await sleep(isName ? 200 : isLast ? 350 : i % 5 === 0 ? 15 : 3);
      }

      cursor.remove();
      await sleep(300);
      if (!cancelled) onComplete?.();
    }

    run();
    return () => { cancelled = true; cursor.remove(); };
  }, [onComplete, updateProgress]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Inter:wght@300;400;600&display=swap');
        @keyframes kp_blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes kp_sdot   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes kp_termOut{ 0%{opacity:1;transform:scale(1) translateY(0)} 100%{opacity:0;transform:scale(.96) translateY(-10px)} }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:`
          radial-gradient(ellipse 60% 50% at 20% 30%, rgba(99,68,200,.14) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 70%, rgba(160,100,240,.10) 0%, transparent 70%),
          radial-gradient(ellipse 40% 35% at 50% 100%, rgba(80,140,255,.07) 0%, transparent 70%)
        `,
      }}/>

      {/* Grain */}
      <div style={{
        position:"fixed",inset:0,zIndex:1,pointerEvents:"none",opacity:.04,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"160px",
      }}/>

      {/* Terminal */}
      <div style={{
        position:"fixed",inset:0,zIndex:10,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        <div style={{
          width:"min(700px,93vw)",
          background:"rgba(10,10,18,.94)",
          border:"1px solid rgba(255,255,255,.07)",
          borderRadius:12,
          boxShadow:"0 0 0 1px rgba(120,80,255,.08),0 32px 80px rgba(0,0,0,.75),0 0 60px rgba(99,68,200,.1),inset 0 1px 0 rgba(255,255,255,.04)",
          overflow:"hidden",
        }}>
          {/* Title bar */}
          <div style={{
            display:"flex",alignItems:"center",gap:8,padding:"13px 16px",
            background:"rgba(255,255,255,.028)",
            borderBottom:"1px solid rgba(255,255,255,.05)",
          }}>
            {[["#ff5f57"],["#febc2e"],["#28c840"]].map(([bg],i)=>(
              <div key={i} style={{width:12,height:12,borderRadius:"50%",background:bg}}/>
            ))}
            <div style={{
              marginLeft:8,fontFamily:"'JetBrains Mono',monospace",
              fontSize:11,color:"rgba(255,255,255,.28)",letterSpacing:".04em",
            }}>
              portfolio.ts &nbsp;—&nbsp; Koustav Paul
            </div>
          </div>

          {/* Code area */}
          <div
            ref={caRef}
            style={{
              padding:"22px 28px 24px",
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:"clamp(11px,1.5vw,13px)",
              lineHeight:1.85,
              minHeight:300,
              maxHeight:"72vh",
              overflow:"hidden",
            }}
          />

          {/* Bottom bar */}
          <div style={{
            display:"flex",alignItems:"center",gap:12,padding:"10px 16px",
            background:"rgba(255,255,255,.02)",
            borderTop:"1px solid rgba(255,255,255,.05)",
          }}>
            <div style={{
              width:7,height:7,borderRadius:"50%",background:"#28c840",
              boxShadow:"0 0 6px rgba(40,200,64,.7)",
              animation:"kp_sdot 1.5s ease-in-out infinite",
            }}/>
            <div style={{flex:1,height:2,background:"rgba(255,255,255,.07)",borderRadius:99,overflow:"hidden"}}>
              <div ref={pfRef} style={{
                height:"100%",
                background:"linear-gradient(90deg,#5c44c8,#9060e8,#c586c0)",
                borderRadius:99,width:"0%",
                transition:"width .1s linear",
                boxShadow:"0 0 8px rgba(150,90,240,.6)",
              }}/>
            </div>
            <span ref={stRef} style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:10,
              color:"rgba(255,255,255,.22)",letterSpacing:".04em",
              minWidth:34,textAlign:"right",
            }}>0%</span>
          </div>
        </div>
      </div>
    </>
  );
}

/*
  USAGE in your App.tsx:

  import { useState } from "react";
  import TerminalLoader from "./TerminalLoader";

  export default function App() {
    const [loaded, setLoaded] = useState(false);

    if (!loaded) {
      return (
        <div style={{ background: "#0d0d14", width: "100vw", height: "100vh" }}>
          <TerminalLoader onComplete={() => setLoaded(true)} />
        </div>
      );
    }

    return <YourPortfolio />;
  }
*/