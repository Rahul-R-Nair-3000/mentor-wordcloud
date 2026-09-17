import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SegmentedControl, type InputMode } from './components/SegmentedControl';
import { DevStateSwitcher, type UIState } from './components/DevStateSwitcher';
import { RecordingState } from './components/states/RecordingState';
import { RecordedState } from './components/states/RecordedState';
import { UploadProgressState } from './components/states/UploadProgressState';
import { AnalyzingState } from './components/states/AnalyzingState';
import { ErrorState } from './components/states/ErrorState';
import { ResultState } from './components/states/ResultState';
import { UploadDropzone } from './components/UploadDropzone';

import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useAudioUpload } from './hooks/useAudioUpload';
import { analyzeAudioApi, type AnalyzeResponse } from './api/analyze';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>('record');
  const [uiStateOverride, setUiStateOverride] = useState<UIState | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const recorder = useAudioRecorder();
  const upload = useAudioUpload();

  // Execute real network request to POST /api/analyze
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setUiStateOverride(null);

    try {
      let blobToUpload: Blob | null = null;
      let filename = 'audio.webm';

      if (inputMode === 'record' && recorder.recordedBlob) {
        blobToUpload = recorder.recordedBlob;
        filename = 'recorded_session.webm';
      } else if (inputMode === 'upload' && upload.selectedFile) {
        blobToUpload = upload.selectedFile.file;
        filename = upload.selectedFile.name;
      }

      if (!blobToUpload) {
        throw new Error('No audio file available for analysis.');
      }

      const responseData = await analyzeAudioApi(blobToUpload, filename);
      setAnalysisResult(responseData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during audio analysis.';
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compute active state
  let currentUIState: UIState = 'recording';

  if (uiStateOverride) {
    currentUIState = uiStateOverride;
  } else if (isAnalyzing) {
    currentUIState = 'analyzing';
  } else if (analysisError || recorder.error || upload.error) {
    currentUIState = 'error';
  } else if (analysisResult) {
    currentUIState = 'result';
  } else if (inputMode === 'record') {
    if (recorder.isRecording) {
      currentUIState = 'recording';
    } else if (recorder.recordedBlob && recorder.audioUrl) {
      currentUIState = 'recorded';
    } else {
      currentUIState = 'recording';
    }
  } else {
    currentUIState = 'upload-progress';
  }

  // Clear state when changing modes
  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setUiStateOverride(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    if (mode === 'record') {
      upload.clearFile();
    } else {
      recorder.discardRecording();
    }
  };

  // Full reset back to initial state
  const handleReset = () => {
    recorder.discardRecording();
    upload.clearFile();
    setInputMode('record');
    setUiStateOverride(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
  };

  // Reset error override if user resolves error
  useEffect(() => {
    if (recorder.error || upload.error || analysisError) {
      setUiStateOverride(null);
    }
  }, [recorder.error, upload.error, analysisError]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-indigo-500 selection:text-white px-4 py-8">
      {/* Top Header */}
      <div className="w-full">
        <Header />

        {/* Segmented Record / Upload Control */}
        <SegmentedControl mode={inputMode} onModeChange={handleModeChange} />

        {/* Dev Switcher for state review */}
        <DevStateSwitcher
          currentState={currentUIState}
          onStateChange={(state) => setUiStateOverride(state)}
        />
      </div>

      {/* Main Container Area */}
      <main className="w-full my-auto flex flex-col items-center justify-center">
        {/* ERROR STATE */}
        {currentUIState === 'error' && (
          <ErrorState
            errorMessage={analysisError || recorder.error || upload.error || 'An error occurred.'}
            onRetry={() => {
              setAnalysisError(null);
              if (recorder.error) {
                recorder.startRecording();
              } else if (upload.error) {
                upload.clearFile();
              } else {
                handleStartAnalysis();
              }
            }}
            onSelectAnother={() => {
              handleReset();
              setInputMode('upload');
            }}
          />
        )}

        {/* RECORDING MODE */}
        {inputMode === 'record' && currentUIState !== 'error' && currentUIState !== 'analyzing' && currentUIState !== 'result' && (
          <>
            {currentUIState === 'recording' && (
              <RecordingState
                isRecording={recorder.isRecording}
                formattedTime={recorder.formattedTime}
                onStart={recorder.startRecording}
                onStop={recorder.stopRecording}
                onCancel={recorder.discardRecording}
              />
            )}

            {currentUIState === 'recorded' && (
              <RecordedState
                audioUrl={recorder.audioUrl}
                fileName="Recorded_Feedback.webm"
                formattedDuration={recorder.formattedTime}
                onDiscard={recorder.discardRecording}
                onAnalyze={handleStartAnalysis}
              />
            )}
          </>
        )}

        {/* UPLOAD MODE */}
        {inputMode === 'upload' && currentUIState !== 'error' && currentUIState !== 'analyzing' && currentUIState !== 'result' && (
          <>
            {!upload.selectedFile ? (
              <UploadDropzone onFileSelected={upload.handleFileSelect} />
            ) : (
              <UploadProgressState
                fileName={upload.selectedFile.name}
                formattedSize={upload.selectedFile.formattedSize}
                formattedDuration={upload.selectedFile.formattedDuration}
                onAnalyze={handleStartAnalysis}
                onCancel={upload.clearFile}
              />
            )}
          </>
        )}

        {/* ANALYZING STATE */}
        {currentUIState === 'analyzing' && <AnalyzingState />}

        {/* RESULT STATE */}
        {currentUIState === 'result' && (
          <ResultState
            analysisResult={analysisResult}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-12 pt-6 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-4xl">
        <span>Mentor Wordcloud Real Network Pipeline • POST /api/analyze (Multer 25MB)</span>
        <span className="font-mono text-indigo-400 text-[11px]">Active state: {currentUIState}</span>
      </footer>
    </div>
  );
}

export default App;
