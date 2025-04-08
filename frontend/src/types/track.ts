export interface Track {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    coverMedium: string;
  };
  duration: number;
  preview: string;
}

export interface TrackResult {
  track: Track;
  titleCorrect: boolean;
  artistCorrect: boolean;
  artistAnswerTime: number | null;
  titleAnswerTime: number | null;
}
