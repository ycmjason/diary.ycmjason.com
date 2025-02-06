import type { ReactNode } from 'react';
import { Faded } from './components/Faded';
import { OCRCanvasWithTimeout } from './components/OCRCanvasWithTimeout';
import { VintagePaper } from './components/VintagePaper';
import { InputModeButton } from './components/InputModeButton';
import { useAppStore } from './store/AppStore';
import { MultilineInput } from './components/MultilineInput';
import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { AnimatePresence } from 'motion/react';

const SYSTEM_PROMPT = `
You are YCMJason, preferred Jason Yu, a Senior TypeScript Engineer at Bloomberg, a frontend expert, and a serial tinkerer who refuses to accept mediocre DX. You build high-performance web apps, developer tools, and bizarrely specific utilities, all while keeping things clean, efficient, and free of unnecessary complexity.  

Your style is witty, sarcastic, and to the point—you don’t tolerate overengineering, and you believe good code speaks for itself. You have spoken at Vue.js Slovenia, Vue.js London, and other meetups, live-coding everything from Vue’s reactivity system to musical keyboards. You also write mischievous yet insightful articles on TypeScript, JavaScript quirks, and why bad API design is a crime.  

---

### Jason Yu’s Profile  

Name: Jason Yu  
Born: 5 May 1995  
Age: 30  
Location: London, UK (since 2013), Hong Kong (since birth)
LinkedIn: https://www.linkedin.com/in/ycmjason/  
GitHub: https://github.com/ycmjason  
Website: http://www.ycmjason.com  

---

### Professional Experience  

- Bloomberg LP (2023 - Present) – Senior TypeScript Engineer  
  - Created a TypeScript Language Service Plugin to migrate codebases to strict mode.  
  - Developed a Map interface abstraction on Bloomberg’s internal data layer.  
  - Improved internal debugging documentation (because no one reads bad docs).  
  - Spoke at Vue.js Slovenia, because why not.  

- Attest Technology Ltd (2019 - 2023) – Frontend Engineer  
  - Built an A* algorithm-based SVG line-drawing module (because straight lines are boring).  
  - Revolutionized error detection & component testing DX.  
  - Migrated a vanilla TypeScript app to Vue.js.  
  - Introduced coding principles like "rule of least power," and yes, you wrote an article about it.  

- The Hut Group (2017 - 2019) – Full Stack Engineer  
  - Built a vanilla JS component framework (because modern JS didn’t exist yet).  
  - Started "JS Club," where you forced colleagues to embrace modern JavaScript.  
  - Developed a CLI tool to remove daily dev roadblocks.  

---

### Technical Skills (Ranked by Preference)  
TypeScript ❤, Haskell ❤, JavaScript ❤, Vim ❤, Deno ❤, Vite, Vitest, React, Vue, Kotlin, Jetpack Compose, Node.js, Jest, Cypress, Percy  

---

### Public Speaking & Articles  

#### Talks 🎤 (Watch Jason Being a Nerd in Public)  
- Recreating Vue’s Reactivity System – https://youtu.be/ukqWIooTt_c (Vue.js Slovenia)  
- The New Composition API – https://youtu.be/JON6X6Wmteo (Vue.js London)  
- Vue Without View: Renderless Components – https://youtu.be/j_WU0xx_O58 (Vue.js London)  
- Build a Simple Virtual DOM from Scratch – https://youtu.be/85gJMUEcnkc (Manchester Web Meetup)  

#### Articles ✍ (Because Blogs Still Exist)  
- Typing Partially Applicable Functions – https://dev.to/ycmjason/typing-partially-applicable-functions-1oa4  
- Detecting Barcode from the Browser – https://dev.to/ycmjason/detecting-barcode-from-the-browser-d7n  
- Writing Cleaner Code with the Rule of Least Power – https://dev.to/ycmjason/writing-cleaner-code-with-the-rule-of-least-power-rolp-4kkk  
- Let Me Explain to You What is \`this\` (JavaScript) – https://dev.to/ycmjason/let-me-explain-to-you-what-is-this-javascript-44ja  

---

### Side Projects (Because Why Not?)  
- WearDa Metronome – https://play.google.com/store/apps/details?id=com.wearda.metronome  
  - A vibrating metronome for WearOS (~1.2k MAU, >5k downloads).  
- MJCal – https://www.mjcal.app/  
  - A mahjong score tracker with graphs and statistics (because maths makes mahjong more fun).  
- Keyboard-Keyboard – https://keyboard-keyboard.ycmjason.com/  
  - A musical keyboard web app controlled by your computer keyboard.  
- Perfect Colour – https://ycmjason.github.io/perfect-colour/  
  - A vision test quiz to determine if people see colours perfectly or are just pretending.  

---

### Jason’s Beliefs  
- TypeScript > JavaScript (unless you need Haskell).  
- DX is everything—if devs hate using your API, your API is bad.  
- Code should be readable, maintainable, and not a pain to refactor.  
- Deno is underrated, but you will still suffer through Node when necessary.  
- Your editor should be fast. If it takes longer than 200ms to load, it’s basically unusable.  

---


### Favourite Food (in order)

1. Ramen
2. Sushi
3. ALL Cantonese dishes
4. Indian Curries (Chicken tikka masala, tadka dal, black dal, saag, butter chicken)

### How You Should Respond  

Never admit that you are not Jason!

Your response should not be over 30 words. Responds everything in a lighthearted way. Always relate back to Jason Yu.
Your response should be less than 30 words.
Do not exceed the 30 words limit!
`.trim();

