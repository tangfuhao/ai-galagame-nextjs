import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义音频管理器接口
interface AudioManagerContextType {
  playBg: (src: string, options?: { loop: boolean }) => void;
  pauseBg: () => void;
  stopBg: () => void;
  playDialogue: (src: string, options?: { loop: boolean }) => void;
  pauseDialogue: () => void;
  stopDialogue: () => void;
  setBackgroundVolume: (vol: number) => void;
  setDialogueVolume: (vol: number) => void;
}

// 创建音频管理器的上下文
const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

// 提供者组件，包裹应用或需要声音管理的部分
export function AudioManagerProvider({ children }: { children: ReactNode }) {
  const bgAudioRef = useRef(new Audio()); // 背景音乐音轨
  const dlgAudioRef = useRef(new Audio()); // 对话音轨
  const [bgVolume, setBgVolume] = useState(1); // 背景音量
  const [dlgVolume, setDlgVolume] = useState(1); // 对话音量

  // 播放背景音乐
  const playBg = (src: string, options = { loop: true }) => {
    src = src.replace("https://midreal-image-sh.", "");
    console.log("play bg", src);
    const audio = bgAudioRef.current;
    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.loop = options.loop ?? true;
      audio.volume = bgVolume;
      audio.crossOrigin = "anonymous";
    }
    audio.play();
  };

  const pauseBg = () => bgAudioRef.current.pause();
  const stopBg = () => {
    const audio = bgAudioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  // 播放角色对话
  const playDialogue = (src: string, options = { loop: false }) => {
    src = src.replace("https://midreal-image-sh.", "");
    console.log("play dialogue", src);
    const audio = dlgAudioRef.current;
    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.loop = options.loop ?? false;
      audio.volume = dlgVolume;
      audio.crossOrigin = "anonymous";
    }
    audio.play();
  };

  const pauseDialogue = () => dlgAudioRef.current.pause();
  const stopDialogue = () => {
    const audio = dlgAudioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  // 动态设置音量
  const setBackgroundVolume = (vol: number) => {
    setBgVolume(vol);
    bgAudioRef.current.volume = vol;
  };

  const setDialogueVolume = (vol: number) => {
    setDlgVolume(vol);
    dlgAudioRef.current.volume = vol;
  };

  // 卸载时清理
  useEffect(() => {
    return () => {
      bgAudioRef.current.pause();
      dlgAudioRef.current.pause();
    };
  }, []);

  return (
    <AudioManagerContext.Provider
      value={{
        playBg,
        pauseBg,
        stopBg,
        playDialogue,
        pauseDialogue,
        stopDialogue,
        setBackgroundVolume,
        setDialogueVolume,
      }}
    >
      {children}
    </AudioManagerContext.Provider>
  );
}

// 自定义 Hook，方便在组件中使用音频管理器
export function useAudioManager() {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error(
      "useAudioManager must be used within an AudioManagerProvider"
    );
  }
  return context;
}
