import { createContext, ReactNode, useState } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
}

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                hasNext,
                hasPrevious,
                isLooping,
                isShuffling,
                togglePlay,
                play,
                setPlayingState,
                playList,
                playNext,
                playPrevious,
                toggleLoop,
                toggleShuffle,
                clearPlayerState,
            }}>
            {children}
        </PlayerContext.Provider>
    )

}