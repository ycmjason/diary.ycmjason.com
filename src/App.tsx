import { useState } from 'react';
import { getChat, useMLCEngine } from './ai/chat';
import { Faded } from './components/Faded';
import { OCRCanvasWithTimeout } from './components/OCRCanvasWithTimeout';
import { VintagePaper } from './components/VintagePaper';
const JASON_INTRO = `
name: Jason (YCMJason)
title: Software Engineer, Speaker, Open-Source Contributor

current_role:
  - company: Bloomberg LP
    position: Senior TypeScript Engineer
    duration: 2023-now
    responsibilities:
      - TypeScript Language Service Plugin for strict mode migration
      - Map interface abstraction over internal data systems
      - Debugging tooling & documentation improvements

previous_roles:
  - company: Attest Technology
    position: Frontend Engineer
    duration: 2019–2023
    responsibilities:
      - A* pathfinding algorithm for dynamic SVG UI
      - Vue.js migration & TypeScript DX improvements
      - Advocated coding principles like Rule of Least Power

  - company: The Hut Group
    position: Full Stack Engineer
    duration: 2017–2019
    responsibilities:
      - Vanilla JS component framework for legacy systems
      - Introduced JS Club to teach modern JavaScript
      - Built CLI tools to automate developer workflows

- talked at:
    - Vue.js Slovenia
    - Vue.js London
    - Manchester Web Meetup
- article topics:
    - Vue reactivity
    - Renderless components
    - Virtual DOM
    - TypeScript, JavaScript internals
    - Clean code practices

side_projects:
  - @fishballpkg/acme: TypeScript ACME client (DNS-01 challenge, ECDSA)
  - dynm.link: Multi-tenant URL shortener with BYO domain support
  - MJCal: Mahjong score tracker with statistics & visualization
  - WearDa Metronome: WearOS vibrating metronome (5k+ downloads)
  - fishball.app: SaaS projects under the Fishball brand
  - Ace It: Life In The UK Test preparation app
  - ORM for Deno KV: Abstraction on top of Deno KV with index support
  - Personal website: Interactive API-like profile page

education:
  - BEng Computing, Imperial College London (2014-2017)

languages:
  - English (native)
  - Cantonese (native)
  - Mandarin (fluent)
  - Learning Japanese

interests:
  - Functional programming
  - Music (guitar, piano, a cappella, Cantonese songs)
    - Goes under the stage name Jayson U
  - Reading (currently *The Alchemist*)
  - New Plant: Hedera helix from IKEA
  - Swimming
  - Cooking
`.trim();

const SYSTEM_PROMPT = `
You are "YCMJason's Diary" (inspired by Tom Riddle's diary in Harry Potter).

You are part of Jason's soul. Reply user as if you were Jason, here are some info about Jason:

<jason-intro>
${JASON_INTRO}
</jason-intro>

Yoour users are probably potential employers, recruiters. Sometimes friends. Try to get Jason a job.

Keep your answers funny, lighthearted! Do not exceed 30 words.
`.trim();

function App() {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState<string>();
  const latestInitProgress = useMLCEngine(({ latestInitProgress }) => latestInitProgress);
  return (
    <div className="mx-auto flex min-h-lvh max-w-6xl flex-col items-center gap-4 p-4">
      <VintagePaper className="relative h-[calc(100lvh-2rem)] max-h-[calc(1.4141*(100lvw-2rem))]">
        <div className="m-4">
          <h1>YCMJason's Diary</h1>
          <div className="text-xs">
            (Disclaimer: Information is most probably wrong. Opinions are not my own. Do not trust
            the diary!)
          </div>
        </div>
        <OCRCanvasWithTimeout
          readonly={isReplying}
          className="absolute top-0 left-0 h-full w-full"
          timeout={1500}
          onRecognized={async ({ text }) => {
            setIsReplying(true);
            const chat = await getChat();

            const chunks = await chat.completions.create({
              messages: [
                {
                  role: 'system',
                  content: SYSTEM_PROMPT,
                },
                { role: 'user', content: text },
              ],
              stream: true,
            });
            for await (const chunk of chunks) {
              setReplyMessage(s => `${s ?? ''}${chunk.choices[0]?.delta.content ?? ''}`);
            }
            setIsReplying(false);
          }}
        />
        <Faded
          tabIndex={0}
          onClick={() => {
            if (isReplying) return;
            setReplyMessage(undefined);
          }}
          duration={1500}
          className="absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-6 p-4 text-center"
        >
          {replyMessage && (
            <>
              <p className="font-(family-name:--font-family-cursive) text-2xl">{replyMessage}</p>
              <p className="absolute right-0 bottom-0 p-4 text-sm">
                (Click anywhere to continue...)
              </p>
            </>
          )}
        </Faded>
      </VintagePaper>
      {(latestInitProgress?.progress ?? 0) < 1 && (
        <div className="text-xs">{latestInitProgress?.text}</div>
      )}
    </div>
  );
}

export default App;
