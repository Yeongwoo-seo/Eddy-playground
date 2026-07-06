import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EvidenceStatus, GameFlags, SuspectStatus } from "@/types/game";
import { INITIAL_FLAGS } from "@/types/game";

export interface GameStore {
  flags: GameFlags;
  evidenceStatus: Record<string, EvidenceStatus>;
  suspectStatus: Record<string, SuspectStatus>;

  currentCaseId: string;
  currentObjectiveId?: string;

  hintsUsed: number;
  completedDialogueNodes: string[];

  setFlag: (key: keyof GameFlags, value: boolean) => void;
  unlockEvidence: (evidenceId: string) => void;
  markEvidenceReviewed: (evidenceId: string) => void;
  setEvidenceStatus: (evidenceId: string, status: EvidenceStatus) => void;
  setSuspectStatus: (suspectId: string, status: SuspectStatus) => void;
  setCurrentObjective: (objectiveId: string) => void;
  useHint: () => void;
  completeDialogueNode: (nodeId: string) => void;
  resetCase: () => void;
}

const INITIAL_STATE = {
  flags: INITIAL_FLAGS,
  evidenceStatus: {} as Record<string, EvidenceStatus>,
  suspectStatus: {} as Record<string, SuspectStatus>,
  currentCaseId: "case01",
  currentObjectiveId: undefined as string | undefined,
  hintsUsed: 0,
  completedDialogueNodes: [] as string[],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setFlag: (key, value) =>
        set((state) => ({ flags: { ...state.flags, [key]: value } })),

      unlockEvidence: (evidenceId) =>
        set((state) => ({
          evidenceStatus: { ...state.evidenceStatus, [evidenceId]: "new" },
        })),

      markEvidenceReviewed: (evidenceId) =>
        set((state) => ({
          evidenceStatus: {
            ...state.evidenceStatus,
            [evidenceId]:
              state.evidenceStatus[evidenceId] === "new"
                ? "reviewed"
                : (state.evidenceStatus[evidenceId] ?? "reviewed"),
          },
        })),

      setEvidenceStatus: (evidenceId, status) =>
        set((state) => ({
          evidenceStatus: { ...state.evidenceStatus, [evidenceId]: status },
        })),

      setSuspectStatus: (suspectId, status) =>
        set((state) => ({
          suspectStatus: { ...state.suspectStatus, [suspectId]: status },
        })),

      setCurrentObjective: (objectiveId) =>
        set({ currentObjectiveId: objectiveId }),

      useHint: () => set((state) => ({ hintsUsed: state.hintsUsed + 1 })),

      completeDialogueNode: (nodeId) =>
        set((state) =>
          state.completedDialogueNodes.includes(nodeId)
            ? state
            : {
                completedDialogueNodes: [
                  ...state.completedDialogueNodes,
                  nodeId,
                ],
              },
        ),

      resetCase: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "operation-mk-game-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        flags: state.flags,
        evidenceStatus: state.evidenceStatus,
        suspectStatus: state.suspectStatus,
        currentCaseId: state.currentCaseId,
        currentObjectiveId: state.currentObjectiveId,
        hintsUsed: state.hintsUsed,
        completedDialogueNodes: state.completedDialogueNodes,
      }),
    },
  ),
);
