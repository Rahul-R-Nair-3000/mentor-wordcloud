export interface TermItem {
  term: string;
  weight: number;
  count: number;
}

export interface AnalyzeResponse {
  transcript: string;
  terms: TermItem[];
  durationSec: number;
}

export async function analyzeAudioApi(
  audioBlob: Blob,
  filename: string = 'recording.webm'
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, filename);

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorText = `Server error (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) {
        errorText = errorJson.error;
      }
    } catch {
      // Fall back to HTTP status error text
    }
    throw new Error(errorText);
  }

  const data: AnalyzeResponse = await response.json();
  return data;
}
