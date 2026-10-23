// components/pro/RewardedAdModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useProToolsStore } from '@/lib/store/useProToolsStore';
import { ProToolId } from '@/types/proTools';
import { Play, Volume2, ShieldCheck, CheckCircle2, Sparkles, X } from 'lucide-react';

interface RewardedAdModalProps {
  isOpen: boolean;
  toolId: ProToolId;
  toolTitle: string;
  onClose: () => void;
  onRewardGranted: () => void;
}

const TOTAL_AD_SECONDS = 15;

export default function RewardedAdModal({
  isOpen,
  toolId,
  toolTitle,
  onClose,
  onRewardGranted,
}: RewardedAdModalProps) {
  const { unlockTool } = useProToolsStore();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_AD_SECONDS);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(TOTAL_AD_SECONDS);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = ((TOTAL_AD_SECONDS - secondsLeft) / TOTAL_AD_SECONDS) * 100;

  const handleClaimReward = () => {
    if (!isCompleted) return;
    unlockTool(toolId);
    onRewardGranted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Barra Superior del Anuncio */}
        <div className="p-3 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00df82] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              SMOKE STUDIOS ADS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-md">
              <Volume2 size={12} className="text-zinc-500" />
              <span>{isCompleted ? 'FINALIZADO' : `00:${String(secondsLeft).padStart(2, '0')}`}</span>
            </div>

            {/* Solo permite cerrar si completó el video */}
            {isCompleted && (
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progreso del Anuncio */}
        <div className="w-full h-1 bg-zinc-900">
          <div
            className="h-full bg-[#00df82] transition-all duration-1000 ease-linear shadow-[0_0_10px_#00df82]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pantalla de Reproducción Simulada */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-900 via-black to-zinc-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden border-b border-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,223,130,0.08),transparent_70%)] pointer-events-none" />

          {isCompleted ? (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#022116] border border-[#00df82]/40 flex items-center justify-center text-[#00df82] mx-auto shadow-[0_0_20px_rgba(0,223,130,0.3)]">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
                RECOMPENSA DISPONIBLE
              </h4>
              <p className="text-[11px] text-zinc-400">
                Has desbloqueado el acceso independiente a esta herramienta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#00df82] mx-auto">
                <Play size={20} className="fill-[#00df82] ml-0.5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  PATROCINADO
                </span>
                <p className="text-xs font-bold text-zinc-200">
                  Herramientas Profesionales para Faenas en Chile
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cuerpo Inferior y Botón de Reclamación */}
        <div className="p-4 bg-black space-y-3">
          <div className="text-center space-y-0.5">
            <span className="text-[10px] font-mono text-[#00df82] uppercase tracking-wider block">
              HERRAMIENTA A DESBLOQUEAR
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">{toolTitle}</h3>
          </div>

          <button
            onClick={handleClaimReward}
            disabled={!isCompleted}
            className={`w-full h-12 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              isCompleted
                ? 'bg-[#00df82] hover:bg-[#00c975] text-black shadow-[0_0_25px_rgba(0,223,130,0.3)] active:scale-[0.98]'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <>
                <Sparkles size={15} />
                <span>DESBLOQUEAR HERRAMIENTA AHORA</span>
              </>
            ) : (
              <span>ESPERE {secondsLeft}s PARA DESBLOQUEAR</span>
            )}
          </button>

          <p className="text-[10px] text-zinc-600 text-center font-mono leading-tight">
            Válido por la sesión actual o un máximo de 7 días.
          </p>
        </div>
      </div>
    </div>
  );
}