import React, { Suspense } from "react";
import { HiOutlineCode } from "react-icons/hi";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw, FiZap, FiSmartphone, FiTablet, FiMonitor } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

// Minimal React + DOM type declarations injected into Monaco so the editor
// doesn't show false "cannot find name" errors for hooks and event types.
const REACT_EXTRA_TYPES = `
declare type FC<P = {}> = (props: P) => any;
declare type FunctionComponent<P = {}> = FC<P>;
declare type ReactNode = any;
declare type ReactElement = any;
declare type Key = string | number;
declare type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null;
declare type RefObject<T> = { current: T | null };
declare type MutableRefObject<T> = { current: T };
declare type Dispatch<A> = (action: A) => void;
declare type SetStateAction<S> = S | ((prevState: S) => S);
declare type CSSProperties = { [key: string]: string | number | undefined };
declare type PropsWithChildren<P = {}> = P & { children?: ReactNode };
declare type PropsWithRef<P> = P & { ref?: Ref<any> };

declare interface ChangeEvent<T = Element> {
  target: T & EventTarget & { value: string; checked?: boolean; files?: FileList | null; name?: string; };
  currentTarget: T & EventTarget;
  preventDefault(): void;
  stopPropagation(): void;
}
declare interface MouseEvent<T = Element> {
  target: EventTarget; currentTarget: T;
  clientX: number; clientY: number; button: number;
  preventDefault(): void; stopPropagation(): void;
}
declare interface KeyboardEvent<T = Element> {
  key: string; code: string; keyCode: number;
  shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean;
  target: T; preventDefault(): void; stopPropagation(): void;
}
declare interface FormEvent<T = Element> {
  target: T; currentTarget: T; preventDefault(): void;
}
declare interface FocusEvent<T = Element> {
  target: T; currentTarget: T; relatedTarget: EventTarget | null;
}
declare interface DragEvent<T = Element> {
  dataTransfer: DataTransfer; target: T; preventDefault(): void;
}
declare interface WheelEvent<T = Element> {
  deltaX: number; deltaY: number; target: T; preventDefault(): void;
}
declare interface TouchEvent<T = Element> {
  touches: TouchList; target: T; preventDefault(): void;
}
declare interface SyntheticEvent<T = Element> {
  target: T; currentTarget: T; preventDefault(): void; stopPropagation(): void;
}

declare function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
declare function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
declare function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
declare function useLayoutEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
declare function useMemo<T>(factory: () => T, deps: readonly any[]): T;
declare function useRef<T>(initialValue: T): MutableRefObject<T>;
declare function useRef<T>(initialValue: T | null): RefObject<T>;
declare function useRef<T = undefined>(): MutableRefObject<T | undefined>;
declare function useContext<T>(context: any): T;
declare function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, Dispatch<A>];
declare function useReducer<S, A>(reducer: (state: S | undefined, action: A) => S, initialState: S | undefined): [S | undefined, Dispatch<A>];
declare function useId(): string;
declare function useImperativeHandle<T>(ref: any, init: () => T, deps?: readonly any[]): void;
declare function useDebugValue<T>(value: T, format?: (value: T) => any): void;
declare function createContext<T>(defaultValue: T): any;
declare const Fragment: any;

// JSX namespace — required for TypeScript to accept JSX syntax and HTML element names
declare namespace JSX {
  type Element = any;
  interface ElementClass { render(): any; }
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  // Wildcard: every lowercase tag is valid, with any props (including className, onClick, etc.)
  interface IntrinsicElements { [elemName: string]: any; }
  interface IntrinsicAttributes { key?: Key | null; ref?: any; }
}

declare namespace React {
  export type FC<P = {}> = (props: P) => any;
  export type FunctionComponent<P = {}> = FC<P>;
  export type ReactNode = any;
  export type ReactElement = any;
  export type CSSProperties = { [key: string]: string | number | undefined };
  export type RefObject<T> = { current: T | null };
  export type MutableRefObject<T> = { current: T };
  export type Dispatch<A> = (action: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Key = string | number;
  export type Ref<T> = RefObject<T> | ((instance: T | null) => void) | null;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export interface ChangeEvent<T = Element> {
    target: T & EventTarget & { value: string; checked?: boolean; files?: FileList | null; name?: string; };
    currentTarget: T & EventTarget; preventDefault(): void; stopPropagation(): void;
  }
  export interface MouseEvent<T = Element> {
    target: EventTarget; currentTarget: T; clientX: number; clientY: number; button: number;
    preventDefault(): void; stopPropagation(): void;
  }
  export interface KeyboardEvent<T = Element> {
    key: string; code: string; shiftKey: boolean; ctrlKey: boolean; altKey: boolean;
    target: T; preventDefault(): void; stopPropagation(): void;
  }
  export interface FormEvent<T = Element> { target: T; currentTarget: T; preventDefault(): void; }
  export interface FocusEvent<T = Element> { target: T; currentTarget: T; relatedTarget: EventTarget | null; }
  export interface SyntheticEvent<T = Element> { target: T; currentTarget: T; preventDefault(): void; stopPropagation(): void; }
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useContext<T>(context: any): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, Dispatch<A>];
  export function createContext<T>(defaultValue: T): any;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export function cloneElement(element: any, props?: any, ...children: any[]): any;
  export function memo<T extends FC<any>>(component: T): T;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;
  export function createRef<T>(): RefObject<T>;
  export function isValidElement(object: any): boolean;
  export const Fragment: any;
  export const Children: any;
  export const Suspense: any;
  export const StrictMode: any;
  export const version: string;
}

declare module 'react' {
  export = React;
  export as namespace React;
}
`;

