import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FiSmartphone, FiTablet, FiMonitor } from "react-icons/fi";

const FullscreenPreviewModal = ({
  show,
  onClose,
  previewSize,
  setPreviewSize,
  previewSrcDoc,
  previewWidth,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white w-screen h-screen overflow-auto z-50">
      <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b border-gray-200">
        <p className="font-bold">Fullscreen Preview</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewSize("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${previewSize === "mobile" ? "border-purple-500 text-purple-600 bg-purple-50" : "border-gray-300 hover:bg-gray-200"}`}
          >
            <FiSmartphone size={13} /> Mobile
          </button>
          <button
            onClick={() => setPreviewSize("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${previewSize === "tablet" ? "border-purple-500 text-purple-600 bg-purple-50" : "border-gray-300 hover:bg-gray-200"}`}
          >
            <FiTablet size={13} /> Tablet
          </button>
          <button
            onClick={() => setPreviewSize("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${previewSize === "desktop" ? "border-purple-500 text-purple-600 bg-purple-50" : "border-gray-300 hover:bg-gray-200"}`}
          >
            <FiMonitor size={13} /> Desktop
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200 transition-colors ml-2"
          >
            <IoCloseSharp />
          </button>
        </div>
      </div>
      <div className="flex justify-center bg-gray-200 h-[calc(100vh-60px)] overflow-auto p-4">
        <iframe
          srcDoc={previewSrcDoc}
          style={{ width: previewWidth, transition: "width 0.3s ease" }}
          className="h-full bg-white rounded-lg shadow-xl"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default FullscreenPreviewModal;
