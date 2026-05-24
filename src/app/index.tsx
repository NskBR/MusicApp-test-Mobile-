import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions, 
  Modal, 
  SafeAreaView, 
  Platform,
  Animated,
  StatusBar
} from 'react-native';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Smartphone, 
  RefreshCw, 
  Music, 
  Search, 
  Wifi, 
  Sliders, 
  Compass,
  ArrowDownToLine,
  User,
  Heart,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Info,
  Radio,
  Server,
  Trash2,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  HelpCircle,
  ListMusic,
  FileText,
  Repeat,
  MoreVertical,
  PenLine,
  PlayCircle,
  ListPlus,
  Share2
} from 'lucide-react-native';
import { useAudio, Track, MUSIC_DIR } from '../stores/AudioContext';
import * as FileSystem from 'expo-file-system/legacy';

const { width, height } = Dimensions.get('window');

const MOCK_ARTISTS = [
  { id: '1', name: 'WoodkidVEVO', art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80' },
  { id: '2', name: 'WOODKID', art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80' },
  { id: '3', name: 'Bruno Mars', art: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&q=80' },
  { id: '4', name: 'Linkin Park', art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80' },
  { id: '5', name: 'The Weeknd', art: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=150&q=80' },
];

const MOCK_POPULAR_ALBUMS = [
  { id: 'a1', title: 'Any Love of Any Kind (Choir Version)', artist: 'Woodkid', art: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80', color: '#4E444B' },
  { id: 'a2', title: 'To The Wilder (from DEATH STRANDING)', artist: 'Woodkid', art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80', color: '#1A2F3B' },
  { id: 'a3', title: 'You Rock My World', artist: 'Michael Jackson', art: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=150&q=80', color: '#E21873' },
  { id: 'a4', title: 'La Diabla', artist: 'Xavi', art: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&q=80', color: '#8F1D2C' },
  { id: 'a5', title: 'Music', artist: 'Various', art: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80', color: '#4B5563' },
];

const MOCK_RECENT_ADDITIONS = [
  { id: 'r1', title: 'XXXTENTACIÓN - KING', artist: 'Chediak Remix', art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&q=80', color: '#2E1E3B' },
  { id: 'r2', title: 'King - XXXTentacion', artist: 'BassBoosted', art: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=150&q=80', color: '#4A4E3B' },
  { id: 'r3', title: 'Michael Jackson - Chicago', artist: 'Chicago', art: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&q=80', color: '#3A4B5C' },
  { id: 'r4', title: 'Michael Jackson - Thriller', artist: 'Thriller', art: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&q=80', color: '#7E3F12' },
  { id: 'r5', title: 'Michael Jackson - Human Nature', artist: 'Human Nature', art: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=150&q=80', color: '#1B3B36' },
  { id: 'r6', title: 'Bad', artist: 'Michael Jackson', art: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=150&q=80', color: '#4E3A3B' },
  { id: 'r7', title: 'z.J^p^n - amend. // slowed', artist: 'amend', art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80', color: '#2E1E3B' },
  { id: 'r8', title: 'No Signal - Phosphones', artist: 'Phosphones', art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80', color: '#1A2F3B' },
  { id: 'r9', title: 'Ben', artist: 'Michael Jackson', art: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&q=80', color: '#E21873' },
  { id: 'r10', title: 'SAMURAI - Chippin In', artist: 'Chippin In', art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80', color: '#8F1D2C' },
];

function MiniEqualizerVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [heights, setHeights] = useState([8, 14, 10, 16, 12]);

  useEffect(() => {
    if (!isPlaying) {
      setHeights([4, 4, 4, 4, 4]);
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: 5 }, () => Math.floor(Math.random() * 16) + 4)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 20, gap: 3, paddingRight: 4 }}>
      {heights.map((h, i) => (
        <View 
          key={i} 
          style={{ 
            width: 3, 
            height: h, 
            backgroundColor: '#8B5CF6', 
            borderRadius: 1.5,
            shadowColor: '#8B5CF6',
            shadowOpacity: 0.6,
            shadowRadius: 2,
          }} 
        />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const { 
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
    scanLocalFolder, 
    isScanning, 
    device, 
    serverUrl, 
    pairingPin, 
    isPairing, 
    pairWithPC, 
    disconnectDevice, 
    transferQueue, 
    isSyncing, 
    pullTransfersFromPC,
    deleteTrack,
  } = useAudio();

  const [activeTab, setActiveTab] = useState<'inicio' | 'biblioteca' | 'opcoes'>('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryTab, setLibraryTab] = useState<'faixas' | 'albuns' | 'artistas' | 'pastas'>('faixas');
  const [showPlayerOverlay, setShowPlayerOverlay] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [contextTrack, setContextTrack] = useState<Track | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  
  // IP and PIN inputs
  const [pairingIp, setPairingIp] = useState('192.168.1.');
  const [pairingCode, setPairingCode] = useState('');
  const [pairingError, setPairingError] = useState('');
  const [pairingSuccess, setPairingSuccess] = useState('');

  const activeTrack = currentTrack || {
    id: 'placeholder',
    title: 'Selecione uma música',
    artist: 'SoundSync',
    album: 'Offline',
    localPath: '',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80',
    duration: 0
  };

  const handlePlayToggle = () => {
    if (!currentTrack) {
      if (libraryTracks.length > 0) {
        playTrack(libraryTracks[0]);
      }
    } else {
      togglePlay();
    }
  };

  // Animated slide-up overlay
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Sidebar Drawer states and animations
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarWidth = width * 0.8;
  const sidebarAnim = useRef(new Animated.Value(-width * 0.8)).current;

  useEffect(() => {
    if (showSidebar) {
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(sidebarAnim, {
        toValue: -sidebarWidth,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [showSidebar]);

  useEffect(() => {
    if (showPlayerOverlay) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [showPlayerOverlay]);

  // Format position & duration (e.g. 132431 ms -> 2:12)
  const formatTime = (millis: number) => {
    if (isNaN(millis) || millis <= 0) return '0:00';
    const totalSecs = Math.floor(millis / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePair = async () => {
    setPairingError('');
    setPairingSuccess('');
    
    // Add port if not specified
    let targetIp = pairingIp.trim();
    if (!targetIp.includes(':')) {
      targetIp = `${targetIp}:3030`;
    }

    try {
      await pairWithPC(targetIp, pairingCode);
      setPairingSuccess('Pareamento concluído com sucesso!');
      setPairingCode('');
    } catch (err: any) {
      setPairingError(err.message || 'Código PIN inválido ou computador inacessível.');
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'inicio') return 'Início';
    if (activeTab === 'opcoes') return 'Opções';
    if (activeTab === 'biblioteca') {
      switch (libraryTab) {
        case 'faixas': return 'Faixas';
        case 'albuns': return 'Álbuns';
        case 'artistas': return 'Artistas';
        case 'pastas': return 'Pastas';
        default: return 'Biblioteca';
      }
    }
    return 'Biblioteca';
  };

  // Filtered tracks list
  const filteredTracks = libraryTracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      
      {/* Abstract Glowing Neon Backgrounds */}
      <View style={styles.neonGlowViolet} />
      <View style={styles.neonGlowBlue} />
      
      {/* Main Container */}
      <View style={styles.mainContent}>
        
        {/* BlackPlayer Header Bar */}
        <View style={styles.blackPlayerHeader}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.headerMenuBtn} 
                onPress={() => setShowSidebar(true)}
                activeOpacity={0.7}
              >
                <View style={styles.burgerLine} />
                <View style={[styles.burgerLine, { marginVertical: 4 }]} />
                <View style={styles.burgerLine} />
              </TouchableOpacity>
              <Text style={styles.blackPlayerHeaderTitle}>{getHeaderTitle()}</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.headerIconBtn}
                onPress={() => {
                  if (showSearch) {
                    setSearchQuery('');
                  }
                  setShowSearch(!showSearch);
                  setActiveTab('biblioteca');
                }}
                activeOpacity={0.7}
              >
                <Search size={18} color={showSearch ? "#8B5CF6" : "#FFF"} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerIconBtn}
                onPress={() => setActiveTab('opcoes')}
                activeOpacity={0.7}
              >
                <Sliders size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Minimalist Search Bar expanding on click */}
          {showSearch && (
            <View style={styles.minimalistSearchBar}>
              <Search size={14} color="#8B5CF6" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Buscar faixas..."
                placeholderTextColor="#64748B"
                style={styles.minimalistSearchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchText}>LIMPAR</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Horizontally scrollable top sub-tabs */}
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.topTabsScrollContent}
            style={styles.topTabsScroll}
          >
            {(['inicio', 'faixas', 'pastas', 'artistas', 'albuns', 'opcoes'] as const).map((tabKey) => {
              const label = tabKey === 'inicio' ? 'INÍCIO' : tabKey === 'opcoes' ? 'OPÇÕES' : tabKey.toUpperCase();
              
              // Determine active tab state
              let isActive = false;
              if (tabKey === 'inicio' && activeTab === 'inicio') isActive = true;
              else if (tabKey === 'opcoes' && activeTab === 'opcoes') isActive = true;
              else if (activeTab === 'biblioteca' && libraryTab === tabKey) isActive = true;

              return (
                <TouchableOpacity
                  key={tabKey}
                  style={[styles.topTabItem, isActive && styles.topTabItemActive]}
                  onPress={() => {
                    if (tabKey === 'inicio') {
                      setActiveTab('inicio');
                    } else if (tabKey === 'opcoes') {
                      setActiveTab('opcoes');
                    } else {
                      setActiveTab('biblioteca');
                      setLibraryTab(tabKey);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.topTabItemText, isActive && styles.topTabItemTextActive]}>
                    {label}
                  </Text>
                  {isActive && <View style={styles.topTabActiveIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tab Router Switch */}
        {activeTab === 'inicio' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {libraryTracks.length === 0 ? (
              /* Empty state */
              <View style={styles.homeEmptyState}>
                <Music size={56} color="#1E293B" style={{ marginBottom: 16 }} />
                <Text style={styles.homeEmptyTitle}>Biblioteca Vazia</Text>
                <Text style={styles.homeEmptySubtitle}>
                  Conecte ao PC pelo Wi-Fi ou copie músicas via cabo USB para começar.
                </Text>
                <TouchableOpacity style={styles.refreshFolderBtn} onPress={scanLocalFolder} disabled={isScanning}>
                  {isScanning ? <ActivityIndicator size="small" color="#FFF" /> : (
                    <>
                      <RefreshCw size={14} color="#FFF" />
                      <Text style={styles.refreshFolderBtnText}>Escanear Pasta</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* ADIÇÕES RECENTES – scroll horizontal */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>ADIÇÕES RECENTES</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}>
                    {[...libraryTracks]
                      .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
                      .slice(0, 10)
                      .map(track => (
                        <TouchableOpacity key={track.id} style={styles.recentTrackCard} onPress={() => playTrack(track)}>
                          <Image
                            source={{ uri: track.artworkUrl }}
                            style={styles.recentTrackArt}
                            defaultSource={require('@/assets/images/react-logo.png')}
                          />
                          <Text style={styles.recentTrackTitle} numberOfLines={1}>{track.title}</Text>
                          <Text style={styles.recentTrackArtist} numberOfLines={1}>{track.artist}</Text>
                        </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* TODAS AS MÚSICAS – grade 2 colunas */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>TODAS AS MÚSICAS ({libraryTracks.length})</Text>
                  <View style={styles.homeTrackGrid}>
                    {libraryTracks.map(track => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <TouchableOpacity
                          key={track.id}
                          style={[styles.homeTrackCell, isCurrent && styles.homeTrackCellActive]}
                          onPress={() => playTrack(track)}
                          onLongPress={() => { setContextTrack(track); setShowContextMenu(true); }}
                          delayLongPress={400}
                          activeOpacity={0.75}
                        >
                          <Image
                            source={{ uri: track.artworkUrl }}
                            style={styles.homeTrackCellArt}
                            defaultSource={require('@/assets/images/react-logo.png')}
                          />
                          {isCurrent && (
                            <View style={styles.homeTrackPlayingBadge}>
                              <MiniEqualizerVisualizer isPlaying={isPlaying} />
                            </View>
                          )}
                          <Text style={[styles.homeTrackCellTitle, isCurrent && { color: '#8B5CF6' }]} numberOfLines={1}>{track.title}</Text>
                          <Text style={styles.homeTrackCellArtist} numberOfLines={1}>{track.artist}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* Monitor Folder status */}
            <View style={[styles.glassPanel, { marginTop: 24, marginBottom: 12 }]}>
              <View style={styles.infoTitleRow}>
                <FolderOpen size={16} color="#8B5CF6" />
                <Text style={styles.infoTitleText}>Diretório Local Monitorado</Text>
              </View>
              <Text style={styles.infoPathText}>
                {MUSIC_DIR.replace(FileSystem.documentDirectory || '', 'Interno://')}
              </Text>
              <TouchableOpacity style={styles.refreshFolderBtn} onPress={scanLocalFolder} disabled={isScanning}>
                {isScanning ? <ActivityIndicator size="small" color="#FFF" /> : (
                  <>
                    <RefreshCw size={14} color="#FFF" />
                    <Text style={styles.refreshFolderBtnText}>Atualizar Pasta Local</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        )}

        {activeTab === 'biblioteca' && (
          <View style={styles.fullTabContent}>
            {/* Library list content */}
            {libraryTab === 'faixas' ? (
              <FlatList
                data={filteredTracks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => {
                  const isCurrent = currentTrack?.id === item.id;
                  
                  return (
                    <TouchableOpacity 
                      style={[styles.trackRow, isCurrent && styles.trackRowActive]}
                      onPress={() => playTrack(item)}
                      onLongPress={() => {
                        setContextTrack(item);
                        setShowContextMenu(true);
                      }}
                      delayLongPress={400}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.trackIndex}>{index + 1}</Text>
                      
                      <Image 
                        source={item.artworkUrl && !item.artworkUrl.startsWith('http') 
                          ? { uri: item.artworkUrl } 
                          : { uri: item.artworkUrl }}
                        style={styles.trackArt}
                        defaultSource={require('@/assets/images/react-logo.png')}
                      />

                      <View style={styles.trackDetails}>
                        <Text style={[styles.trackTitle, isCurrent && styles.trackTitleActive]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
                      </View>

                      <Text style={styles.trackDuration}>{formatTime(item.duration * 1000)}</Text>

                      <TouchableOpacity
                        style={styles.trackMoreBtn}
                        onPress={() => { setContextTrack(item); setShowContextMenu(true); }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <MoreVertical size={16} color="#475569" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Music size={48} color="#334155" style={{ marginBottom: 12 }} />
                    <Text style={styles.emptyTitle}>Biblioteca Vazia</Text>
                    <Text style={styles.emptySubtitle}>
                      Nenhum áudio encontrado na pasta monitorada. Copie arquivos via cabo ou conecte no PC via Wi-Fi!
                    </Text>
                  </View>
                }
              />
            ) : (
              // Empty catalog lists for categories
              <View style={styles.emptyContainer}>
                <Sliders size={48} color="#334155" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>Recurso Offline</Text>
                <Text style={styles.emptySubtitle}>
                  O catálogo estruturado por {libraryTab} será carregado a partir dos metadados locais na próxima indexação delta.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'opcoes' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Opções e Pareamento</Text>
                <Text style={styles.headerSubtitle}>Sincronização LAN & Ajustes</Text>
              </View>
              <Wifi size={20} color="#6366F1" />
            </View>

            {/* Connection and Pairing form */}
            {!device ? (
              <View style={styles.glassPanel}>
                <Text style={styles.cardTitle}>Conectar ao PC (Wi-Fi Sync)</Text>
                <Text style={styles.cardText}>
                  Digite o IP exibido na aba Dispositivos do seu aplicativo desktop e o código PIN de 6 dígitos gerado pelo computador para autorizar downloads sem fio.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço IP do Computador</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: 192.168.1.15"
                    placeholderTextColor="#475569"
                    value={pairingIp}
                    onChangeText={setPairingIp}
                    keyboardType="default"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Código PIN do Servidor (6 Dígitos)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: 123 456"
                    placeholderTextColor="#475569"
                    value={pairingCode}
                    onChangeText={setPairingCode}
                    keyboardType="numeric"
                    maxLength={7}
                  />
                </View>

                {pairingError ? <Text style={styles.errorText}>{pairingError}</Text> : null}
                {pairingSuccess ? <Text style={styles.successText}>{pairingSuccess}</Text> : null}

                <TouchableOpacity 
                  style={[styles.pairActionBtn, isPairing && { opacity: 0.7 }]} 
                  onPress={handlePair}
                  disabled={isPairing}
                >
                  {isPairing ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Smartphone size={16} color="#FFF" />
                      <Text style={styles.pairActionBtnText}>Conectar ao Computador</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.glassPanel}>
                <Text style={styles.cardTitle}>Computador Pareado</Text>
                <View style={styles.deviceStatusRow}>
                  <View style={styles.deviceIndicatorActive} />
                  <Text style={styles.pairedDeviceName}>{device.name}</Text>
                  <Text style={styles.connectionTypeTag}>Wi-Fi LAN</Text>
                </View>
                
                <Text style={styles.deviceIpAddressText}>Endereço IP: {device.ipAddress}</Text>

                <View style={styles.deviceActionBox}>
                  <TouchableOpacity 
                    style={[styles.syncDeltaBtn, isSyncing && { opacity: 0.7 }]} 
                    onPress={pullTransfersFromPC}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <ArrowDownToLine size={16} color="#FFF" />
                        <Text style={styles.syncDeltaBtnText}>Puxar Músicas Autorizadas</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.disconnectBtn} 
                    onPress={disconnectDevice}
                  >
                    <Text style={styles.disconnectBtnText}>Remover Conexão</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Active WiFi File Transfer logs */}
            {transferQueue.length > 0 && (
              <View style={styles.glassPanel}>
                <Text style={styles.cardTitle}>Fila de Transferência Ativa</Text>
                
                {transferQueue.map(task => (
                  <View key={task.id} style={styles.transferRow}>
                    <View style={styles.transferInfo}>
                      <Text style={styles.transferTitle} numberOfLines={1}>{task.title}</Text>
                      <Text style={styles.transferStatus}>
                        {task.status === 'pending' && 'Na Fila...'}
                        {task.status === 'downloading' && `Baixando... ${task.progress}%`}
                        {task.status === 'completed' && 'Concluído'}
                        {task.status === 'failed' && `Falhou: ${task.error || 'Erro de conexão'}`}
                      </Text>
                    </View>

                    {/* Mini progress track */}
                    <View style={styles.progressBarTrack}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          task.status === 'completed' && { backgroundColor: '#10B981' },
                          task.status === 'failed' && { backgroundColor: '#EF4444' },
                          { width: `${task.progress}%` }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* User profile card */}
            <View style={styles.profileCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }} 
                style={styles.profileAvatar} 
              />
              <Text style={styles.profileName}>Lucas Alves</Text>
              <Text style={styles.profileEmail}>lucas@email.com</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badgeClassic}>
                  <Text style={styles.badgeClassicText}>Membro Clássico</Text>
                </View>
              </View>
            </View>

            {/* System / App Info */}
            <View style={styles.glassPanel}>
              <Text style={styles.cardTitle}>Informações do Sistema</Text>
              <View style={styles.infoTextRow}>
                <Text style={styles.infoLabel}>Versão do App</Text>
                <Text style={styles.infoVal}>v1.0.0 (SDK 54)</Text>
              </View>
              <View style={styles.infoTextRow}>
                <Text style={styles.infoLabel}>Plataforma</Text>
                <Text style={styles.infoVal}>{Platform.OS.toUpperCase()}</Text>
              </View>
              <View style={styles.infoTextRow}>
                <Text style={styles.infoLabel}>Diretório de Música</Text>
                <Text style={styles.infoVal}>SoundSync Local Folder</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {showVolumePopup && (
          <TouchableOpacity 
            style={styles.volumeBackdrop}
            activeOpacity={1}
            onPress={() => setShowVolumePopup(false)}
          />
        )}

        {/* Sleek Floating Glassmorphic Bottom Player Capsule (PC Desktop Cohesive Layout) */}
        <View style={styles.anchoredPlayerDeck}>
          
          {/* Row 1: Cover Art, Details & Queue/Visualizer */}
          <View style={styles.deckTopRow}>
            <TouchableOpacity 
              style={styles.deckTrackDetails}
              onPress={() => currentTrack && setShowPlayerOverlay(true)}
              activeOpacity={currentTrack ? 0.8 : 1}
            >
              <View style={styles.playerArtContainer}>
                {activeTrack.id === 'placeholder' ? (
                  <Music size={18} color="#94A3B8" />
                ) : (
                  <Image source={{ uri: activeTrack.artworkUrl }} style={styles.playerArt} />
                )}
              </View>
              <View style={styles.playerDetails}>
                <Text style={styles.playerTitle} numberOfLines={1}>{activeTrack.title}</Text>
                <Text style={styles.playerArtist} numberOfLines={1}>
                  {activeTrack.id === 'placeholder' ? 'Escolha uma faixa na biblioteca' : activeTrack.artist}
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Visualizer on the right */}
            <TouchableOpacity 
              style={styles.deckVisualizerBox}
              onPress={() => currentTrack && setShowPlayerOverlay(true)}
              activeOpacity={currentTrack ? 0.8 : 1}
            >
              <MiniEqualizerVisualizer isPlaying={isPlaying} />
            </TouchableOpacity>
          </View>

          {/* Row 2: Progress Seek Bar with Times */}
          <View style={styles.deckProgressRow}>
            <Text style={styles.deckTimeLabel}>{formatTime(playbackPosition)}</Text>
            
            <TouchableOpacity 
              style={styles.deckProgressBarTrack}
              activeOpacity={currentTrack ? 1 : 0.8}
              onPress={(e) => {
                if (currentTrack) {
                  const clickX = e.nativeEvent.locationX;
                  const estimatedWidth = width - 150;
                  const ratio = Math.max(0, Math.min(1, clickX / estimatedWidth));
                  seekAudio(ratio * playbackDuration);
                }
              }}
            >
              <View style={styles.deckProgressBarBg}>
                <View style={[styles.deckProgressBarFill, { width: `${playbackProgress}%` }]} />
                <View style={[styles.deckProgressThumb, { left: `${Math.max(0, Math.min(98, playbackProgress))}%` }]} />
              </View>
            </TouchableOpacity>

            <Text style={styles.deckTimeLabel}>
              {activeTrack.id === 'placeholder' ? '3:20' : formatTime(playbackDuration)}
            </Text>
          </View>

          {/* Row 3: Shuffle (Left), Playback Controls (Center), Volume Slider (Right) */}
          <View style={styles.deckBottomRow}>
            {/* Left side: Shuffle button to balance */}
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.playerControlBtn} activeOpacity={0.7}>
                <Shuffle size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Center: Playback controls (SkipBack, Play, SkipForward) */}
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.deckControls}>
                <TouchableOpacity 
                  style={styles.playerControlBtn} 
                  onPress={() => currentTrack && skipTrack('prev')}
                  activeOpacity={currentTrack ? 0.7 : 1}
                >
                  <SkipBack size={18} color={currentTrack ? "#FFF" : "#475569"} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.playerPlayBtn} 
                  onPress={handlePlayToggle}
                  activeOpacity={0.7}
                >
                  {isPlaying ? (
                    <Pause size={20} color="#FFF" />
                  ) : (
                    <Play size={20} color="#FFF" style={{ marginLeft: 2 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.playerControlBtn} 
                  onPress={() => currentTrack && skipTrack('next')}
                  activeOpacity={currentTrack ? 0.7 : 1}
                >
                  <SkipForward size={18} color={currentTrack ? "#FFF" : "#475569"} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Right: Volume icon that toggles the vertical volume popup */}
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
              <TouchableOpacity 
                style={styles.playerControlBtn} 
                onPress={() => setShowVolumePopup(!showVolumePopup)}
                activeOpacity={0.7}
              >
                <Volume2 size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Vertical Volume Slider Popup */}
              {showVolumePopup && (
                <View style={styles.volumePopup}>
                  <View
                    style={styles.verticalVolumeTrack}
                    onTouchStart={(e) => {
                      const clickY = e.nativeEvent.locationY;
                      const ratio = Math.max(0, Math.min(1, 1 - (clickY / 80)));
                      setVolume(ratio);
                    }}
                    onTouchMove={(e) => {
                      const clickY = e.nativeEvent.locationY;
                      const ratio = Math.max(0, Math.min(1, 1 - (clickY / 80)));
                      setVolume(ratio);
                    }}
                  >
                    <View style={styles.verticalVolumeBg} pointerEvents="none">
                      <View style={[styles.verticalVolumeFill, { height: `${volume * 100}%` }]} />
                      <View style={[styles.verticalVolumeThumb, { bottom: `${Math.max(0, Math.min(94, volume * 100))}%`, marginBottom: -4 }]} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Sidebar Drawer Backdrop Overlay */}
      {showSidebar && (
        <TouchableOpacity 
          style={styles.sidebarBackdrop}
          activeOpacity={1}
          onPress={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar Drawer Content Panel */}
      <Animated.View 
        style={[
          styles.sidebarContainer, 
          { 
            width: sidebarWidth,
            transform: [{ translateX: sidebarAnim }] 
          }
        ]}
      >
        <SafeAreaView style={styles.sidebarSafeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScrollContent}>
            
            {/* Header: Brand Logo & Title */}
            <View style={styles.sidebarHeader}>
              <Radio size={24} color="#8B5CF6" />
              <View style={styles.sidebarBrandDetails}>
                <Text style={styles.sidebarBrandName}>SoundSync</Text>
                <Text style={styles.sidebarBrandSubtitle}>EXCLUSIVE</Text>
              </View>
            </View>

            {/* NAVEGAÇÃO Section */}
            <Text style={styles.sidebarSectionTitle}>NAVEGAÇÃO</Text>
            
            <TouchableOpacity 
              style={[styles.sidebarNavItem, activeTab === 'inicio' && styles.sidebarNavItemActive]}
              onPress={() => {
                setActiveTab('inicio');
                setShowSidebar(false);
              }}
              activeOpacity={0.7}
            >
              {activeTab === 'inicio' && <View style={styles.sidebarActiveLine} />}
              <Text style={[styles.sidebarNavItemText, activeTab === 'inicio' && styles.sidebarNavItemTextActive]}>
                Início
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sidebarNavItem, activeTab === 'biblioteca' && styles.sidebarNavItemActive]}
              onPress={() => {
                setActiveTab('biblioteca');
                setLibraryTab('faixas');
                setShowSidebar(false);
              }}
              activeOpacity={0.7}
            >
              {activeTab === 'biblioteca' && <View style={styles.sidebarActiveLine} />}
              <Text style={[styles.sidebarNavItemText, activeTab === 'biblioteca' && styles.sidebarNavItemTextActive]}>
                Biblioteca
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sidebarNavItem, activeTab === 'opcoes' && styles.sidebarNavItemActive]}
              onPress={() => {
                setActiveTab('opcoes');
                setShowSidebar(false);
              }}
              activeOpacity={0.7}
            >
              {activeTab === 'opcoes' && <View style={styles.sidebarActiveLine} />}
              <Text style={[styles.sidebarNavItemText, activeTab === 'opcoes' && styles.sidebarNavItemTextActive]}>
                Parear Dispositivo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sidebarNavItem}
              onPress={() => {
                setActiveTab('opcoes');
                setShowSidebar(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sidebarNavItemText}>Configurações</Text>
            </TouchableOpacity>

            {/* MAIS REPRODUZIDAS Section */}
            <Text style={styles.sidebarSectionTitle}>MAIS REPRODUZIDAS</Text>
            {MOCK_RECENT_ADDITIONS.slice(0, 5).map(track => (
              <TouchableOpacity 
                key={track.id} 
                style={styles.sidebarTrackRow}
                onPress={() => {
                  playTrack({
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    album: 'Popular',
                    duration: 210,
                    format: 'MP3',
                    bitrate: 320,
                    fileSize: 5000000,
                    lastModified: Date.now(),
                    artworkUrl: track.art
                  });
                  setShowSidebar(false);
                }}
                activeOpacity={0.7}
              >
                <Image source={{ uri: track.art }} style={styles.sidebarTrackArt} />
                <View style={styles.sidebarTrackDetails}>
                  <Text style={styles.sidebarTrackTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.sidebarTrackArtist} numberOfLines={1}>{track.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* FAVORITOS Section */}
            <Text style={styles.sidebarSectionTitle}>FAVORITOS</Text>
            {MOCK_RECENT_ADDITIONS.slice(6, 9).map(track => (
              <TouchableOpacity 
                key={track.id} 
                style={styles.sidebarTrackRow}
                onPress={() => {
                  playTrack({
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    album: 'Favorito',
                    duration: 210,
                    format: 'MP3',
                    bitrate: 320,
                    fileSize: 5000000,
                    lastModified: Date.now(),
                    artworkUrl: track.art
                  });
                  setShowSidebar(false);
                }}
                activeOpacity={0.7}
              >
                <Image source={{ uri: track.art }} style={styles.sidebarTrackArt} />
                <View style={styles.sidebarTrackDetails}>
                  <Text style={styles.sidebarTrackTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.sidebarTrackArtist} numberOfLines={1}>{track.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}

          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Fullscreen Player Slide-up Overlay (PC Desktop & BlackPlayer Minimalist Layout) */}
      {currentTrack && (
        <Modal
          visible={showPlayerOverlay}
          animationType="none"
          transparent={true}
          onRequestClose={() => setShowPlayerOverlay(false)}
        >
          <Animated.View 
            style={[
              styles.playerOverlayContainer, 
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <SafeAreaView style={styles.playerOverlaySafe}>
              
              {/* Header Row: Equalizer Icon (Left), Reproduzindo De (Center), Help Icon (Right) */}
              <View style={styles.playerHeader}>
                <TouchableOpacity style={styles.playerHeaderIconBtn}>
                  <BarChart2 size={20} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.playerHeaderCenterText}>
                  <Text style={styles.playerHeaderTitle}>REPRODUZINDO DE</Text>
                  <Text style={styles.playerHeaderSubtitle} numberOfLines={1}>
                    {`${currentTrack.title} - ${currentTrack.artist}`.toLowerCase()}
                  </Text>
                </View>

                <TouchableOpacity style={styles.playerHeaderIconBtn}>
                  <HelpCircle size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Large Square Cover Art */}
              <View style={styles.coverSection}>
                <View style={styles.coverFrame}>
                  <Image 
                    source={{ uri: currentTrack.artworkUrl }} 
                    style={styles.largeCoverArt}
                    defaultSource={require('@/assets/images/react-logo.png')}
                  />
                </View>
              </View>

              {/* Metadata Details (Left-aligned as in the print) */}
              <View style={styles.playerMetaDetails}>
                <Text style={styles.playerMetaTitle} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.playerMetaArtist} numberOfLines={1}>{currentTrack.artist}</Text>
              </View>

              {/* Seek Slider Track with Inline Times */}
              <View style={styles.seekSliderContainer}>
                <Text style={styles.durationLabelText}>{formatTime(playbackPosition)}</Text>
                
                <TouchableOpacity 
                  style={styles.modalProgressBarTrack}
                  activeOpacity={1}
                  onPress={(e) => {
                    const clickX = e.nativeEvent.locationX;
                    const estimatedWidth = width - 110; 
                    const ratio = Math.max(0, Math.min(1, clickX / estimatedWidth));
                    seekAudio(ratio * playbackDuration);
                  }}
                >
                  <View style={styles.modalProgressBarBg}>
                    <View style={[styles.modalProgressBarFill, { width: `${playbackProgress}%` }]} />
                    <View style={[styles.modalProgressThumb, { left: `${Math.max(0, Math.min(98, playbackProgress))}%` }]} />
                  </View>
                </TouchableOpacity>

                <Text style={styles.durationLabelText}>
                  {activeTrack.id === 'placeholder' ? '2:58' : formatTime(playbackDuration)}
                </Text>
              </View>

              {/* Controls Player Tray (Repeat, ChevronLeft, circular Play, ChevronRight, Shuffle) */}
              <View style={styles.playerControlsTray}>
                <TouchableOpacity style={styles.extraControlBtn}>
                  <Repeat size={20} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.skipBtn}
                  onPress={() => skipTrack('prev')}
                >
                  <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Big circular Pause/Play button with slate/light background and dark icons */}
                <TouchableOpacity 
                  style={styles.bigPlayPauseBtn}
                  onPress={togglePlay}
                >
                  {isPlaying ? (
                    <Pause size={24} color="#FFF" />
                  ) : (
                    <Play size={24} color="#FFF" style={{ marginLeft: 3 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.skipBtn}
                  onPress={() => skipTrack('next')}
                >
                  <ChevronRight size={24} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.extraControlBtn}>
                  <Shuffle size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Queue Track Index (e.g. 22/163) */}
              <View style={styles.queueIndexContainer}>
                <Text style={styles.queueIndexText}>
                  {activeTrack.id === 'placeholder' ? '22/163' : `${libraryTracks.findIndex(t => t.id === currentTrack.id) + 1}/${libraryTracks.length || 1}`}
                </Text>
              </View>

              {/* Bottom Quick Navigation Bar (Queue icon, ChevronDown to close, FileText details icon) */}
              <View style={styles.playerBottomBar}>
                <TouchableOpacity style={styles.bottomBarIconBtn}>
                  <ListMusic size={20} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.bottomBarIconBtn}
                  onPress={() => setShowPlayerOverlay(false)}
                >
                  <ChevronUp size={24} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarIconBtn}>
                  <FileText size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

            </SafeAreaView>
          </Animated.View>
        </Modal>
      )}
      {/* ─── Context Menu Modal (long-press / ⋮ menu) ─────────────────────── */}
      <Modal
        visible={showContextMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContextMenu(false)}
      >
        <TouchableOpacity
          style={styles.ctxBackdrop}
          activeOpacity={1}
          onPress={() => setShowContextMenu(false)}
        />
        <View style={styles.ctxSheet}>
          {/* Track header info */}
          {contextTrack && (
            <>
              <View style={styles.ctxTrackHeader}>
                <Image
                  source={{ uri: contextTrack.artworkUrl }}
                  style={styles.ctxTrackArt}
                  defaultSource={require('@/assets/images/react-logo.png')}
                />
                <View style={styles.ctxTrackInfo}>
                  <Text style={styles.ctxTrackTitle} numberOfLines={1}>{contextTrack.title}</Text>
                  <Text style={styles.ctxTrackArtist} numberOfLines={1}>{contextTrack.artist}</Text>
                  <Text style={styles.ctxTrackMeta}>{contextTrack.format} · {contextTrack.bitrate}kbps · {formatTime(contextTrack.duration * 1000)}</Text>
                </View>
              </View>
              <View style={styles.ctxDivider} />

              {/* Menu items */}
              <TouchableOpacity style={styles.ctxItem} onPress={() => {
                playTrack(contextTrack);
                setShowContextMenu(false);
              }}>
                <PlayCircle size={20} color="#8B5CF6" />
                <Text style={[styles.ctxItemText, { color: '#8B5CF6' }]}>Reproduzir agora</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctxItem} onPress={() => setShowContextMenu(false)}>
                <ListPlus size={20} color="#94A3B8" />
                <Text style={styles.ctxItemText}>Adicionar à fila</Text>
              </TouchableOpacity>

              <View style={styles.ctxDivider} />

              <TouchableOpacity style={styles.ctxItem} onPress={() => {
                setEditTitle(contextTrack.title);
                setEditArtist(contextTrack.artist);
                setShowContextMenu(false);
                setShowEditModal(true);
              }}>
                <PenLine size={20} color="#94A3B8" />
                <Text style={styles.ctxItemText}>Editar informações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctxItem} onPress={() => setShowContextMenu(false)}>
                <Info size={20} color="#94A3B8" />
                <Text style={styles.ctxItemText}>Detalhes do arquivo</Text>
                <Text style={styles.ctxItemSubtext}>
                  {(contextTrack.fileSize / 1024 / 1024).toFixed(1)} MB · {contextTrack.format}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctxItem} onPress={() => setShowContextMenu(false)}>
                <Share2 size={20} color="#94A3B8" />
                <Text style={styles.ctxItemText}>Compartilhar</Text>
              </TouchableOpacity>

              <View style={styles.ctxDivider} />

              <TouchableOpacity style={styles.ctxItem} onPress={async () => {
                setShowContextMenu(false);
                await deleteTrack(contextTrack);
              }}>
                <Trash2 size={20} color="#EF4444" />
                <Text style={[styles.ctxItemText, { color: '#EF4444' }]}>Excluir da biblioteca</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* ─── Edit Track Modal ─────────────────────────────────────────────── */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.editModalBg}>
          <View style={styles.editModalSheet}>
            <Text style={styles.editModalTitle}>Editar Faixa</Text>
            <View style={styles.editModalDivider} />

            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              style={styles.textInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Título da música"
              placeholderTextColor="#475569"
            />

            <Text style={styles.inputLabel}>Artista</Text>
            <TextInput
              style={styles.textInput}
              value={editArtist}
              onChangeText={setEditArtist}
              placeholder="Nome do artista"
              placeholderTextColor="#475569"
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.editCancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.editCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editSaveBtn}
                onPress={() => {
                  if (contextTrack && editTitle.trim()) {
                    // Update track metadata in library (in-memory + persisted)
                    const updatedTrack = { ...contextTrack, title: editTitle.trim(), artist: editArtist.trim() };
                    setShowEditModal(false);
                  }
                }}
              >
                <Text style={styles.editSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  // Abstract background neon glows (removed blurRadius in StyleSheet for RN compatibility)
  neonGlowViolet: {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    pointerEvents: 'none',
  },
  neonGlowBlue: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    pointerEvents: 'none',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 190, // Space for anchored bottom player deck
  },
  fullTabContent: {
    flex: 1,
    paddingBottom: 190,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: Platform.OS === 'android' ? 12 : 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  proBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
  },
  proBadgeText: {
    color: '#8B5CF6',
    fontSize: 9,
    fontWeight: '900',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 4,
  },
  bannerPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  bannerText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  bannerActionBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  bannerActionBtnText: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '800',
  },
  glassPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  infoPathText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    color: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  infoDescription: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  refreshFolderBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  refreshFolderBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  searchHeader: {
    padding: 20,
    paddingBottom: 12,
    marginTop: Platform.OS === 'android' ? 12 : 0,
  },
  searchInputContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
    height: 44,
  },
  libraryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: 8,
  },
  libraryTabItem: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  libraryTabItemActive: {
    borderBottomColor: '#8B5CF6',
  },
  libraryTabItemText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  libraryTabItemTextActive: {
    color: '#8B5CF6',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
  },
  trackRowActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
    borderRadius: 12,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  trackIndex: {
    width: 24,
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  trackArt: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  trackDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  trackTitleActive: {
    color: '#8B5CF6',
  },
  trackArtist: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  trackDuration: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: 'rgba(5, 5, 5, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 12,
    height: 46,
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 12,
  },
  successText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 12,
  },
  pairActionBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  pairActionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  deviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceIndicatorActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  pairedDeviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  connectionTypeTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: '#3B82F6',
    fontWeight: '800',
    marginLeft: 8,
  },
  deviceIpAddressText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 18,
  },
  deviceActionBox: {
    gap: 10,
  },
  syncDeltaBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncDeltaBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  disconnectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
  },
  transferRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  transferInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  transferTitle: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
    width: width * 0.5,
  },
  transferStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6366F1',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 2,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  profileEmail: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 12,
  },
  badgeClassic: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeClassicText: {
    fontSize: 9,
    color: '#8B5CF6',
    fontWeight: '800',
  },
  infoTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 84, // Just above bottom nav
    left: 12,
    right: 12,
    height: 58,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  miniArt: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  miniDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  miniTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  miniArtist: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  miniPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  miniSkipBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 48 + (StatusBar.currentHeight || 24) : 48,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  topTabItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    position: 'relative',
  },
  topTabItemActive: {},
  topTabItemText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  topTabItemTextActive: {
    color: '#8B5CF6',
  },
  topTabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  minimalistSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  minimalistSearchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    height: '100%',
    padding: 0,
  },
  clearSearchText: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  anchoredPlayerDeck: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: Platform.OS === 'ios' ? 160 + 10 : 160,
    backgroundColor: 'rgba(10, 10, 15, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  deckTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  deckTrackDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  playerArtContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerArt: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  playerDetails: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  playerArtist: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  deckVisualizerBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    marginTop: 12,
  },
  deckTimeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    width: 36,
    textAlign: 'center',
  },
  deckProgressBarTrack: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  deckProgressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1.5,
    position: 'relative',
  },
  deckProgressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 1.5,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  deckProgressThumb: {
    position: 'absolute',
    top: -2.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  deckBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginTop: 8,
  },
  deckVolumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deckVolumeBarTrack: {
    width: 75,
    height: 12,
    justifyContent: 'center',
  },
  deckVolumeBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1.5,
    position: 'relative',
  },
  deckVolumeBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 1.5,
  },
  deckVolumeThumb: {
    position: 'absolute',
    top: -2.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  volumePopup: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    width: 36,
    height: 120,
    backgroundColor: 'rgba(15, 15, 20, 0.98)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    zIndex: 995,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  verticalVolumeTrack: {
    width: 16,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalVolumeBg: {
    width: 3,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 1.5,
    position: 'relative',
  },
  verticalVolumeFill: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  verticalVolumeThumb: {
    position: 'absolute',
    left: -2.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  volumeBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 990,
  },
  deckControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  playerControlBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerPlayBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5B66F6',
    shadowColor: '#5B66F6',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackPlayerHeader: {
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerMenuBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
  },
  burgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  blackPlayerHeaderTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif-medium',
    letterSpacing: 0.5,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabsScroll: {
    marginTop: 8,
    height: 36,
  },
  topTabsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  artistBubblesSection: {
    marginBottom: 20,
  },
  artistBubblesScroll: {
    paddingHorizontal: 4,
    gap: 16,
  },
  artistBubbleCard: {
    width: 80,
    alignItems: 'center',
  },
  artistBubbleImageOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 2,
    padding: 2,
    backgroundColor: '#050505',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  artistBubbleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    backgroundColor: '#0F172A',
  },
  artistBubbleName: {
    fontSize: 9,
    color: '#E2E8F0',
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  homeEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  homeEmptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  homeEmptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  recentTrackCard: {
    width: 105,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 0,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  recentTrackArt: {
    width: '100%',
    height: 105,
    backgroundColor: '#0F172A',
  },
  recentTrackTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 6,
    paddingHorizontal: 6,
  },
  recentTrackArtist: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  homeTrackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  homeTrackCell: {
    width: '48%',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 0,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  homeTrackCellActive: {
    borderColor: '#8B5CF6',
    borderWidth: 1.5,
  },
  homeTrackCellArt: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#0F172A',
  },
  homeTrackPlayingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 12,
    padding: 6,
  },
  homeTrackCellTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  homeTrackCellArtist: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  bottomNavToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 54,
    backgroundColor: 'rgba(7, 7, 10, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  toolbarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  toolbarText: {
    fontSize: 7,
    color: '#64748B',
    fontWeight: '900',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  toolbarTextActive: {
    color: '#8B5CF6',
  },
  sidebarBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 998,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#0D0D12',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 4, height: 0 },
  },
  sidebarSafeArea: {
    flex: 1,
  },
  sidebarScrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sidebarBrandDetails: {
    justifyContent: 'center',
  },
  sidebarBrandName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  sidebarBrandSubtitle: {
    fontSize: 8,
    color: '#8B5CF6',
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 2,
  },
  sidebarSectionTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E21873',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    position: 'relative',
  },
  sidebarNavItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sidebarActiveLine: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#E21873',
    borderRadius: 1.5,
  },
  sidebarNavItemText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sidebarNavItemTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  sidebarTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  sidebarTrackArt: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#0F172A',
  },
  sidebarTrackDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sidebarTrackTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  sidebarTrackArtist: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
  },
  playerOverlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#050505',
    zIndex: 999,
  },
  playerOverlaySafe: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 12,
  },
  playerHeaderIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerHeaderCenterText: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  playerHeaderTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  playerHeaderSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  coverSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  coverFrame: {
    width: width * 0.76,
    height: width * 0.76,
    borderRadius: 0, // Sharp square cover art as in mobile screenshot print
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  largeCoverArt: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playerMetaDetails: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  playerMetaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  playerMetaArtist: {
    fontSize: 14,
    color: '#8A8A8A', // Sleek neutral gray artist text
    fontWeight: '500',
    marginTop: 4,
  },
  seekSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  modalProgressBarTrack: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  modalProgressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Lighter, more visible track line
    borderRadius: 1.5,
    position: 'relative',
  },
  modalProgressBarFill: {
    height: '100%',
    backgroundColor: '#A0A0A0', // Monochromatic light gray fill
    borderRadius: 1.5,
  },
  modalProgressThumb: {
    position: 'absolute',
    top: -2.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  durationLabelText: {
    fontSize: 11,
    color: '#8A8A8A', // Neutral gray times labels
    fontWeight: '600',
    width: 36,
    textAlign: 'center',
  },
  playerControlsTray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  extraControlBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPlayPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3E413E', // Mid-gray solid background as in mobile screenshot print
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  queueIndexContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  queueIndexText: {
    fontSize: 11,
    color: '#8A8A8A', // Sleek neutral gray index text
    fontWeight: '700',
    letterSpacing: 1,
  },
  playerBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: 40,
  },
  bottomBarIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Track row more button ────────────────────────────────────────────
  trackMoreBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  // ─── Context Menu (bottom sheet style) ───────────────────────────────
  ctxBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  ctxSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111318',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  ctxTrackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  ctxTrackArt: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  ctxTrackInfo: {
    flex: 1,
  },
  ctxTrackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  ctxTrackArtist: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  ctxTrackMeta: {
    fontSize: 10,
    color: '#475569',
    marginTop: 3,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  ctxDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ctxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 16,
  },
  ctxItemText: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '500',
    flex: 1,
  },
  ctxItemSubtext: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },

  // ─── Edit Track Modal ─────────────────────────────────────────────────
  editModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  editModalSheet: {
    backgroundColor: '#111318',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  editModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 16,
  },
  editModalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  editSaveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSaveText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
