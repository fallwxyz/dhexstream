import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dhex-bg">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-dhex-accent/30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-dhex-accent border-r-transparent border-b-dhex-accent border-l-transparent animate-spin"></div>
                <img
                    src="/dhexstream/image/logo.png"
                    alt="Loading..."
                    className="absolute inset-0 w-full h-full object-contain p-4 animate-pulse"
                />
            </div>
            <p className="mt-4 text-dhex-accent font-bold tracking-widest animate-pulse">MEMUAT</p>

        </div>
    );
};

export default Loading;
