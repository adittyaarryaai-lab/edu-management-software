import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F8FAFC] z-[9999]">
            <style>{`
                .cat-container {
                    position: relative;
                    width: 188px;
                    height: 260px;
                    color: #0f0e0d; /* Orange Cat Body */
                }

                /* --- KEYFRAMES MATRIX FROM SOURCE CODE --- */
                @keyframes shake { 50% { top: 6px; } }
                @keyframes shadow { 50% { width: 110px; margin-left: -40px; } }
                @keyframes tail { 50% { transform: rotate(38deg); } }
                @keyframes track { to { margin-left: 20px; } } /* Footprint track animation */
                @keyframes eye { 50% { top: 2px; } }
                @keyframes mustache_l { 50% { transform: rotate(-10deg); } }
                @keyframes mustache_r { 0%, 100% { transform: rotateY(180deg) rotateZ(0); } 50% { transform: rotateY(180deg) rotateZ(-10deg); } }
                @keyframes ear_l { 50% { transform: rotate(-30deg); } }
                @keyframes ear_r { 50% { transform: rotate(30deg); } }
                @keyframes paw_l { 50% { left: 130px; top: 176px; } 70% { top: 160px; } }
                @keyframes paw_r { 25% { top: 160px; } 50% { left: 88px; top: 176px; } }

                /* Cat Paws */
                .cat .paw {
                    position: absolute; top: 176px; left: 88px; width: 20px; height: 80px;
                    background: currentcolor; border-radius: 20px/0 0 80px 40px;
                    transform: rotate(10deg); animation: paw_l 0.45s infinite linear;
                }
                .cat .paw:after {
                    position: absolute; content: ""; bottom: -5px; left: -4px; width: 20px; height: 26px;
                    background: currentcolor; border-radius: 50%; transform: rotate(24deg);
                }
                .cat .paw:nth-child(2) { left: 130px; animation: paw_r 0.45s infinite linear; }
                
                /* Shaking Body Container */
                .cat .shake { position: absolute; width: 100%; top: 0; animation: shake 0.45s infinite linear; }
                
                /* Ground Shadow */
                .cat:before {
                    position: absolute; content: ""; top: 100%; left: 50%; width: 130px; height: 30px;
                    margin-left: -50px; margin-top: -20px; background: #616161; opacity: 0.2;
                    border-radius: 50%; animation: shadow 0.45s infinite linear; animation-delay: 0.225s;
                }
                
                /* --- FOOTPRINTS (Pairo ke nishaan) - Track Animation on Box-Shadow Stream --- */
                .cat:after {
                    position: absolute; content: ""; top: 100%; left: 100%; width: 15px; height: 10px;
                    margin-left: -30px; margin-top: -10px; background: #616161; opacity: 0.2; /* Footprint color/opacity */
                    border-radius: 50%;
                    /* Footprint Stream */
                    box-shadow: 50px 0 #616161, 100px 0 #616161, 150px 0 #616161, 200px 0 #616161, 250px 0 #616161, 300px 0 #616161;
                    animation: track 0.225s infinite linear; /* Track footprints */
                }

                /* Cat Tail */
                .cat .tail {
                    position: absolute; top: 0; right: -4px; width: 160px; height: 150px;
                    border: 20px solid; border-color: currentcolor transparent transparent currentcolor;
                    transform: rotate(45deg); border-radius: 120px/106px 120px 0 120px; box-sizing: border-box;
                    animation: tail 0.45s infinite linear;
                }
                .cat .tail:after {
                    position: absolute; content: ""; width: 20px; height: 20px; background: currentcolor;
                    border-radius: 50%; bottom: 0; box-shadow: 2px 4px currentcolor, 2px 7px currentcolor, 2px 10px currentcolor;
                }

                /* Main Body structure */
                .cat .main { position: absolute; top: 14px; right: 0; width: 144px; height: 216px; color: currentcolor; }
                .cat .main .head {
                    position: absolute; bottom: -10px; left: 20px; width: 104px; height: 180px;
                    background: currentcolor; border-radius: 55px/100px 100px 65px 65px; transform: rotate(40deg);
                }
                .cat .main .body { position: absolute; right: 0; width: 130px; height: 180px; background: currentcolor; border-radius: 65px/70px 70px 100px 100px; }
                .cat .main .body .leg { position: absolute; right: -10px; top: 20px; width: 50px; height: 116px; background: currentcolor; border-radius: 25px/0 60px 50px 0; }
                
                /* Face features structure */
                .cat .main .face { position: absolute; bottom: 0; width: 76px; height: 80px; }
                .cat .main .face .nose { position: absolute; bottom: 8px; left: 50%; width: 18px; height: 9px; margin-left: -10px; background: #9c1b4d; border-radius: 20px/10px 10px 20px 20px; }
                
                /* --- BOTH EYES VISIBLE NOW (Detailed Pupils) --- */
                .cat .main .face .eye {
                    position: absolute; top: 28px; left: -8px; width: 30px; height: 30px;
                    background: #fff; border: 3px solid #000; border-radius: 50%; box-sizing: border-box;
                }
                .cat .main .face .eye:nth-child(5) { top: 26px; left: 36px; } /* Corrected Right Eye position */
                .cat .main .face .eye:after {
                    position: absolute; content: ""; width: 10px; height: 10px; right: 1px; top: 4px;
                    background: #000; border-radius: 50%; animation: eye 0.45s infinite linear;
                }

                /* Cat Ears */
                .cat .main .face .ear_l {
                    position: absolute; top: -17px; width: 20px; height: 30px; background: currentcolor;
                    border-radius: 20px/55px 55px 0 0; transform-origin: 50% 100%; transform: rotate(-20deg);
                    animation: ear_l 0.45s infinite linear;
                }
                .cat .main .face .ear_r {
                    position: absolute; right: 0; margin-top: -22px; width: 36px; height: 30px;
                    transform-origin: 50% 100%; transform: rotate(20deg); animation: ear_r 0.45s infinite linear;
                }
            `}</style>

            <div className="cat-container cat">
                <div className="paw"></div>
                <div className="paw"></div>
                <div className="shake">
                    <div className="tail"></div>
                    <div className="main">
                        <div className="head"></div>
                        <div className="body">
                            <div className="leg"></div>
                        </div>
                        <div className="face">
                            <div className="nose"></div>
                            {/* Mouth (impression below nose) */}
                            <div style={{position: 'absolute', bottom: '1px', left: '50%', width: '12px', height: '6px', marginLeft: '-6px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%'}}></div> 
                            <div className="eye"></div>
                            <div className="eye"></div>
                            <div className="ear_l"><div className="inner" style={{background: '#616161', width: '6px', height: '14px', margin: '5px auto', borderRadius: '7px/20px 20px 0 0'}}></div></div>
                            <div className="ear_r"><div className="inner" style={{background: '#616161', width: '12px', height: '26px', margin: '2px auto', borderRadius: '50%'}}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-[20px] font-medium text-slate-800 italic uppercase animate-pulse">
                Preparing your dashboard...
                <p className="text-[15px] font-bold text-slate-900 mt-1">Syncing Data...</p>
            </div>
        </div>
    );
};

export default Loader;