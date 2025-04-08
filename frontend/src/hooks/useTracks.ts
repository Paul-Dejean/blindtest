import { useState, useEffect } from 'react';

import axios from 'axios';

import { Track } from '~/types/track';

interface PlaylistTrack {
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

interface PlaylistTracksData {
  date: string;
  tracksByGenre: {
    [key: string]: PlaylistTrack[];
  };
}

interface UseTracksProps {
  genre?: string;
  numberOfTracks: number;
}

// Cache for iTunes search results
const iTunesCache = new Map<string, iTunesTrack | null>();

// Helper function to search iTunes API with rate limiting
const searchItunes = async (track: PlaylistTrack): Promise<iTunesTrack | null> => {
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
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTracksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  // Fetch tracks from JSON file
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get<PlaylistTracksData>(
          'https://blindtest.pauldejean.dev/tracks.json'
        );
        console.log('set tracks');
        setPlaylistTracks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tracks'));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Get tracks based on genre
  let selectedTracks: PlaylistTrack[] = [];

  if (genre === 'all' && playlistTracks) {
    // If genre is 'all', combine all tracks from all genres
    const allTracks = Object.values(playlistTracks.tracksByGenre || {}).flat();
    selectedTracks = shuffleArray(allTracks);
  } else if (playlistTracks?.tracksByGenre[genre]) {
    // If specific genre, get tracks from that genre
    selectedTracks = shuffleArray(playlistTracks.tracksByGenre[genre]);
  }

  // Take the specified number of tracks

  // Fetch iTunes data for each track
  useEffect(() => {
    const fetchItunesData = async () => {
      // Only fetch if tracks, genre, or numberOfTracks have changed

      setLoading(true);
      try {
        // Process tracks in batches to avoid overwhelming the API

        const allTracks: iTunesTrack[] = [];
        for (const track of selectedTracks) {
          const result = await searchItunes(track);
          if (result !== null) {
            allTracks.push(result);
            if (allTracks.length === numberOfTracks) {
              break;
            }
          }

          // Add a small delay between batches

          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const convertedTracks: Track[] = allTracks.map((track) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: {
            name: track.artistName,
          },
          album: {
            title: track.collectionName,
            coverMedium: track.artworkUrl100,
          },
          duration: track.trackTimeMillis,
          preview: track.previewUrl,
        }));

        setTracks(convertedTracks);

        // Update refs
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch iTunes data'));
      } finally {
        setLoading(false);
      }
    };

    fetchItunesData();
  }, [genre, numberOfTracks, playlistTracks]);

  return {
    tracks,
    isLoading: loading,
    error,
  };
};
