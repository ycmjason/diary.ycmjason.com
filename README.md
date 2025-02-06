# YCMJason's Diary 📖✨

This web app is inspired by Tom Riddle's Diary. I've literally enchanted this website with a piece of my soul 🪄🖤. So go ahead, talk to it, and learn more about me! 

![Tom Riddle's Diary](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHFqbmRuZmxoeWUycmV4ZHF0bjF6d2Q2eDFnZzg1dGZpZnNrcGJrcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HUpalmo5lhCs0EM/giphy.gif)

🔗 **Check it out here:** [diary.ycmjason.com](https://diary.ycmjason.com/) 🌍✨

This project had two major challenges:

1. **Recognizing handwriting** ✍️
2. **Running an LLM for free** 💸


## Recognizing Handwriting ✍️

A Tom Riddle Diary wannabe that only accepts keyboard input? Absolutely unacceptable! 😤 So I set out to implement handwriting recognition on a canvas.

### The Journey:

- **Tesseract.js 🤖**
  - Great for printed text ✅
  - Absolute trash for handwriting ❌

- **Transformers.js by 🤗 Hugging Face**
  - Looked promising...
  - Required users to download **huge models (~30s load time 😭)**
  - Recognition results? Not even close! ❌

- **The Breakthrough: Handwriting.js** 🔍
  - **BOOM!** Found this hidden gem: [handwriting.js](https://www.chenyuho.com/project/handwritingjs/) 💎
  - **How does it work?** 🤯 It **reverse-engineers Google's IME** by sending stroke data to Google's API:  
    👉 `https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8`
  - Results are **blazingly fast** ⚡ and super accurate 🎯!

👨‍🔧 But the project was **5 years old** and looked like it was built in 2003... 😬 So I ~~stole~~ borrowed the core logic and rewrote it in [**modern JavaScript**](https://github.com/ycmjason/diary.ycmjason.com/blob/main/src/handwriting/HandwritingRecognizerCanvasController.ts)! Might publish it on JSR later if there’s demand! 🚀 Let me know if you're interested! 💬

## Running an LLM for Free 💸

For the LLM, I remembered this awesome project: [mlc-webllm](https://webllm.mlc.ai/), which runs models directly on your device! 🔥

### The Journey:

- **MLC-WebLLM** ✅
  - Model download time: 🚦 **30+ seconds** (Users will leave after 5 seconds, let's be real 😅)
  - Inference speed:
    - **M1 Max MacBook:** 5 seconds ⏳
    - **Pixel 9 Pro Fold:** **30+ seconds** 🚨
  - Turns out, my **system prompt was the culprit!** 😱 Longer prompts slow down inference **a lot**.

- **Transformers.js** ❌
  - Even slower than MLC-WebLLM 😭
  - Downloads the model in a single request without batching (or so it seems 🤔)

- **The Breakthrough: OpenRouter + Vercel AI SDK** 🎯
  - Found a [GitHub list of free LLM APIs](https://github.com/cheahjs/free-llm-api-resources) 🏆
  - **Settled on OpenRouter** and paired it with **Vercel’s [AI SDK](https://sdk.vercel.ai/)**
  - **Final result?** Super smooth UX & fast responses! 🚀

🚀 **The dev experience?** Absolute **chef's kiss** 👨‍🍳👌. **Huge thanks to Vercel & OpenRouter!** 🙌

## Final Thoughts 🧠

If this app doesn’t go viral, I’ll be sad. 😢 So please, go have fun with it! 🎉

💬 **Feedback?** File an issue or ping me on [X](https://x.com/ycmjason) or [🦋](https://bsky.app/profile/ycmjason.com).

## Author 👨‍💻

**YCMJason** 🚀
