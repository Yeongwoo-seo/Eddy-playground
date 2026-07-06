/**
 * Camera service layer — placeholder for the field-mission camera
 * capture flow (Opera House / Harbour Bridge alignment). Not implemented
 * in this foundation phase; kept isolated here so UI components never
 * talk to getUserMedia / capture APIs directly.
 */
export interface CameraCaptureResult {
  dataUrl: string;
  capturedAt: number;
}

export async function captureFrame(): Promise<CameraCaptureResult> {
  throw new Error("captureFrame() is not implemented until the field-mission phase.");
}
