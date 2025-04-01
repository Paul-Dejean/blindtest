import { useState, useEffect } from 'react';
import { Track } from '../types/track';
import { isCorrectGuess } from '../utils/stringComparison';

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Starting to fetch tracks from iTunes...');

        const response = await fetch(
          'https://itunes.apple.com/search?term=pop&entity=song&limit=50'
        );
        console.log('API Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error response:', errorText);
          setError(`Failed to fetch tracks: ${response.status}`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log(`Fetched ${data.results.length} tracks from iTunes`);

        if (!data.results || data.results.length === 0) {
          console.log('No tracks found');
          setError('No tracks found. Please try again.');
          setIsLoading(false);
          return;
        }

        // Map iTunes results to our Track interface
        const tracksWithPreview = data.results.map((track: any) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: {
            name: track.artistName,
          },
          album: {
            title: track.collectionName,
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

        console.log(`Found ${uniqueTracks.length} unique tracks with preview URLs`);
        setTracks(uniqueTracks);
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to load tracks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, isLoading, error };
};
