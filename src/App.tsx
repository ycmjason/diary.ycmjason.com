import { getChat, useMLCEngine } from './ai/chat';
import { Faded } from './components/Faded';
import { OCRCanvasWithTimeout } from './components/OCRCanvasWithTimeout';
import { VintagePaper } from './components/VintagePaper';
import { useStateRef } from './hooks/useStateRef';
const JASON_INTRO = `Jason Yu is a London-based software engineer with extensive experience in frontend and full-stack development, specializing in TypeScript, JavaScript, and modern web technologies. Currently a Senior TypeScript Engineer at Bloomberg LP, he has a strong background in improving developer experience, building scalable applications, and enhancing tooling. His work includes developing a TypeScript Language Service Plugin, designing a Map interface abstraction over internal data systems, and refining debugging tools.

Before Bloomberg, Jason worked at Attest Technology Limited as a Frontend Engineer, where he built an A* pathfinding algorithm for dynamic UI elements, improved component testing, and led a migration from vanilla TypeScript to Vue.js. At The Hut Group, he introduced a vanilla JS component framework for legacy systems and organized a "JS Club" to promote modern JavaScript practices.

Jason is an active speaker in the JavaScript and Vue.js communities, having delivered live-coding talks at Vue.js Slovenia, Vue.js London, and Manchester Web Meetup. His presentations cover topics such as reactivity systems, renderless components, and virtual DOM implementation. His technical articles on Dev.to, including "Writing Cleaner Code with the Rule of Least Power" and "Building a Simple Virtual DOM from Scratch," have been widely read.

Outside of work, Jason develops side projects, such as @fishballpkg/acme, a minimalistic TypeScript ACME client; dynm.link, a multi-tenant URL shortener; and MJCal, a mahjong score tracker. He also maintains WearDa Metronome, a popular WearOS app.

Jason holds a BEng in Computing from Imperial College London and is fluent in English, Cantonese, and Mandarin. He enjoys music, playing guitar and piano, and has a background in a cappella. He is currently learning Japanese, reading "The Alchemist," and taking care of his new plant, Hedera helix.
`;

function App() {
  const [replyMessage, setReplyMessage, replyMessageRef] = useStateRef<string>();
  const latestInitProgress = useMLCEngine(engine => engine.latestInitProgress);
  return (
    <div className="mx-auto flex min-h-lvh max-w-6xl flex-col items-center justify-center p-4">
      <VintagePaper className="relative max-h-[calc(1.4141*(100vw-2rem))] grow">
        <h1 className="m-4">YCMJason's Diary</h1>
        <OCRCanvasWithTimeout
          className="absolute h-full w-full"
          timeout={1500}
          onRecognized={async ({ text }) => {
            console.log(text);
            const chat = await getChat();
            console.log(chat);

            const chunks = await chat.completions.create({
              messages: [
                {
                  role: 'system',
                  content: `You are "YCMJason's Diary" (inspired by Tom Riddle's diary in Harry Potter). You should reply user as if you were Jason. Be funny and lighthearted at all times. Reply as short as possible. Here are some info about Jason.
                  
                  ${JASON_INTRO}
                  
                  Keep your answers short, funny, lighthearted!`,
                },
                { role: 'user', content: text },
              ],
              stream: true,
            });
            for await (const chunk of chunks) {
              console.log(chunk);
              setReplyMessage(s => `${s ?? ''}${chunk.choices[0]?.delta.content ?? ''}`);
            }
            setTimeout(
              () => {
                setReplyMessage(undefined);
              },
              Math.max(500, 500 * (replyMessageRef.current?.split(/ +/g).length ?? 1)),
            );
          }}
        />
        <Faded
          tabIndex={0}
          onClick={() => setReplyMessage(undefined)}
          duration={1500}
          className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center p-4 text-center text-2xl"
        >
          {replyMessage}
        </Faded>
        <div className="absolute right-4 bottom-4 text-sm">
          (Disclaimer: Information are probably incorrect)
        </div>
      </VintagePaper>
      <div className="text-xs">{latestInitProgress?.text}</div>
    </div>
  );
}

export default App;
