# 📱 SoundSync Mobile — Player Offline & Wi-Fi Sync (Estilo BlackPlayer)

SoundSync Mobile é um aplicativo de música offline de altíssimo desempenho e design premium construído com **Expo (React Native)** e **TypeScript**. Ele foi desenhado sob a estética clássica e minimalista do consagrado *BlackPlayer*, apresentando cores escuras monocromáticas, fontes nítidas e navegação baseada em gestos.

O aplicativo integra-se perfeitamente ao servidor desktop do **SoundSync (Tauri + Rust)** via rede local (Wi-Fi), permitindo que você envie suas faixas baixadas e suas capas do computador direto para o celular sem a necessidade de cabos!

---

## 🎨 Principais Recursos & Destaques Visuais

### 1. Visual Monocromático Estilo BlackPlayer Premium
- **Capas Quadradas Perfeitas**: Sem cantos arredondados nas imagens (`borderRadius: 0`), mantendo o design retrô marcante das capas físicas.
- **Cabeçalhos Dinâmicos**: Título da aba ativa ("Início", "Faixas", etc.) e informações de reprodução formatadas em minúsculas (ex: `reproduzindo de: nome - artista`) simulando pixel-perfeitamente o mockup do usuário.
- **Seekbar e Deck Monocromáticos**: Barra de progresso pintada com tons neutros de cinza e branco semitransparente, com botão de Play/Pause contrastante cinza sólido (`#3E413E`) e ícone branco (`#FFF`).
- **Layout Centralizado**: Controles do player flutuante no rodapé centralizados geometricamente para máxima harmonia visual.

### 🔊 2. Controle de Volume por Gesto (Slide Vertical)
- Substitui os cliques secos de botões normais por um slider vertical sensível ao toque.
- Permite arrastar o dedo de forma contínua para ajustar o volume em tempo real, com cálculo de coordenadas estável.

### 🗂️ 3. Menu de Contexto Avançado (Long Press)
- Ao segurar o dedo sobre qualquer música na aba **Início** ou **Biblioteca**, abre um lindo menu flutuante inferior:
  - Exibe metadados completos da faixa: Capa, título, artista, taxa de bits, formato de arquivo, tamanho em MB e duração.
  - Ações rápidas: *Reproduzir Agora*, *Adicionar à fila*, *Editar Metadados* (abre modal animado para renomear título/artista), *Detalhes* e *Excluir da Biblioteca*.
  - **Exclusão Física Segura**: Excluir a música do menu remove o arquivo de áudio (`.mp3`/`.m4a`) e sua respectiva capa (`.jpg`) do armazenamento do celular imediatamente via `FileSystem`.

### 📡 4. Cliente de Sincronização Local (Wi-Fi Direct)
- Pareamento rápido usando teclado padrão para digitar o IP do PC e a porta de rede local (ex: `192.168.1.64:3030`) e o PIN de 6 dígitos.
- Baixa o áudio e a capa em lote do servidor local no PC, salvando-os de forma persistente.
- Suporte a Range Requests (HTTP 206) permitindo que você salte (seek) em qualquer ponto da faixa instantaneamente durante o streaming direto do PC.

### 🔬 5. Auto-Correção e Escaneamento Automático
- Scanner nativo que monitora a pasta `/SoundSync` no celular buscando novas faixas e salvando-as de forma resiliente em cache local com `@react-native-async-storage/async-storage` para carregamento instantâneo.
- **Auto-Healing de Duração**: O player lê dinamicamente a duração em milissegundos das músicas durante a reprodução física e corrige o cache automaticamente caso o valor importado esteja incorreto (ex: o padrão de `3:30`).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React Native, Expo SDK 54, TypeScript.
- **Roteamento**: `expo-router` (File-based navigation).
- **Áudio & Filesystem**: `expo-av` (reprodução de alta performance) e `expo-file-system/legacy` (gerenciamento e download físico).
- **Persistência**: AsyncStorage.
- **Ícones**: `lucide-react-native`.

---

## ⚡ Como Rodar o Projeto (Expo Go)

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npx expo start
   ```

3. **Abra o aplicativo no celular**:
   - Conecte o computador e o celular **na mesma rede Wi-Fi**.
   - Abra o app **Expo Go** (disponível na App Store ou Google Play).
   - Escaneie o QR Code exibido no terminal ou digite manualmente a URL local (ex: `exp://192.168.1.64:8081`).

---

## 🏗️ Estrutura do Código Modificado

- [app-celular/src/app/index.tsx](file:///c:/Users/Nsk/Documents/gemini/app-celular/src/app/index.tsx): O coração do aplicativo móvel, contendo as abas de navegação, a tela de Início atualizada com dados reais da biblioteca, modal do player maximizado estilo BlackPlayer, gesto vertical de volume, menu de contexto e o modal de edição de metadados.
- [app-celular/src/stores/AudioContext.tsx](file:///c:/Users/Nsk/Documents/gemini/app-celular/src/stores/AudioContext.tsx): Provedor de contexto global que gerencia o estado das músicas, scanner local, persistência no armazenamento, downloads via rede local Wi-Fi e controle físico de exclusão de arquivos e controle de áudio.
