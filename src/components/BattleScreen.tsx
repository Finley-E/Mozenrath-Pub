import React, { useState, useEffect } from 'react';
import { Heart, Zap } from 'lucide-react';
import { Numa, NumaClass } from '../types';
import { BattleEngine } from '../utils/BattleEngine';

interface BattleScreenProps {
  playerNuma: Numa;
  opponentNuma: Numa;
  playerLevel: number;
  opponentLevel: number;
  onVictory: (expGained: number) => void;
  onDefeat: () => void;
  onCapture: () => void;
  onFlee: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  playerNuma,
  opponentNuma,
  playerLevel,
  opponentLevel,
  onVictory,
  onDefeat,
  onCapture,
  onFlee
}) => {
  const [playerHp, setPlayerHp] = useState(playerNuma.baseStats.memory * (1 + 0.15 * (playerLevel - 1)));
  const [opponentHp, setOpponentHp] = useState(opponentNuma.baseStats.memory * (1 + 0.15 * (opponentLevel - 1)));
  const [battleLog, setBattleLog] = useState<string[]>(['A wild ' + opponentNuma.name + ' appeared!']);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleMode, setBattleMode] = useState<'menu' | 'fight' | 'bag'>('menu');

  const getNumaEmoji = (numaClass: NumaClass) => {
    const emojis: Record<NumaClass, string> = {
      [NumaClass.FOREST]: '🌱',
      [NumaClass.REEF]: '🪸',
      [NumaClass.OCEAN]: '🐬',
      [NumaClass.VOLCANO]: '🔥',
      [NumaClass.WIND]: '🦅',
      [NumaClass.CAVE]: '💎',
      [NumaClass.MARSH]: '🐊',
      [NumaClass.NIGHT]: '🌌',
      [NumaClass.ANCIENT]: '🏺',
      [NumaClass.SPIRIT]: '👻'
    };
    return emojis[numaClass] || '🐾';
  };

  const handleAttack = (moveIndex: number) => {
    if (!isPlayerTurn) return;

    const moves = [
      { name: 'Tackle', power: 15 },
      { name: 'Ember', power: 12 },
      { name: 'Splash', power: 18 }
    ];

    const move = moves[moveIndex % moves.length];
    const multiplier = BattleEngine.getTypeMultiplier(playerNuma.class, opponentNuma.class);
    const damage = BattleEngine.calculateDamage(
      playerLevel,
      move.power,
      playerNuma.baseStats.current,
      opponentNuma.baseStats.resonance,
      multiplier
    );

    const newOpponentHp = Math.max(0, opponentHp - damage);
    setOpponentHp(newOpponentHp);
    setBattleLog(prev => [...prev, `${playerNuma.name} used ${move.name}! (${damage} damage)`]);

    if (newOpponentHp <= 0) {
      onVictory(BattleEngine.calculateExp(opponentLevel));
      return;
    }

    setIsPlayerTurn(false);
    setTimeout(() => enemyAttack(), 1500);
  };

  const enemyAttack = () => {
    const enemyMoves = [
      { name: 'Scratch', power: 14 },
      { name: 'Bite', power: 16 }
    ];

    const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    const multiplier = BattleEngine.getTypeMultiplier(opponentNuma.class, playerNuma.class);
    const damage = BattleEngine.calculateDamage(
      opponentLevel,
      move.power,
      opponentNuma.baseStats.current,
      playerNuma.baseStats.resonance,
      multiplier
    );

    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    setBattleLog(prev => [...prev, `Enemy ${opponentNuma.name} used ${move.name}! (${damage} damage)`]);

    if (newPlayerHp <= 0) {
      onDefeat();
      return;
    }

    setIsPlayerTurn(true);
  };

  return (
    <div className="fixed inset-0 bg-[#eff6ee] z-50 flex flex-col justify-between p-4 md:p-8">
      {/* Enemy Status */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#4c6c4c] font-bold text-sm">Enemy {opponentNuma.name}</p>
          <p className="text-xs text-[#86a188]">Lvl {opponentLevel}</p>
        </div>
        <div className="w-32">
          <div className="bg-[#d8a45c] h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(opponentHp / (opponentNuma.baseStats.memory * (1 + 0.15 * (opponentLevel - 1)))) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-right mt-1">{Math.ceil(opponentHp)}/{Math.ceil(opponentNuma.baseStats.memory * (1 + 0.15 * (opponentLevel - 1)))}</p>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="flex justify-between items-center py-12">
        <div className="text-6xl animate-bounce">{getNumaEmoji(playerNuma.class)}</div>
        <div className="text-center">
          <p className="text-[#4c6c4c] font-bold">BATTLE</p>
        </div>
        <div className="text-6xl animate-bounce delay-100">{getNumaEmoji(opponentNuma.class)}</div>
      </div>

      {/* Player Status */}
      <div className="flex justify-between items-start">
        <div className="w-32">
          <div className="bg-[#d8a45c] h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(playerHp / (playerNuma.baseStats.memory * (1 + 0.15 * (playerLevel - 1)))) * 100}%` }}
            />
          </div>
          <p className="text-[10px] mt-1">{Math.ceil(playerHp)}/{Math.ceil(playerNuma.baseStats.memory * (1 + 0.15 * (playerLevel - 1)))}</p>
        </div>
        <div>
          <p className="text-[#4c6c4c] font-bold text-sm">{playerNuma.name}</p>
          <p className="text-xs text-[#86a188]">Lvl {playerLevel}</p>
        </div>
      </div>

      {/* Battle Log & Actions */}
      <div className="space-y-4">
        <div className="bg-white border-4 border-[#4c6c4c] p-3 min-h-[60px] rounded-lg">
          <p className="text-sm text-[#161e17] font-mono">
            {battleLog[battleLog.length - 1]}
          </p>
        </div>

        {battleMode === 'menu' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBattleMode('fight')}
              className="bg-[#4c6c4c] hover:bg-[#5e835e] text-white p-3 rounded font-bold uppercase text-sm transition-colors"
            >
              ⚔️ Fight
            </button>
            <button
              onClick={() => setBattleMode('bag')}
              className="bg-[#d8a45c] hover:bg-[#e4b574] text-black p-3 rounded font-bold uppercase text-sm transition-colors"
            >
              🎒 Bag
            </button>
            <button
              onClick={onFlee}
              className="bg-stone-600 hover:bg-stone-500 text-white p-3 rounded font-bold uppercase text-sm transition-colors col-span-2"
            >
              🏃 Run
            </button>
          </div>
        )}

        {battleMode === 'fight' && (
          <div className="grid grid-cols-2 gap-2">
            {['Tackle', 'Ember', 'Splash', 'Defense'].map((move, i) => (
              <button
                key={move}
                onClick={() => handleAttack(i)}
                disabled={!isPlayerTurn}
                className="bg-stone-800 hover:bg-stone-700 text-white p-2 rounded font-bold text-sm transition-colors disabled:opacity-50"
              >
                {move}
              </button>
            ))}
          </div>
        )}

        {battleMode === 'bag' && (
          <div className="space-y-2">
            <button
              onClick={onCapture}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white p-3 rounded font-bold uppercase transition-colors"
            >
              🏺 Throw Vessel
            </button>
            <button
              onClick={() => setBattleMode('menu')}
              className="w-full bg-stone-500 hover:bg-stone-400 text-white p-2 rounded uppercase text-sm"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
