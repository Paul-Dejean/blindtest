import { useState, useEffect } from 'react';
import { Track } from '../types/track';
import { isCorrectGuess } from '../utils/stringComparison';
import { getGenreId, ITUNES_GENRES } from '../utils/itunesGenres';

// Update Genre type to include all available genres from our mapping
type Genre = keyof typeof ITUNES_GENRES | 'all';

interface UseTracksProps {
  genre?: Genre;
}

export const useTracks = ({ genre = 'all' }: UseTracksProps = {}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the iTunes genre ID
        const genreId = getGenreId(genre);

        // Build the API URL based on whether we have a specific genre or not
        let apiUrl;
        if (genre === 'all') {
          apiUrl = `https://itunes.apple.com/search?term=popular&entity=song&limit=50`;
        } else {
          apiUrl = `https://itunes.apple.com/search?term=${genre.toLowerCase()}&entity=song&genreIndex=${genreId}&limit=50`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
          setError(`Failed to fetch tracks: ${response.status}`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          setError('No tracks found. Please try again.');
          setIsLoading(false);
          return;
        }

        // Map iTunes results to our Track interface
        const tracksWithPreview = data.results
          .filter((track: any) => track.previewUrl) // Ensure tracks have preview URLs
          .map((track: any) => ({
            id: track.trackId.toString(),
            title: track.trackName,
            artist: {
              name: track.artistName,
            },
            album: {
              title: track.collectionName || '',
              cover_medium: track.artworkUrl100,
            },
            duration: Math.floor(track.trackTimeMillis / 1000), // Convert to seconds
            preview: track.previewUrl,
          }));

        // Remove duplicate tracks using isCorrectGuess for comparison
        const uniqueTracks = tracksWithPreview.reduce((acc: Track[], current: Track) => {
          const isDuplicate = acc.some(
            (track) =>
              isCorrectGuess(track.title, current.title) ||
              isCorrectGuess(track.artist.name, current.artist.name)
          );

          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);

        setTracks(uniqueTracks);
      } catch (err) {
        setError('Failed to load tracks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [genre]);

  return { tracks, isLoading, error };
};
