import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import { S3 } from "aws-sdk";
import { SpotifyPlaylist, SpotifyTokenResponse } from "../types/spotify";
import util from "util";
// util.inspect.defaultOptions.depth = null;

const s3 = new S3();

enum MusicalGenre {
  POP = "Pop",
  ROCK = "Rock",
  HIP_HOP_RAP = "Hip-Hop/Rap",
  ELECTRONIC_EDM = "Electronic/EDM",
  JAZZ = "Jazz",
  CLASSICAL = "Classical",
  RNB_SOUL = "R&B/Soul",
  COUNTRY = "Country",
  REGGAE = "Reggae",
  LATIN = "Latin",
}

/**
 * Musical Genres with example artists:
 * - Pop: Catchy, mainstream music (e.g., Taylor Swift, Michael Jackson)
 * - Rock: Guitar-driven music (e.g., The Beatles, Queen, Nirvana)
 * - Hip-Hop/Rap: Rhythmic vocal style (e.g., Drake, Kendrick Lamar)
 * - Electronic/EDM: Synth-heavy, dance music (e.g., Calvin Harris, David Guetta)
 * - Jazz: Improvisational and instrumental (e.g., Miles Davis, Louis Armstrong)
 * - Classical: Orchestral compositions (e.g., Beethoven, Mozart)
 * - R&B/Soul: Smooth, emotional music (e.g., Beyoncé, Marvin Gaye)
 * - Country: Storytelling with acoustic elements (e.g., Johnny Cash, Taylor Swift)
 * - Reggae: Jamaican rhythmic music (e.g., Bob Marley)
 * - Latin: Diverse Latin genres (e.g., Bad Bunny, Shakira)
 */

interface Track {
  name: string;
  artist: string;
}

interface PlaylistDetail {
  playlistName: string;
  trackCount: number;
}

interface GenreResult {
  tracks: Track[];
  playlistDetails: PlaylistDetail[];
}

type TracksResponse = {
  [K in MusicalGenre]: Track[];
};

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
}

interface SpotifyPlaylistTrack {
  track: SpotifyTrack;
}

interface SpotifyPlaylistItem {
  id: string;
  name: string;
}

interface SpotifySearchResponse {
  playlists: {
    items: SpotifyPlaylistItem[];
  };
}

interface SpotifyTracksResponse {
  items: SpotifyPlaylistTrack[];
}

async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post<SpotifyTokenResponse>(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    throw error;
  }
}

async function storePlaylistInS3(playlist: SpotifyPlaylist): Promise<void> {
  const bucketName = process.env.BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Missing S3 bucket name");
  }

  const key = `playlists/${playlist.id}/${new Date().toISOString().split("T")[0]}.json`;

  try {
    await s3
      .putObject({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(playlist),
        ContentType: "application/json",
      })
      .promise();

    console.log(`Successfully stored playlist ${playlist.id} in S3`);
  } catch (error) {
    console.error(`Error storing playlist ${playlist.id} in S3:`, error);
    throw error;
  }
}

async function getPlaylistTracks(
  playlistId: string,
  token: string
): Promise<SpotifyPlaylistTrack[]> {
  try {
    const response = await axios.get<SpotifyTracksResponse>(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
          fields: "items(track(id,name,artists(name)))",
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error(`Error getting tracks for playlist ${playlistId}:`, error);
    throw error;
  }
}

async function searchPlaylists(
  query: string,
  token: string
): Promise<(SpotifyPlaylistItem | null)[]> {
  try {
    const response = await axios.get<SpotifySearchResponse>(
      `https://api.spotify.com/v1/search`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "playlist",
          limit: 20,
        },
      }
    );
    return response.data.playlists.items;
  } catch (error) {
    console.error(
      `Error searching for playlists with query "${query}":`,
      error
    );
    throw error;
  }
}

async function fetchTracksByGenre(
  genre: MusicalGenre,
  token: string
): Promise<GenreResult> {
  // Search for playlists by genre
  const playlists = await searchPlaylists(genre, token);
  console.log(`Found ${playlists.length} ${genre} playlists`);
  // console.log({ playlists });

  // Select 3 random playlists
  const shuffled = playlists.sort(() => 0.5 - Math.random());
  const selectedPlaylists = shuffled
    .filter(Boolean)
    .slice(0, 3) as SpotifyPlaylistItem[];
  console.log({ selectedPlaylists });

  // Get tracks from each selected playlist and format them
  const playlistTracks = await Promise.all(
    selectedPlaylists.map(async (playlist) => {
      console.log(playlist);
      if (!playlist.id || !playlist.name) {
        console.log("Invalid playlist data:", playlist);
        return null;
      }
      const tracks = await getPlaylistTracks(playlist.id, token);
      const simplifiedTracks: Track[] = tracks.map((item) => ({
        name: item.track.name,
        artist: item.track.artists[0].name, // Taking first artist if there are multiple
      }));

      return {
        playlistName: playlist.name,
        playlistId: playlist.id,
        tracks: simplifiedTracks,
      };
    })
  );

  // Filter out null values and create a single array of all tracks
  const validPlaylistTracks = playlistTracks.filter(
    (p): p is NonNullable<typeof p> => p !== null
  );
  const allTracks: Track[] = validPlaylistTracks.reduce((acc, playlist) => {
    return acc.concat(playlist.tracks);
  }, [] as Track[]);

  return {
    tracks: allTracks,
    playlistDetails: validPlaylistTracks.map((p) => ({
      playlistName: p.playlistName,
      trackCount: p.tracks.length,
    })),
  };
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get Spotify access token
    const token = await getSpotifyToken();

    // Fetch tracks for all genres
    const result: Partial<TracksResponse> = {};
    for (let genre of Object.values(MusicalGenre)) {
      const genreResult = await fetchTracksByGenre(genre, token);
      result[genre] = genreResult.tracks;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Store the results in S3
    const bucketName = process.env.BUCKET_NAME;
    if (!bucketName) {
      throw new Error("Missing S3 bucket name");
    }

    const date = new Date().toISOString().split("T")[0];
    const key = `tracks.json`;

    await s3
      .putObject({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify({
          date,
          tracksByGenre: result,
        }),
        ContentType: "application/json",
      })
      .promise();

    console.log(`Successfully stored tracks by genre in S3 at ${key}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully fetched and stored tracks from random playlists",
        s3Location: `s3://${bucketName}/${key}`,
        tracks: result,
      }),
    };
  } catch (error) {
    console.error("Error in collectSpotifyPlaylists:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to collect playlists",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
