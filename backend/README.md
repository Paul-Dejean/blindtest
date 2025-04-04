# BlindTest Backend

This is the backend service for the BlindTest game. It includes a Lambda function that collects Spotify playlist data and stores it in S3.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Fill in the environment variables in `.env`:

- `SPOTIFY_CLIENT_ID`: Your Spotify API client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret
- `BUCKET_NAME`: The name of your S3 bucket

## Development

To run the function locally:

```bash
npm run start
```

## Deployment

To deploy to AWS:

```bash
npm run deploy
```

## Function Details

The `collectSpotifyPlaylists` function:

- Runs daily via a CloudWatch Event
- Collects data from several Spotify playlists
- Stores the playlist data in S3 with the following structure:
  - `playlists/{playlist_id}/{date}.json`

## Playlists Collected

The function collects data from the following Spotify playlists:

- Today's Top Hits
- New Music Friday
- Rock Classics
- Chill Hits
- Hip-Hop Central

## Error Handling

The function includes comprehensive error handling:

- Spotify API errors
- S3 storage errors
- Missing environment variables
- Network issues

Each playlist is processed independently, so if one fails, the others will still be processed.
