import React from 'react'
import { FiClock } from 'react-icons/fi'

const Navbar = ({ historyCount = 0, onHistoryClick }) => {
  return (
    <>
      <div className="nav flex items-center justify-between px-[20px] md:px-[100px] h-[70px] border-b-[1px] border-gray-800">
        <div className="logo">
          <h3 className='text-[22px] font-[700] sp-text'>UIBuilderAI</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onHistoryClick}
            title="Generation History"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition-all text-sm border border-zinc-700"
          >
            <FiClock size={15} />
            History
            {historyCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount > 9 ? "9+" : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
