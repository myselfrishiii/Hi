
export interface VoiceMember {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isBot: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isBot: boolean;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}
