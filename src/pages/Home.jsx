import React, { useState, useCallback, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";
import HistorySidebar from "../components/home/HistorySidebar";
import GeneratorPanel from "../components/home/GeneratorPanel";
import WorkspacePanel from "../components/home/WorkspacePanel";
import FullscreenPreviewModal from "../components/home/FullscreenPreviewModal";

// Moved outside component to avoid re-creation on every render
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });

const FRAMEWORK_OPTIONS = [
  { value: "html-css", label: "HTML + CSS" },
  { value: "html-tailwind", label: "HTML + Tailwind CSS" },
  { value: "html-bootstrap", label: "HTML + Bootstrap" },
  { value: "html-css-js", label: "HTML + CSS + JS" },
  { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  { value: "react", label: "React (JSX)" },
  { value: "react-ts", label: "React (TypeScript)" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
];

const PROMPT_TEMPLATES = [
  "Login form with validation",
  "Pricing card with toggle",
  "Hero section with CTA",
  "Dashboard sidebar nav",
  "Testimonial carousel",
  "Product card grid",
  "Animated loading spinner",
  "Dark mode toggle button",
  "Notification dropdown",
  "Stats dashboard widget",
];

const Home = () => {
  const getLanguage = (framework) => {
    if (framework === "react-ts") return "typescriptreact";
    if (framework.startsWith("react")) return "javascript";
    return "html";
  };

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [frameWork, setFrameWork] = useState(FRAMEWORK_OPTIONS[0]);
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [refineLoading, setRefineLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewSize, setPreviewSize] = useState("desktop");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uibuilder-history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewCode(code);
    }, 220);
    return () => clearTimeout(timer);
  }, [code]);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const saveToHistory = useCallback((generatedCode, promptText, fw) => {
    const entry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      prompt: promptText,
      framework: fw.label,
      frameworkValue: fw.value,
      code: generatedCode,
      timestamp: new Date().toLocaleString(),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem("uibuilder-history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const buildPrompt = (userPrompt, fw) => {
    if (fw.value.startsWith("react")) {
      const isTS = fw.value === "react-ts";
      return `You are an experienced React developer. Create a modern, responsive React component${isTS ? " in TypeScript" : ""}.

Component description: ${userPrompt}
Framework: React${isTS ? " with TypeScript" : ""}

Requirements:
- Use functional components with React hooks (useState, useEffect, etc.).
- Include modern styling using Tailwind CSS classes.
- Make it responsive and animated.
- Do NOT use external libraries other than React — no framer-motion, lucide-react, @heroicons, react-icons, react-router, axios, or any other npm package.
- Do NOT include any import statements in your output.
- Do NOT add export statements; just define the component function directly.
${isTS ? `- Use TypeScript types inline. Use the following types if needed: FC, ReactNode, ChangeEvent<HTMLInputElement>, MouseEvent<HTMLButtonElement>, KeyboardEvent<HTMLInputElement>, FormEvent<HTMLFormElement>, CSSProperties.
- Do NOT use React.FC — use plain function syntax: function MyComponent(): JSX.Element { ... }
- Do NOT import types from 'react' — they are available globally.
- Type annotations are optional if they create issues — plain JS-compatible syntax is fine.` : ""}
- Return ONLY the component function code, wrapped in a Markdown fenced code block.
- The component MUST have a clear name starting with a capital letter (e.g. function LoginForm() {...}).
- Do NOT include imports, exports, explanations, comments, or anything else.`;
    }
    if (fw.value === "vue") {
      return `You are an experienced Vue.js developer. Create a modern, responsive Vue 3 UI.

Component description: ${userPrompt}

Requirements:
    - Return a complete single HTML file that runs directly in a browser iframe.
    - Use Vue 3 from CDN (global build) and mount with Vue.createApp(...).mount('#app').
    - Include all CSS and JS in this one file.
- Make it responsive and animated.
    - Return ONLY code wrapped in Markdown fenced code blocks.
- Do NOT include explanations or anything else.`;
    }
    if (fw.value === "svelte") {
      return `You are an experienced frontend developer. Create a modern, responsive UI inspired by Svelte design patterns.

Component description: ${userPrompt}

Requirements:
    - Return a complete single HTML file that runs directly in a browser iframe.
    - Include all CSS and JS in this one file.
    - Do not require any build tools or npm packages.
- Make it responsive and animated.
    - Return ONLY code wrapped in Markdown fenced code blocks.
- Do NOT include explanations or anything else.`;
    }
    return `You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components.

Now, generate a UI component for: ${userPrompt}
Framework to use: ${fw.value}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in Markdown fenced code blocks.
- Do NOT include explanations, text, comments, or anything else besides the code.
- Give the whole code in a single HTML file.`;
  };

  function handleAIError(error, retryCount, maxRetries, retryFn) {
    console.error("AI Error:", error);
    let errorMessage = "Something went wrong while generating code.";
    if (error.message?.includes("API_KEY_INVALID")) errorMessage = "Invalid API key. Please check your environment variables.";
    else if (error.message?.includes("QUOTA_EXCEEDED")) errorMessage = "API quota exceeded. Please try again later.";
    else if (error.message?.includes("NETWORK_ERROR") || error.code === "NETWORK_ERROR") errorMessage = "Network error. Please check your internet connection.";
    else if (error.message) errorMessage = error.message;

    if (retryFn && retryCount < maxRetries && (error.code === "NETWORK_ERROR" || error.message?.includes("quota"))) {
      toast.info(`Retrying... (${retryCount + 1}/${maxRetries})`);
      setTimeout(retryFn, 2000 * (retryCount + 1));
      return;
    }
    toast.error(errorMessage);
  }

  async function getResponse(retryCount = 0) {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      return toast.error("Missing VITE_GOOGLE_AI_API_KEY in .env");
    }
    if (!prompt.trim()) return toast.error("Please describe your component first");
    const maxRetries = 3;
    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildPrompt(prompt, frameWork),
      });
      const extractedCode = extractCode(response.text);
      if (!extractedCode.trim()) throw new Error("No valid code was generated. Please try rephrasing your prompt.");
      setCode(extractedCode);
      setPreviewCode(extractedCode);
      setOutputScreen(true);
      setRefreshKey((k) => k + 1);
      saveToHistory(extractedCode, prompt, frameWork);
      toast.success("Component generated successfully!");
    } catch (error) {
      handleAIError(error, retryCount, maxRetries, () => getResponse(retryCount + 1));
    } finally {
      setLoading(false);
    }
  }

  async function refineComponent() {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      return toast.error("Missing VITE_GOOGLE_AI_API_KEY in .env");
    }
    if (!refinePrompt.trim()) return toast.error("Please describe what to change");
    if (!code.trim()) return toast.error("Generate a component first");
    try {
      setRefineLoading(true);
      const refineContent = `You are an experienced developer. Here is an existing UI component:
\`\`\`
${code}
\`\`\`

The user wants to refine it: "${refinePrompt}"

Requirements:
- Apply the requested changes to the existing component.
- Keep all existing functionality unless explicitly changed.
- Return ONLY the updated complete code in Markdown fenced code blocks.
- Do NOT include explanations or comments.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: refineContent,
      });
      const extractedCode = extractCode(response.text);
      if (!extractedCode.trim()) throw new Error("No valid code was generated.");
      setCode(extractedCode);
      setPreviewCode(extractedCode);
      setRefreshKey((k) => k + 1);
      saveToHistory(extractedCode, `[Refined] ${refinePrompt}`, frameWork);
      setRefinePrompt("");
      toast.success("Component refined!");
    } catch (error) {
      handleAIError(error, 0, 0, null);
    } finally {
      setRefineLoading(false);
    }
  }

  async function enhanceComponent() {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      return toast.error("Missing VITE_GOOGLE_AI_API_KEY in .env");
    }
    if (!code.trim()) return toast.error("Generate a component first");
    try {
      setEnhanceLoading(true);
      const enhanceContent = `You are an expert UI/UX developer. Here is an existing UI component:
\`\`\`
${code}
\`\`\`

Enhance this component:
- Improve visual design: better colors, gradients, shadows, spacing.
- Add smooth animations and micro-interactions.
- Improve responsiveness and typography.
- Add polish: hover states, transitions, and modern aesthetics.
- Return ONLY the enhanced complete code in Markdown fenced code blocks.
- Do NOT include explanations or comments.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: enhanceContent,
      });
      const extractedCode = extractCode(response.text);
      if (!extractedCode.trim()) throw new Error("No valid code was generated.");
      setCode(extractedCode);
      setPreviewCode(extractedCode);
      setRefreshKey((k) => k + 1);
      saveToHistory(extractedCode, `[Enhanced] ${prompt}`, frameWork);
      toast.success("Component enhanced!");
    } catch (error) {
      handleAIError(error, 0, 0, null);
    } finally {
      setEnhanceLoading(false);
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getReactPreviewSrcDoc = (reactCode, isTypeScript = false) => {
    // ── 1. Detect the top-level component name ──────────────────────────────
    let componentName = "App";
    const exportDefaultFuncMatch = reactCode.match(/export\s+default\s+function\s+([A-Z]\w*)/);
    const exportDefaultVarMatch  = reactCode.match(/export\s+default\s+([A-Z]\w*)\s*;?\s*$/m);
    const funcMatch              = reactCode.match(/(?:^|\n)(?:function|const|class)\s+([A-Z]\w*)/m);
    if (exportDefaultFuncMatch) componentName = exportDefaultFuncMatch[1];
    else if (exportDefaultVarMatch) componentName = exportDefaultVarMatch[1];
    else if (funcMatch) componentName = funcMatch[1];

    // ── 2. Strip imports, exports, and TypeScript-only declarations ──────────
    let processedCode = reactCode
      // import … from '…' (single and multiline)
      .replace(/^import\s+type\s+[\s\S]*?from\s+['"].*?['"]\s*;?\s*$/gm, "")
      .replace(/^import\s+[\s\S]*?from\s+['"].*?['"]\s*;?\s*$/gm, "")
      .replace(/^import\s+['"].*?['"]\s*;?\s*$/gm, "")
      // export default function Foo → function Foo
      .replace(/export\s+default\s+function\s+([A-Z]\w*)/, "function $1")
      // export default Foo; (standalone re-export)
      .replace(/^export\s+default\s+([A-Z]\w*)\s*;?\s*$/gm, "");

    // anonymous export default → const App = …
    if (/export\s+default\s+/.test(processedCode)) {
      processedCode = processedCode.replace(/export\s+default\s+/, "const App = ");
      componentName = "App";
    }

    // strip remaining named exports (export const/function/class at top level)
    processedCode = processedCode.replace(/^export\s+(const|let|var|function|class)\s+/gm, "$1 ");

    // strip TypeScript-only top-level declarations so they don't confuse Babel
    if (isTypeScript) {
      processedCode = processedCode
        // interface Foo { … }
        .replace(/^(export\s+)?(declare\s+)?interface\s+\w[\w\s,<>]*\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}/gm, "")
        // type Foo = … ;
        .replace(/^(export\s+)?(declare\s+)?type\s+\w+\s*(<[^>]*>)?\s*=[^;]+;/gm, "")
        // declare keyword (ambient declarations)
        .replace(/^declare\s+.*/gm, "");
    }

    const encodedSource   = JSON.stringify(processedCode);
    const encodedCompName = JSON.stringify(componentName);
    const tsFlag          = isTypeScript ? "true" : "false";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: sans-serif; }
    #root { min-height: 100vh; }
    .preview-error { padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background: #0f172a; color: #f8fafc; min-height: 100vh; box-sizing: border-box; }
    .preview-error h3 { margin: 0 0 10px; color: #fda4af; font-size: 14px; }
    .preview-error pre { white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.6; color: #e2e8f0; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    var sourceCode    = ${encodedSource};
    var isTypeScript  = ${tsFlag};
    var componentName = ${encodedCompName};

    function showError(err) {
      var msg = (err && err.stack) ? err.stack : String(err);
      document.getElementById('root').innerHTML =
        '<div class="preview-error"><h3>\\u26a0\\ufe0f Preview Error</h3><pre>' +
        msg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
        '</pre></div>';
    }

    function runCompiled(compiled) {
      var HOOKS = 'const { useState, useEffect, useCallback, useRef, useMemo, ' +
                  'useContext, useReducer, useId, useLayoutEffect, createContext, ' +
                  'Fragment, memo, forwardRef, cloneElement, createElement, Children, ' +
                  'StrictMode, Suspense } = React;\\n';
      var CHECK = '\\nvar _c = (typeof ' + componentName + ' !== "undefined") ? ' + componentName +
                  ' : null;\\n' +
                  'if (!_c) throw new Error("Component ' + componentName + ' not found in generated code.");\\n' +
                  'ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(_c));';
      var fn = new Function('React', 'ReactDOM', 'showError', HOOKS + compiled + CHECK);
      fn(React, ReactDOM, showError);
    }

    try {
      if (isTypeScript) {
        // Two-stage: (1) strip TS types → (2) transform JSX
        // This is more reliable than a single combined pass.
        try {
          var stripped = Babel.transform(sourceCode, {
            filename: 'component.tsx',
            presets: [['typescript', { isTSX: true, allExtensions: true }]]
          }).code;
          var compiled = Babel.transform(stripped, {
            filename: 'component.jsx',
            presets: ['react']
          }).code;
          runCompiled(compiled);
        } catch (twoStageErr) {
          // Fallback: single-stage combined (some Babel versions prefer this)
          var compiled2 = Babel.transform(sourceCode, {
            filename: 'component.tsx',
            presets: ['react', ['typescript', { isTSX: true, allExtensions: true }]]
          }).code;
          runCompiled(compiled2);
        }
      } else {
        var compiledJs = Babel.transform(sourceCode, {
          filename: 'component.jsx',
          presets: ['react']
        }).code;
        runCompiled(compiledJs);
      }
    } catch (e) {
      showError(e);
    }
  </script>
</body>
</html>`;
  };

  const getPreviewSrcDoc = useMemo(() => {
    if (frameWork.value.startsWith("react")) return getReactPreviewSrcDoc(previewCode, frameWork.value === "react-ts");
    return previewCode;
  }, [frameWork.value, previewCode]);

  const getPreviewWidth = () => {
    if (previewSize === "mobile") return "375px";
    if (previewSize === "tablet") return "768px";
    return "100%";
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    let fileName, mimeType;
    if (frameWork.value === "react-ts") { fileName = "Component.tsx"; mimeType = "text/javascript"; }
    else if (frameWork.value.startsWith("react")) { fileName = "Component.jsx"; mimeType = "text/javascript"; }
    else if (frameWork.value === "vue") { fileName = "Component-vue.html"; mimeType = "text/html"; }
    else if (frameWork.value === "svelte") { fileName = "Component-svelte.html"; mimeType = "text/html"; }
    else { fileName = "Component.html"; mimeType = "text/html"; }
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const loadFromHistory = (entry) => {
    const fw = FRAMEWORK_OPTIONS.find((o) => o.value === entry.frameworkValue) || FRAMEWORK_OPTIONS[0];
    setFrameWork(fw);
    setCode(entry.code);
    setPreviewCode(entry.code);
    setPrompt(entry.prompt.replace(/^\[(Refined|Enhanced)\] /, ""));
    setOutputScreen(true);
    setRefreshKey((k) => k + 1);
    setShowHistory(false);
    toast.success("Loaded from history");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("uibuilder-history");
    toast.success("History cleared");
  };

  const deleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("uibuilder-history", JSON.stringify(updated));
      return updated;
    });
    toast.success("History item removed");
  };

  return (
    <>
      <Navbar
        historyCount={history.length}
        onHistoryClick={() => setShowHistory(true)}
      />

      <HistorySidebar
        show={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onClearAll={clearHistory}
        onLoad={loadFromHistory}
        onDeleteItem={deleteHistoryItem}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 pb-10">

        <GeneratorPanel
          promptTemplates={PROMPT_TEMPLATES}
          prompt={prompt}
          setPrompt={setPrompt}
          frameWork={frameWork}
          frameworkOptions={FRAMEWORK_OPTIONS}
          setFrameWork={setFrameWork}
          loading={loading}
          onGenerate={getResponse}
          outputScreen={outputScreen}
          refinePrompt={refinePrompt}
          setRefinePrompt={setRefinePrompt}
          refineLoading={refineLoading}
          onRefine={refineComponent}
        />

        <WorkspacePanel
          outputScreen={outputScreen}
          tab={tab}
          setTab={setTab}
          code={code}
          setCode={setCode}
          getLanguage={getLanguage}
          frameWorkValue={frameWork.value}
          previewSize={previewSize}
          setPreviewSize={setPreviewSize}
          onOpenFullscreen={() => setIsNewTabOpen(true)}
          onRefreshPreview={() => setRefreshKey((prev) => prev + 1)}
          refreshKey={refreshKey}
          previewSrcDoc={getPreviewSrcDoc}
          previewWidth={getPreviewWidth()}
          onCopy={copyCode}
          onDownload={downloadFile}
          onEnhance={enhanceComponent}
          enhanceLoading={enhanceLoading}
        />
      </div>

      <FullscreenPreviewModal
        show={isNewTabOpen}
        onClose={() => setIsNewTabOpen(false)}
        previewSize={previewSize}
        setPreviewSize={setPreviewSize}
        previewSrcDoc={getPreviewSrcDoc}
        previewWidth={getPreviewWidth()}
      />
    </>
  );
};

export default Home;
