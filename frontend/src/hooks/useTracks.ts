import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Track {
  name: string;
  artist: string;
}

interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
}

interface TracksData {
  date: string;
  tracksByGenre: {
    [key: string]: Track[];
  };
}

interface UseTracksProps {
  genre?: string;
  numberOfTracks: number;
}

// Cache for iTunes search results
const iTunesCache = new Map<string, iTunesTrack | null>();

// Helper function to search iTunes API with rate limiting
const searchItunes = async (track: Track): Promise<iTunesTrack | null> => {
  const cacheKey = `${track.name}-${track.artist}`;

  // Check cache first
  if (iTunesCache.has(cacheKey)) {
    return iTunesCache.get(cacheKey) || null;
  }

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: `${track.name} ${track.artist}`,
        entity: 'song',
        limit: 1,
      },
    });

    const result =
      response.data.results && response.data.results.length > 0 ? response.data.results[0] : null;

    // Cache the result
    iTunesCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error(`Error searching iTunes for track ${track.name}:`, error);
    return null;
  }
};

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useTracks = ({ genre = 'all', numberOfTracks }: UseTracksProps) => {
  const [tracks, setTracks] = useState<TracksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [iTunesTracks, setItunesTracks] = useState<iTunesTrack[]>([]);

  // Fetch tracks from JSON file
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get<TracksData>(
          'https://blindtest.pauldejean.dev/tracks.json'
        );
        console.log('set tracks');
        setTracks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tracks'));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Get tracks based on genre
  let selectedTracks: Track[] = [];

  if (genre === 'all' && tracks) {
    // If genre is 'all', combine all tracks from all genres
    const allTracks = Object.values(tracks.tracksByGenre).flat();
    selectedTracks = shuffleArray(allTracks);
  } else if (tracks?.tracksByGenre[genre]) {
    // If specific genre, get tracks from that genre
    selectedTracks = shuffleArray(tracks.tracksByGenre[genre]);
  }

  // Take the specified number of tracks

  // Fetch iTunes data for each track
  useEffect(() => {
    const fetchItunesData = async () => {
      // Only fetch if tracks, genre, or numberOfTracks have changed

      setLoading(true);
      try {
        // Process tracks in batches to avoid overwhelming the API

        const allResults: iTunesTrack[] = [];
        for (const track of selectedTracks) {
          const result = await searchItunes(track);
          if (result !== null) {
            allResults.push(result);
            if (allResults.length === numberOfTracks) {
              break;
            }
          }

          // Add a small delay between batches

          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        setItunesTracks(allResults);

        // Update refs
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch iTunes data'));
      } finally {
        setLoading(false);
      }
    };

    fetchItunesData();
  }, [genre, numberOfTracks, tracks]);

  return {
    tracks: iTunesTracks,
    isLoading: loading,
    error,
  };
};
