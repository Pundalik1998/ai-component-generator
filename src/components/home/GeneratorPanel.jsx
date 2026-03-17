import React from "react";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { FiRefreshCcw } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const GeneratorPanel = ({
  promptTemplates,
  prompt,
  setPrompt,
  frameWork,
  frameworkOptions,
  setFrameWork,
  loading,
  onGenerate,
  outputScreen,
  refinePrompt,
  setRefinePrompt,
  refineLoading,
  onRefine,
}) => {
  return (
    <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
      <h3 className="text-[25px] font-semibold sp-text">AI Component Generator</h3>
      <p className="text-gray-400 mt-2 text-[16px]">Describe your component and let AI code it for you.</p>

      <p className="text-[13px] font-[600] text-gray-400 mt-5 mb-2">Quick Templates</p>
      <div className="flex flex-wrap gap-2">
        {promptTemplates.map((t) => (
          <button
            key={t}
            onClick={() => setPrompt(t)}
            className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-purple-700/50 text-gray-300 hover:text-white transition-all border border-zinc-700 hover:border-purple-500"
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-[15px] font-[700] mt-5">Framework</p>
      <Select
        className="mt-2"
        options={frameworkOptions}
        value={frameWork}
        styles={{
          control: (base) => ({ ...base, backgroundColor: "#111", borderColor: "#333", color: "#fff", boxShadow: "none", "&:hover": { borderColor: "#555" } }),
          menu: (base) => ({ ...base, backgroundColor: "#111", color: "#fff" }),
          option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#111", color: "#fff", "&:active": { backgroundColor: "#444" } }),
          singleValue: (base) => ({ ...base, color: "#fff" }),
          placeholder: (base) => ({ ...base, color: "#aaa" }),
          input: (base) => ({ ...base, color: "#fff" }),
        }}
        onChange={(selected) => setFrameWork(selected)}
      />

      <p className="text-[15px] font-[700] mt-5">Describe your component</p>
      <textarea
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        className="w-full min-h-[160px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        placeholder="Describe your component in detail and AI will generate it..."
      />

      <div className="flex items-center justify-between mt-3">
        <p className="text-gray-400 text-sm">Press Generate to create your component</p>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
          Generate
        </button>
      </div>

      {outputScreen && (
        <div className="mt-5 pt-4 border-t border-zinc-800">
          <p className="text-[14px] font-[600] text-gray-300 mb-2">
            Refine Component
            <span className="ml-2 text-xs text-gray-500 font-normal">Describe what to change</span>
          </p>
          <div className="flex gap-2">
            <input
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !refineLoading && onRefine()}
              className="flex-1 rounded-lg bg-[#09090B] px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder='e.g. "make the button red", "add dark mode"...'
            />
            <button
              onClick={onRefine}
              disabled={refineLoading}
              className="flex items-center px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white gap-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refineLoading ? <ClipLoader color="white" size={14} /> : <FiRefreshCcw size={14} />}
              Refine
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorPanel;
