import React from 'react';
import HistoryBox from './HistoryBox';

function ChatHistoryModal({ onClose, content }) {
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
    console.log(content)
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-start bg-transparent bg-opacity-20 backdrop-blur-sm z-10" 
      onClick={handleBackdropClick}
    >
      <div 
        className="w-1/4 h-full bg-sky-100 shadow-lg" 
        style={{ marginRight: 0 }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 bg-gradient-to-b from-sky-100 to-sky-200">
          <h2 className="text-xl font-semibold">Chat History</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full text-sky-700 hover:bg-sky-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 60px)' }}>
          {content && content.length > 0 ? (
            content.map((item, index) => (
              <HistoryBox key={index} content={item} />
            ))
          ) : (
            <p className="py-2">No chat history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistoryModal;