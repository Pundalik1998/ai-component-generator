import React from "react";
import { HiOutlineCode } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

const HistorySidebar = ({
  show,
  history,
  onClose,
  onClearAll,
  onLoad,
  onDeleteItem,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-80 bg-[#141319] border-r border-zinc-800 h-full overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="font-bold text-white">Generation History</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Clear all
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <IoCloseSharp size={18} />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 px-4">
            <HiOutlineCode size={36} className="mb-2 opacity-40" />
            <p className="text-sm">No history yet.</p>
            <p className="text-xs mt-1">Generated components will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg bg-zinc-800 border border-transparent hover:border-purple-800 transition-all"
              >
                <button
                  onClick={() => onLoad(entry)}
                  className="w-full text-left"
                >
                  <p className="text-white text-sm font-medium truncate">{entry.prompt}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-purple-400 text-xs">{entry.framework}</span>
                    <span className="text-gray-500 text-xs">{entry.timestamp}</span>
                  </div>
                </button>

                <div className="mt-2 pt-2 border-t border-zinc-700 flex justify-end">
                  <button
                    onClick={() => onDeleteItem(entry.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                    title="Delete this history item"
                  >
                    <FiTrash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 bg-black/50 cursor-pointer" onClick={onClose} />
    </div>
  );
};

export default HistorySidebar;
