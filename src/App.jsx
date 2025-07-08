import React, { useState, useCallback, useMemo } from 'react';
import { Award, Swords, FlaskConical, Building2, ScrollText, Coins, Scale, BrainCircuit, RefreshCw } from 'lucide-react';

// --- Helper Data & Functions ---
const SCORE_CATEGORIES = [
    { key: 'military', name: 'คะแนนจากการทหาร', icon: <Swords className="w-6 h-6 text-red-400" /> },
    { key: 'civilian', name: 'คะแนนสิ่งก่อสร้าง (ฟ้า)', icon: <Building2 className="w-6 h-6 text-blue-300" /> },
    { key: 'wonders', name: 'คะแนนสิ่งมหัศจรรย์', icon: <Award className="w-6 h-6 text-amber-300" /> },
    { key: 'progress', name: 'คะแนนโทเคนความก้าวหน้า', icon: <BrainCircuit className="w-6 h-6 text-green-300" /> },
    { key: 'commercial', name: 'คะแนนการค้า (เหลือง)', icon: <Scale className="w-6 h-6 text-yellow-300" /> },
    { key: 'guilds', name: 'คะแนนกิลด์ (ม่วง)', icon: <ScrollText className="w-6 h-6 text-purple-300" /> },
    { key: 'coins', name: 'คะแนนจากเหรียญ', icon: <Coins className="w-6 h-6 text-slate-300" />, rule: "1 คะแนน ต่อทุกๆ 3 เหรียญ" },
];

const initialPlayerState = {
    scores: {
        military: 0,
        civilian: 0,
        wonders: 0,
        progress: 0,
        commercial: 0,
        guilds: 0,
        coins: 0,
    },
    totalScore: 0,
};

// --- Components ---

const ScoreInput = ({ label, value, onChange, icon, rule }) => (
    <div>
        <div className="flex items-center justify-between space-x-2 w-full">
            <div className="flex items-center space-x-3">
                {icon}
                <label className="text-slate-300 text-sm md:text-base">{label}</label>
            </div>
            <input
                type="number"
                min="0"
                value={value === 0 ? '' : value}
                onChange={onChange}
                placeholder="0"
                className="w-24 p-2 text-center bg-slate-800/60 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            />
        </div>
        {rule && <p className="text-xs text-slate-400 mt-1 pl-9">{rule}</p>}
    </div>
);

