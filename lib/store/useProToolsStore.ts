// lib/store/useProToolsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProToolId, ToolUnlockRecord } from '@/types/proTools';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getActiveSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sId = sessionStorage.getItem('cotiza_session_token');
  if (!sId) {
    sId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('cotiza_session_token', sId);
  }
  return sId;
}

interface ProToolsState {
  access: Record<ProToolId, ToolUnlockRecord>;
  unlockTool: (toolId: ProToolId) => void;
  relockTool: (toolId: ProToolId) => void;
  isToolUnlocked: (toolId: ProToolId) => boolean;
}

// CORRECCIÓN: 'cubicacion' en lugar de 'handover'
const initialAccess: Record<ProToolId, ToolUnlockRecord> = {
  contract: { unlockedAt: null, sessionId: null },
  cubicacion: { unlockedAt: null, sessionId: null },
  reimbursement: { unlockedAt: null, sessionId: null },
};

export const useProToolsStore = create<ProToolsState>()(
  persist(
    (set, get) => ({
      access: initialAccess,

      unlockTool: (toolId) => {
        const currentSession = getActiveSessionId();
        set((state) => ({
          access: {
            ...state.access,
            [toolId]: {
              unlockedAt: Date.now(),
              sessionId: currentSession,
            },
          },
        }));
      },

      relockTool: (toolId) => {
        set((state) => ({
          access: {
            ...state.access,
            [toolId]: { unlockedAt: null, sessionId: null },
          },
        }));
      },

      isToolUnlocked: (toolId) => {
        const record = get().access[toolId];
        if (!record || !record.unlockedAt || !record.sessionId) return false;

        const currentSession = getActiveSessionId();

        // 1. Caducidad por cierre de sesión / app
        if (record.sessionId !== currentSession) {
          get().relockTool(toolId);
          return false;
        }

        // 2. Caducidad por límite de 7 días
        const isExpired = Date.now() - record.unlockedAt > SEVEN_DAYS_MS;
        if (isExpired) {
          get().relockTool(toolId);
          return false;
        }

        return true;
      },
    }),
    {
      name: 'cotizaexpress-pro-tools-access',
      storage: createJSONStorage(() => localStorage),
    }
  )
);