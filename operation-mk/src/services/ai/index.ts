/**
 * AI photo-judgement service layer — placeholder. Real-world photos
 * captured via the camera service will eventually be scored against a
 * target location/perspective here. Not implemented in this foundation
 * phase; UI components should depend on this interface, not a concrete
 * provider, once it lands.
 */
export interface PhotoJudgement {
  score: number;
  verdict: "match" | "partial" | "no_match";
}

export async function judgePhoto(_dataUrl: string): Promise<PhotoJudgement> {
  throw new Error("judgePhoto() is not implemented until the AI camera phase.");
}
