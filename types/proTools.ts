// types/proTools.ts

export type ProToolId = 'contract' | 'cubicacion' | 'reimbursement';

export interface ProToolMeta {
  id: ProToolId;
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  adDurationSeconds: number;
}

export interface ToolUnlockRecord {
  unlockedAt: number | null; // Timestamp en milisegundos (para caducidad de 7 días)
  sessionId: string | null;  // Token de sesión volátil (para caducidad por cierre de app)
}