const beforeMountHandler = (monaco) => {
  const tsDefaults = monaco.languages.typescript.typescriptDefaults;
  // Configure TypeScript compiler for React TSX browser preview
  tsDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    noEmit: true,
    strict: false,
    skipLibCheck: true,
  });
  // Only suppress module-not-found (2307) — we handle imports in preview ourselves.
  // All other type errors remain visible so the user can see real mistakes.
  tsDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    diagnosticCodesToIgnore: [2307, 2686, 7016],
  });
  // Inject React ambient declarations so hooks and event types resolve in the editor
  tsDefaults.addExtraLib(REACT_EXTRA_TYPES, "file:///react-globals.d.ts");
};

const WorkspacePanel = ({
  outputScreen,
  tab,
  setTab,
  code,
  setCode,
  getLanguage,
  frameWorkValue,
  previewSize,
  setPreviewSize,
  onOpenFullscreen,
  onRefreshPreview,
  refreshKey,
  previewSrcDoc,
  previewWidth,
  onCopy,
  onDownload,
  onEnhance,
  enhanceLoading,
}) => {
  return (
    <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
      {!outputScreen ? (
        <div className="w-full h-full flex items-center flex-col justify-center">
          <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
            <HiOutlineCode />
          </div>
          <p className="text-[16px] text-gray-400 mt-3">Your component & code will appear here.</p>
        </div>
      ) : (
        <>
          <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
            <button
              onClick={() => setTab(1)}
              className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
            >
              Code
            </button>
            <button
              onClick={() => setTab(2)}
              className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
            >
              Preview
            </button>
          </div>

          <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4">
            <p className="font-bold text-gray-200">{tab === 1 ? "Code Editor" : "Live Preview"}</p>
            <div className="flex items-center gap-2">
              {tab === 1 ? (
                <>
                  <button onClick={onCopy} title="Copy code" className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors">
                    <IoCopy size={15} />
                  </button>
                  <button onClick={onDownload} title="Download file" className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors">
                    <PiExportBold size={15} />
                  </button>
                  <button
                    onClick={onEnhance}
                    disabled={enhanceLoading}
                    title="AI Enhance"
                    className="h-9 px-3 rounded-xl border border-purple-700 flex items-center justify-center hover:bg-purple-900/50 gap-1.5 text-purple-400 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enhanceLoading ? <ClipLoader color="#a855f7" size={12} /> : <FiZap size={13} />}
                    Enhance
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPreviewSize("mobile")}
                    title="Mobile (375px)"
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${previewSize === "mobile" ? "border-purple-500 text-purple-400 bg-purple-900/30" : "border-zinc-800 hover:bg-[#333]"}`}
                  >
                    <FiSmartphone size={15} />
                  </button>
                  <button
                    onClick={() => setPreviewSize("tablet")}
                    title="Tablet (768px)"
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${previewSize === "tablet" ? "border-purple-500 text-purple-400 bg-purple-900/30" : "border-zinc-800 hover:bg-[#333]"}`}
                  >
                    <FiTablet size={15} />
                  </button>
                  <button
                    onClick={() => setPreviewSize("desktop")}
                    title="Desktop (full width)"
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${previewSize === "desktop" ? "border-purple-500 text-purple-400 bg-purple-900/30" : "border-zinc-800 hover:bg-[#333]"}`}
                  >
                    <FiMonitor size={15} />
                  </button>
                  <button onClick={onOpenFullscreen} title="Fullscreen preview" className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors">
                    <ImNewTab size={14} />
                  </button>
                  <button onClick={onRefreshPreview} title="Refresh preview" className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors">
                    <FiRefreshCcw size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="h-full">
            {tab === 1 ? (
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-sm text-gray-400">Loading editor...</div>}>
                <MonacoEditor
                  value={code}
                  onChange={(val) => { setCode(val || ""); }}
                  height="100%"
                  theme="vs-dark"
                  language={getLanguage(frameWorkValue)}
                  beforeMount={beforeMountHandler}
                  options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: "on", tabSize: 2 }}
                />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-start justify-center bg-zinc-900 overflow-auto">
                <iframe
                  key={refreshKey}
                  srcDoc={previewSrcDoc}
                  style={{ width: previewWidth, minHeight: "100%", transition: "width 0.3s ease" }}
                  className="bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspacePanel;