const PlayerPanel = ({ player, playerId, updateScore, isWinner, winReason }) => {
    const handleScoreChange = (key, value) => {
        updateScore(playerId, key, value);
    };

    return (
        <div className={`relative bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 ring-1 ${isWinner ? 'ring-4 ring-amber-400 shadow-amber-400/20' : 'ring-slate-700'}`}>
            {isWinner && (
                <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 p-2 rounded-full shadow-lg z-10">
                    <Award className="w-8 h-8" />
                </div>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-amber-300 mb-6 text-center tracking-wider">ผู้เล่น {playerId + 1}</h3>

            <div className="space-y-4">
                {SCORE_CATEGORIES.map((category) => (
                    <ScoreInput
                        key={category.key}
                        icon={category.icon}
                        label={category.name}
                        rule={category.rule}
                        value={player.scores[category.key]}
                        onChange={(e) => handleScoreChange(category.key, e.target.value)}
                    />
                ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-700 border-dashed">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-slate-300">คะแนนรวม</span>
                    <span className="text-4xl font-bold text-white">{player.totalScore}</span>
                </div>
                 {isWinner && winReason && (
                    <p className="text-center text-md font-bold text-amber-400 mt-2 animate-pulse">
                        {winReason.includes('การ์ดฟ้า') ? 'ชนะด้วยคะแนนการ์ดฟ้า' : `ชนะด้วย: ${winReason}`}
                    </p>
                )}
            </div>
        </div>
    );
};


export default function App() {
    const [players, setPlayers] = useState([
        JSON.parse(JSON.stringify(initialPlayerState)),
        JSON.parse(JSON.stringify(initialPlayerState))
    ]);
    const [instantWinner, setInstantWinner] = useState(null);

    const updateScore = useCallback((playerId, key, value) => {
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            const player = { ...newPlayers[playerId] };
            // Ensure scores are numbers
            player.scores = { ...player.scores, [key]: parseInt(value, 10) || 0 };
            
            const coinPoints = Math.floor(player.scores.coins / 3);
            const otherPoints = Object.entries(player.scores)
                .filter(([k, v]) => k !== 'coins')
                .reduce((sum, [, score]) => sum + score, 0);

            player.totalScore = otherPoints + coinPoints;
            newPlayers[playerId] = player;

            return newPlayers;
        });
    }, []);
    
    const handleInstantWin = (player, reason) => {
        setInstantWinner({ player, reason });
    };
    
    const resetGame = () => {
        setPlayers([
            JSON.parse(JSON.stringify(initialPlayerState)),
            JSON.parse(JSON.stringify(initialPlayerState))
        ]);
        setInstantWinner(null);
    };

    const winner = useMemo(() => {
        if (instantWinner) {
            return instantWinner;
        }

        const [player1, player2] = players;
        const allScoresZero = player1.totalScore === 0 && player2.totalScore === 0;
        if (allScoresZero) {
            return null;
        }

        if (player1.totalScore > player2.totalScore) {
            return { player: 0, reason: 'คะแนนสูงสุด' };
        } else if (player2.totalScore > player1.totalScore) {
            return { player: 1, reason: 'คะแนนสูงสุด' };
        } else { // Tie-breaker
            if (player1.scores.civilian > player2.scores.civilian) {
                return { player: 0, reason: 'คะแนนสูงสุด (ชนะด้วยการ์ดฟ้า)' };
            } else if (player2.scores.civilian > player1.scores.civilian) {
                return { player: 1, reason: 'คะแนนสูงสุด (ชนะด้วยการ์ดฟ้า)' };
            } else {
                return { player: -1, reason: 'เสมอกัน!' }; // Draw
            }
        }
    }, [players, instantWinner]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8" style={{backgroundImage: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.15), transparent 50%)'}}>
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-amber-300" style={{fontFamily: 'Trajan Pro, serif'}}>7 Wonders Duel</h1>
                    <p className="text-lg md:text-xl text-slate-400 mt-2">เครื่องคำนวณคะแนน</p>
                </header>

                <div className="mb-8 p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-md ring-1 ring-slate-700">
                    <h3 className="text-center font-bold text-slate-300 mb-4">เงื่อนไขชนะทันที</h3>
                    <div className="flex justify-around items-center">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-slate-400">ชนะด้วยการทหาร</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleInstantWin(0, 'Military Supremacy')} className="bg-red-700 hover:bg-red-600 p-2 rounded-full flex items-center gap-2 text-sm"><Swords className="w-5 h-5"/> P1</button>
                                <button onClick={() => handleInstantWin(1, 'Military Supremacy')} className="bg-red-700 hover:bg-red-600 p-2 rounded-full flex items-center gap-2 text-sm"><Swords className="w-5 h-5"/> P2</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <p className="text-sm text-slate-400">ชนะด้วยวิทยาศาสตร์</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleInstantWin(0, 'Scientific Supremacy')} className="bg-green-700 hover:bg-green-600 p-2 rounded-full flex items-center gap-2 text-sm"><FlaskConical className="w-5 h-5"/> P1</button>
                                <button onClick={() => handleInstantWin(1, 'Scientific Supremacy')} className="bg-green-700 hover:bg-green-600 p-2 rounded-full flex items-center gap-2 text-sm"><FlaskConical className="w-5 h-5"/> P2</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {winner?.player === -1 && (
                    <div className="text-center text-2xl font-bold text-amber-400 my-4 p-4 bg-slate-800/50 rounded-lg">
                        ผลการแข่งขัน: เสมอ!
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <PlayerPanel 
                        player={players[0]} 
                        playerId={0} 
                        updateScore={updateScore} 
                        isWinner={winner?.player === 0}
                        winReason={winner?.player === 0 ? winner.reason : null}
                    />
                    <PlayerPanel 
                        player={players[1]} 
                        playerId={1} 
                        updateScore={updateScore} 
                        isWinner={winner?.player === 1}
                        winReason={winner?.player === 1 ? winner.reason : null}
                    />
                </div>

                <div className="text-center mt-8">
                    <button 
                        onClick={resetGame}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>เริ่มเกมใหม่</span>
                    </button>
                </div>
            </div>
           
        </div>
    );
}
