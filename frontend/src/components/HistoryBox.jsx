import React from 'react';

export default function HistoryBox({ content }) {
    return (
        <div className="border p-1 rounded-xl border-transparent hover:bg-sky-200 cursor-pointer">
            <a href={`/chat/${content.id}`}>{content.title}</a>
        </div>
    );
}