import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { VoiceMember, ConnectionStatus, Message } from './types';
import { decode, decodeAudioData, createPcmBlob } from './audioUtils';

// Sub-components
import Sidebar from './components/Sidebar';
import ChannelSidebar from './components/ChannelSidebar';
import VoiceStage from './components/VoiceStage';
import ControlBar from './components/ControlBar';
import ChatArea from './components/ChatArea';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('voice');
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'Gemini Bot',
      content: 'Hello! I am GeminiCord. Mention me or join the voice channel to chat!',
      timestamp: new Date(),
      isBot: true,
    },
  ]);

  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setStatus(ConnectionStatus.DISCONNECTED);
    setIsUserSpeaking(false);
    setIsBotSpeaking(false);
  }, []);

  const connectVoice = async () => {
    if (status !== ConnectionStatus.DISCONNECTED) return;
    setStatus(ConnectionStatus.CONNECTING);
    try {
      // Use API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: "You are a helpful and funny Discord bot named 'GeminiCord'. You are hanging out in a voice channel. Keep your responses concise and friendly.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(ConnectionStatus.CONNECTED);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setIsUserSpeaking(rms > 0.01);
              const pcmBlob = createPcmBlob(inputData);
              // Send input only after session promise resolves to avoid race condition
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && !isDeafened) {
              const outCtx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsBotSpeaking(false);
              };
              setIsBotSpeaking(true);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsBotSpeaking(false);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => `You: ${message.serverContent?.inputTranscription?.text}\n${prev}`.slice(0, 500));
            }
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => `Bot: ${message.serverContent?.outputTranscription?.text}\n${prev}`.slice(0, 500));
            }
          },
          onerror: (err) => {
            console.error('Gemini Live Error:', err);
            setStatus(ConnectionStatus.ERROR);
            cleanup();
          },
          onclose: () => cleanup()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to connect to voice:', error);
      setStatus(ConnectionStatus.ERROR);
      cleanup();
    }
  };

  const sendTextMessage = async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'You', content, timestamp: new Date(), isBot: false };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Initialize right before call to ensure fresh instance
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: "You are GeminiCord, a Discord bot. Be friendly, concise, and helpful. Use emojis like a Discord user." }
      });
      
      const botMsgId = (Date.now() + 1).toString();
      let botContent = '';
      
      setMessages(prev => [...prev, { id: botMsgId, sender: 'Gemini Bot', content: '...', timestamp: new Date(), isBot: true }]);

      const result = await chat.sendMessageStream({ message: content });
      for await (const chunk of result) {
        botContent += chunk.text || '';
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: botContent } : m));
      }
    } catch (error) {
      console.error('Text chat error:', error);
    }
  };

  const members: VoiceMember[] = [
    { id: 'bot', name: 'Gemini Bot', avatar: 'https://picsum.photos/seed/gemini/200', isSpeaking: isBotSpeaking, isBot: true, isMuted: false, isDeafened: false },
    { id: 'user', name: 'You', avatar: 'https://picsum.photos/seed/user/200', isSpeaking: isUserSpeaking, isBot: false, isMuted: isMuted, isDeafened: isDeafened }
  ];

  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#DBDEE1] overflow-hidden select-none">
      <Sidebar />
      <ChannelSidebar activeTab={activeTab} onTabChange={setActiveTab} isVoiceConnected={status === ConnectionStatus.CONNECTED} />
      <div className="flex-1 flex flex-col bg-[#313338] relative">
        <div className="h-12 border-b border-[#1E1F22] flex items-center px-4 shadow-sm shrink-0">
          <div className="flex items-center space-x-2 text-[#80848E]">
            {activeTab === 'text' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5.88 4.12L13.76 12l-7.88 7.88L4.47 18.47 10.94 12 4.47 5.53zM14.59 16.59L19.17 12l-4.58-4.59L16 6l6 6-6 6z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h16V9l-8-6zm0 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            )}
            <span className="font-bold text-white capitalize">{activeTab === 'text' ? 'general' : 'General Voice'}</span>
          </div>
        </div>

        {activeTab === 'text' ? (
          <ChatArea messages={messages} onSendMessage={sendTextMessage} />
        ) : (
          <VoiceStage members={members} isConnected={status === ConnectionStatus.CONNECTED} />
        )}

        {activeTab === 'voice' && transcription && (
          <div className="absolute top-16 right-4 max-w-xs bg-black/40 p-3 rounded-lg text-xs font-mono backdrop-blur-sm pointer-events-none whitespace-pre-wrap max-h-48 overflow-hidden z-20">
            <p className="text-[#949BA4] mb-1">Voice Log</p>
            {transcription}
          </div>
        )}

        <ControlBar 
          status={status}
          onConnect={connectVoice}
          onDisconnect={cleanup}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isDeafened={isDeafened}
          setIsDeafened={(val) => { setIsDeafened(val); if (val) setIsMuted(true); }}
          showVoiceControls={activeTab === 'voice' || status === ConnectionStatus.CONNECTED}
        />
      </div>
    </div>
  );
};

export default App;