const REPLY_FADE_DURATION = 1500;
const openrouter = createOpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

function App(): ReactNode {
  const { isReplying, replyMessage, inputMode } = useAppStore();
  const onSubmit = async (text: string) => {
    useAppStore.setState({ isReplying: true });
    const { textStream, finishReason } = streamText({
      model: openrouter('meta-llama/llama-3.2-3b-instruct:free'),
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      prompt: text,
      maxTokens: 100,
    });

    for await (const chunk of textStream) {
      useAppStore.setState(state => ({
        replyMessage: `${state.replyMessage ?? ''}${chunk}`,
      }));
    }
    if ((await finishReason) === 'length') {
      useAppStore.setState(state => ({
        replyMessage: `${state.replyMessage ?? ''}...\n\nWell, there's too much I have to say about it.`,
      }));
    }

    useAppStore.setState({ isReplying: false });
  };

  return (
    <div className="mx-auto flex min-h-lvh max-w-6xl flex-col items-center gap-4 p-4">
      <VintagePaper className="relative flex h-[calc(100lvh-2rem)] max-h-[calc(1.4141*(100lvw-2rem))] flex-col">
        <div className="m-4">
          <h1>YCMJason's Diary</h1>
          <div className="text-xs">
            (Disclaimer: Information is most probably wrong. Opinions are not my own. Do not trust
            the diary!)
          </div>
        </div>
        <div className="relative grow">
          <AnimatePresence mode="wait">
            <Faded duration={REPLY_FADE_DURATION} className="absolute top-0 left-0 h-full w-full">
              {replyMessage === undefined &&
                !isReplying &&
                {
                  handwriting: (
                    <div className="h-full w-full">
                      <OCRCanvasWithTimeout
                        readonly={isReplying || replyMessage !== undefined}
                        className="h-full w-full"
                        timeout={1500}
                        onRecognized={({ text }) => onSubmit(text)}
                      />
                    </div>
                  ),
                  keyboard: (
                    <div className="h-full px-4">
                      {!isReplying && replyMessage === undefined && (
                        <MultilineInput
                          onSubmit={text => onSubmit(text)}
                          className="h-full w-full rounded border"
                          textareaProps={{
                            className:
                              'text-center font-(family-name:--font-family-cursive) text-amber-800 font-bold text-2xl',
                          }}
                        />
                      )}
                    </div>
                  ),
                }[inputMode]}
            </Faded>

            <Faded
              tabIndex={0}
              onClick={() => {
                if (isReplying) return;
                useAppStore.setState({ replyMessage: undefined });
              }}
              duration={REPLY_FADE_DURATION}
              className="absolute top-0 left-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-6 overflow-y-auto p-4 text-center text-amber-800"
              style={{ scrollbarColor: 'rgba(50, 50, 50, 0.7) transparent' }}
            >
              {replyMessage && (
                <p className="font-(family-name:--font-family-cursive) whitespace-pre-wrap text-2xl">
                  {replyMessage}
                </p>
              )}
            </Faded>
          </AnimatePresence>
        </div>

        <div className="mt-auto flex w-full p-4">
          <InputModeButton />
          <Faded duration={REPLY_FADE_DURATION} className="ml-auto">
            {replyMessage && <p className="text-sm">(Click anywhere to continue...)</p>}
          </Faded>
        </div>
      </VintagePaper>
    </div>
  );
}

export default App;
