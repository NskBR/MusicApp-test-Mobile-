import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  format: string;
  bitrate: number;
  fileSize: number; // in bytes
  lastModified: number;
  artworkUrl: string;
  localPath?: string;
}

export interface ConnectedDevice {
  name: string;
  ipAddress: string;
  status: 'connected' | 'disconnected';
}

export interface TransferTask {
  id: string;
  title: string;
  progress: number; // 0 to 100
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  error?: string;
}

interface AudioContextType {
  libraryTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackPosition: number; // in milliseconds
  playbackDuration: number; // in milliseconds
  playbackProgress: number; // 0 to 100
  volume: number;
  
  // Audio Controls
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => Promise<void>;
  seekAudio: (positionMs: number) => Promise<void>;
  skipTrack: (direction: 'next' | 'prev') => void;
  setVolume: (vol: number) => Promise<void>;
  isShuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  toggleRepeatMode: () => void;
  
  // Local Scanner
  scanLocalFolder: () => Promise<void>;
  isScanning: boolean;

  // LAN Wi-Fi Sync State
  device: ConnectedDevice | null;
  serverUrl: string;
  pairingPin: string;
  sessionToken: string | null;
  isPairing: boolean;
  pairWithPC: (ip: string, pin: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  
  // Wi-Fi Transfers
  transferQueue: TransferTask[];
  isSyncing: boolean;
  pullTransfersFromPC: () => Promise<void>;

  // Track Management
  deleteTrack: (track: Track) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const MUSIC_DIR = (FileSystem as any).documentDirectory + 'SoundSync/';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [libraryTracks, setLibraryTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [volume, setVolumeState] = useState(1.0);
  const [isScanning, setIsScanning] = useState(false);

  // LAN Wi-Fi States
  const [device, setDevice] = useState<ConnectedDevice | null>(null);
  const [serverUrl, setServerUrl] = useState('');
  const [pairingPin, setPairingPin] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isPairing, setIsPairing] = useState(false);
  const [transferQueue, setTransferQueue] = useState<TransferTask[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Shuffle and Repeat States
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  // Audio sound object ref
  const soundRef = useRef<Audio.Sound | null>(null);
  const libraryTracksRef = useRef<Track[]>([]);
  libraryTracksRef.current = libraryTracks;
  const currentTrackRef = useRef<Track | null>(null);
  currentTrackRef.current = currentTrack;

  // 1. Initial configuration on mount
  useEffect(() => {
    // Enable audio in background & silent switch modes
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });

    // Load pairing token and device settings
    loadStorageData();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadStorageData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('soundsync_token');
      const savedDevice = await AsyncStorage.getItem('soundsync_device');
      const savedUrl = await AsyncStorage.getItem('soundsync_server_url');
      const savedTracks = await AsyncStorage.getItem('soundsync_library_tracks');

      if (savedToken && savedDevice && savedUrl) {
        const parsedDevice = JSON.parse(savedDevice);
        setSessionToken(savedToken);
        setServerUrl(savedUrl);
        setDevice({ ...parsedDevice, status: 'connecting' });

        // Actively verify connection to local server in the background
        setTimeout(async () => {
          try {
            console.log(`[Auto-Reconnect] Verificando conexão LAN com o PC: ${savedUrl}`);
            const response = await fetch(`${savedUrl}/api/tracks`, {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${savedToken}` }
            });

            if (response.ok) {
              console.log("[Auto-Reconnect] Sincronização automática reestabelecida com sucesso!");
              setDevice({ ...parsedDevice, status: 'connected' });
            } else if (response.status === 401) {
              console.warn("[Auto-Reconnect] Token expirado ou PIN redefinido. Limpando pareamento obsoleto.");
              setDevice(null);
              setSessionToken(null);
              setServerUrl('');
              await AsyncStorage.removeItem('soundsync_token');
              await AsyncStorage.removeItem('soundsync_device');
              await AsyncStorage.removeItem('soundsync_server_url');
            } else {
              setDevice({ ...parsedDevice, status: 'disconnected' });
            }
          } catch (err) {
            console.log("[Auto-Reconnect] Computador offline ou em outra rede Wi-Fi. Mantendo cache para reconexão futura.");
            setDevice({ ...parsedDevice, status: 'disconnected' });
          }
        }, 300);
      }

      if (savedTracks) {
        setLibraryTracks(JSON.parse(savedTracks));
      }

      // Automatically scan files on boot
      setTimeout(() => {
        scanLocalFolder();
      }, 500);
    } catch (e) {
      console.error("Failed to load local storage configurations:", e);
    }
  };

  // Persist library tracks
  const saveTracksToStorage = async (tracks: Track[]) => {
    try {
      await AsyncStorage.setItem('soundsync_library_tracks', JSON.stringify(tracks));
    } catch (e) {
      console.error("Failed to save library tracks to storage:", e);
    }
  };

  // 2. Playback Status Observer
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.durationMillis) {
        setPlaybackProgress((status.positionMillis / status.durationMillis) * 100);
      }

      if (status.didJustFinish && !status.isLooping) {
        if (repeatModeRef.current === 'one') {
          // Loop current track
          if (soundRef.current) {
            soundRef.current.setStatusAsync({ positionMillis: 0, shouldPlay: true }).catch(() => {});
          }
        } else {
          skipTrack('next');
        }
      }
    }
  };

  // 3. Audio Control Functions
  const playTrack = async (track: Track) => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setCurrentTrack(track);

      // Create new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.localPath || track.artworkUrl }, // Fallback to URI
        { shouldPlay: true, volume },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsPlaying(true);
    } catch (e) {
      console.error("Failed to load or play audio track offline:", e);
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!soundRef.current) {
      // If no track is playing but we have tracks, play the first one
      if (libraryTracks.length > 0) {
        await playTrack(libraryTracks[0]);
      }
      return;
    }

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Failed to toggle play state:", e);
    }
  };

  const seekAudio = async (positionMs: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(positionMs);
        setPlaybackPosition(positionMs);
      } catch (e) {
        console.error("Failed to seek audio:", e);
      }
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    const tracks = libraryTracksRef.current;
    if (tracks.length === 0) return;

    const current = currentTrackRef.current;
    if (!current) {
      playTrack(tracks[0]);
      return;
    }

    const currentIndex = tracks.findIndex(t => t.id === current.id);
    let nextIndex = 0;

    if (isShuffleRef.current) {
      if (tracks.length > 1) {
        let randomIndex = currentIndex;
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * tracks.length);
        }
        nextIndex = randomIndex;
      } else {
        nextIndex = 0;
      }
    } else {
      if (currentIndex !== -1) {
        if (direction === 'next') {
          if (currentIndex === tracks.length - 1) {
            if (repeatModeRef.current === 'all') {
              nextIndex = 0;
            } else {
              // End of playlist and repeat is off: pause playback
              setIsPlaying(false);
              if (soundRef.current) {
                soundRef.current.pauseAsync().catch(() => {});
              }
              return;
            }
          } else {
            nextIndex = currentIndex + 1;
          }
        } else {
          if (currentIndex === 0) {
            if (repeatModeRef.current === 'all') {
              nextIndex = tracks.length - 1;
            } else {
              nextIndex = 0;
            }
          } else {
            nextIndex = currentIndex - 1;
          }
        }
      }
    }

    playTrack(tracks[nextIndex]);
  };

  const setVolume = async (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVol);
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(clampedVol);
      } catch (e) {}
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const next = !prev;
      isShuffleRef.current = next;
      return next;
    });
  };

  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
      let next: 'off' | 'all' | 'one' = 'off';
      if (prev === 'off') next = 'all';
      else if (prev === 'all') next = 'one';
      repeatModeRef.current = next;
      return next;
    });
  };

  // 4. File Folder Scanner
  const scanLocalFolder = async () => {
    if (isScanning) return;
    setIsScanning(true);
    console.log("Iniciando escaneamento de pasta nativa:", MUSIC_DIR);

    try {
      // 1. Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(MUSIC_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MUSIC_DIR, { intermediates: true });
      }

      // 2. Read contents
      const files = await FileSystem.readDirectoryAsync(MUSIC_DIR);
      
      // 3. Filter for audio files
      const audioFiles = files.filter(f => 
        f.endsWith('.mp3') || f.endsWith('.m4a') || f.endsWith('.wav') || f.endsWith('.flac')
      );

      // 4. Compare directory files against stored database catalog (Self-Healing)
      const currentStored = [...libraryTracksRef.current];
      const updatedList: Track[] = [];

      for (const file of audioFiles) {
        const fileUri = MUSIC_DIR + file;
        const lastDot = file.lastIndexOf('.');
        const titleWithoutExt = lastDot !== -1 ? file.substring(0, lastDot) : file;
        const matchingStored = currentStored.find(t => t.title === titleWithoutExt);

        if (matchingStored) {
          // Verify physical path remains correct
          updatedList.push({
            ...matchingStored,
            localPath: fileUri,
            artworkUrl: MUSIC_DIR + titleWithoutExt + '.jpg'
          });
        } else {
          // File was manually dragged via USB! Create default catalog metadata
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          const size = fileInfo.exists ? (fileInfo.size || 5000000) : 5000000;
          
          updatedList.push({
            id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            title: titleWithoutExt,
            artist: 'Artista Local',
            album: 'Álbum Local',
            duration: 210, // default, loaded dynamically in player later
            format: file.substring(lastDot + 1).toUpperCase(),
            bitrate: 320,
            fileSize: size,
            lastModified: Date.now(),
            artworkUrl: MUSIC_DIR + titleWithoutExt + '.jpg',
            localPath: fileUri
          });
        }
      }

      // 5. Update state and save
      setLibraryTracks(updatedList);
      await saveTracksToStorage(updatedList);
      console.log(`Escaneamento concluído. Encontradas ${updatedList.length} faixas físicas.`);
    } catch (e) {
      console.error("Local folder scanning failed:", e);
    } finally {
      setIsScanning(false);
    }
  };

  // 7. Delete track from device storage
  const deleteTrack = async (track: Track) => {
    try {
      // Delete audio file
      if (track.localPath) {
        const audioInfo = await FileSystem.getInfoAsync(track.localPath);
        if (audioInfo.exists) {
          await FileSystem.deleteAsync(track.localPath, { idempotent: true });
          console.log(`[Delete] Áudio removido: ${track.localPath}`);
        }
      }
      // Delete artwork jpg
      if (track.artworkUrl && !track.artworkUrl.startsWith('http')) {
        const artInfo = await FileSystem.getInfoAsync(track.artworkUrl);
        if (artInfo.exists) {
          await FileSystem.deleteAsync(track.artworkUrl, { idempotent: true });
          console.log(`[Delete] Capa removida: ${track.artworkUrl}`);
        }
      }
    } catch (e) {
      console.error('[Delete] Erro ao remover arquivos físicos:', e);
    }

    // Remove from state and persist
    setLibraryTracks(prev => {
      const newList = prev.filter(t => t.id !== track.id);
      saveTracksToStorage(newList);
      return newList;
    });

    // Stop playback if this track was playing
    if (currentTrackRef.current?.id === track.id) {
      try {
        await soundRef.current?.stopAsync();
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
      } catch (_) {}
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const pairWithPC = async (ip: string, pin: string) => {
    if (isPairing) return;
    setIsPairing(true);
    console.log(`Tentando pareamento LAN: IP=${ip}, PIN=${pin}`);

    const cleanIp = ip.trim().replace("http://", "").replace("https://", "");
    const url = `http://${cleanIp}`;

    try {
      const response = await fetch(`${url}/api/pair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pin.trim(),
          device_name: 'iPhone/Android Local client'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const newDevice: ConnectedDevice = {
          name: data.device || 'PC de Lucas',
          ipAddress: cleanIp,
          status: 'connected'
        };

        setDevice(newDevice);
        setSessionToken(data.token);
        setServerUrl(url);

        await AsyncStorage.setItem('soundsync_token', data.token);
        await AsyncStorage.setItem('soundsync_device', JSON.stringify(newDevice));
        await AsyncStorage.setItem('soundsync_server_url', url);

        console.log("Dispositivo pareado com sucesso via rede local Wi-Fi!");
      } else {
        const errText = await response.text();
        throw new Error(errText || "PIN incorreto ou conexão recusada");
      }
    } catch (e) {
      console.error("Pareamento LAN falhou:", e);
      throw e;
    } finally {
      setIsPairing(false);
    }
  };

  const disconnectDevice = async () => {
    try {
      // Best-effort call to PC to inform disconnection
      if (serverUrl && sessionToken) {
        fetch(`${serverUrl}/api/disconnect`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${sessionToken}` }
        }).catch(() => {});
      }
    } catch (e) {}

    setDevice(null);
    setSessionToken(null);
    setServerUrl('');
    
    await AsyncStorage.removeItem('soundsync_token');
    await AsyncStorage.removeItem('soundsync_device');
    await AsyncStorage.removeItem('soundsync_server_url');
    console.log("Sessão desconectada do computador.");
  };

  // 6. Wi-Fi File Sync Client (Downloads files sent by the PC over Wi-Fi)
  const pullTransfersFromPC = async () => {
    if (isSyncing || !serverUrl || !sessionToken) return;
    setIsSyncing(true);
    console.log("Iniciando puxamento de fila de transferências autorizadas do PC...");

    try {
      // 1. Fetch current tracks allowed for download on the PC
      const response = await fetch(`${serverUrl}/api/tracks`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });

      if (!response.ok) {
        throw new Error("Falha ao consultar biblioteca remota.");
      }

      const pcTracks: Track[] = await response.json();
      console.log(`Servidor PC possui ${pcTracks.length} faixas listadas.`);

      // 2. Filter tracks that are not already present in our local library
      const existingTitles = libraryTracksRef.current.map(t => t.title.toLowerCase());
      const tracksToDownload = pcTracks.filter(pt => !existingTitles.includes(pt.title.toLowerCase()));

      if (tracksToDownload.length === 0) {
        console.log("Nenhuma nova música para baixar. Biblioteca móvel em dia!");
        return;
      }

      console.log(`Baixando ${tracksToDownload.length} novas músicas via rede local Wi-Fi...`);

      // Initialize queue status
      const initialQueue: TransferTask[] = tracksToDownload.map(t => ({
        id: t.id,
        title: t.title,
        progress: 0,
        status: 'pending'
      }));
      setTransferQueue(initialQueue);

      // Create folder if missing
      const dirInfo = await FileSystem.getInfoAsync(MUSIC_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MUSIC_DIR, { intermediates: true });
      }

      // 3. Download files sequentially to prevent Wi-Fi bandwidth congestion
      for (const track of tracksToDownload) {
        const fileExt = track.format.toLowerCase() || 'mp3';
        const localAudioPath = MUSIC_DIR + `${track.title}.${fileExt}`;
        const localArtPath = MUSIC_DIR + `${track.title}.jpg`;

        setTransferQueue(prev => 
          prev.map(task => task.id === track.id ? { ...task, status: 'downloading', progress: 10 } : task)
        );

        try {
          // Download Audio File over Local Server Wi-Fi
          console.log(`[Wi-Fi Download] Baixando áudio: ${track.title}`);
          const audioDownloadUrl = `${serverUrl}/api/stream/${track.id}`;
          
          await FileSystem.downloadAsync(
            audioDownloadUrl,
            localAudioPath,
            { headers: { 'Authorization': `Bearer ${sessionToken}` } }
          );

          setTransferQueue(prev => 
            prev.map(task => task.id === track.id ? { ...task, progress: 60 } : task)
          );

          // Download Artwork Image via dedicated HTTP artwork endpoint (artworkUrl from PC is asset:// and unreachable)
          console.log(`[Wi-Fi Download] Baixando capa via /api/artwork: ${track.title}.jpg`);
          const artworkDownloadUrl = `${serverUrl}/api/artwork/${track.id}`;
          await FileSystem.downloadAsync(
            artworkDownloadUrl,
            localArtPath,
            { headers: { 'Authorization': `Bearer ${sessionToken}` } }
          ).catch((e) => {
            console.warn(`[Wi-Fi Download] Capa não encontrada para ${track.title}:`, e);
          });

          // Register in libraryTracks
          const freshTrack: Track = {
            ...track,
            localPath: localAudioPath,
            artworkUrl: localArtPath
          };

          setLibraryTracks(prev => {
            if (prev.some(t => t.title.toLowerCase() === freshTrack.title.toLowerCase())) return prev;
            const newList = [...prev, freshTrack];
            saveTracksToStorage(newList);
            return newList;
          });

          setTransferQueue(prev => 
            prev.map(task => task.id === track.id ? { ...task, status: 'completed', progress: 100 } : task)
          );

          console.log(`[Wi-Fi Sync] Baixada e integrada com sucesso: ${track.title}`);
        } catch (err: any) {
          console.error(`Falha no download via Wi-Fi da música ${track.title}:`, err);
          setTransferQueue(prev => 
            prev.map(task => task.id === track.id ? { ...task, status: 'failed', error: err.toString() } : task)
          );
        }
      }
    } catch (e) {
      console.error("Wi-Fi sync process failed:", e);
    } finally {
      setIsSyncing(false);
      // Scan folder once more to refresh directories
      scanLocalFolder();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        libraryTracks,
        currentTrack,
        isPlaying,
        playbackPosition,
        playbackDuration,
        playbackProgress,
        volume,
        playTrack,
        togglePlay,
        seekAudio,
        skipTrack,
        setVolume,
        isShuffle,
        toggleShuffle,
        repeatMode,
        toggleRepeatMode,
        scanLocalFolder,
        isScanning,
        device,
        serverUrl,
        pairingPin,
        sessionToken,
        isPairing,
        pairWithPC,
        disconnectDevice,
        transferQueue,
        isSyncing,
        pullTransfersFromPC,
        deleteTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
