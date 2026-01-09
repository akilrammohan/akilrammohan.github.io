const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = process.env.LASTFM_USERNAME;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmAlbum {
  name: string;
  artist: string;
  playcount: number;
  albumUrl: string;
  artistUrl: string;
  imageUrl: string;
}

export interface LastFmTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  trackUrl: string;
  artistUrl?: string;
  albumUrl?: string;
  timestamp?: number;
  listenedAt?: number; // Unix timestamp when the track was played
}

export async function getRecentTracks(): Promise<LastFmTrack | null> {
  try {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: USERNAME!,
      api_key: API_KEY!,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.recenttracks?.track || data.recenttracks.track.length === 0) {
      return null;
    }

    const track = data.recenttracks.track[0];

    // Check if currently playing (has @attr.nowplaying)
    const isPlaying = track['@attr']?.nowplaying === 'true';

    // Get album image (prefer large size)
    const images = track.image || [];
    const albumImage = images.find((img: any) => img.size === 'large')?.['#text'] ||
                      images.find((img: any) => img.size === 'extralarge')?.['#text'] ||
                      images[images.length - 1]?.['#text'] || '';

    // Extract artist name and URL
    const artistName = track.artist?.['#text'] || track.artist;
    const artistUrl = track.artist?.url || `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

    // Extract album name and construct URL
    const albumName = track.album?.['#text'] || '';
    const albumUrl = albumName
      ? `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`
      : undefined;

    return {
      isPlaying,
      title: track.name,
      artist: artistName,
      album: albumName,
      albumImageUrl: albumImage,
      trackUrl: track.url,
      artistUrl,
      albumUrl,
      timestamp: Date.now(),
      listenedAt: track.date ? parseInt(track.date.uts) * 1000 : Date.now(),
    };
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return null;
  }
}

export async function getTopAlbumWeekly(): Promise<LastFmAlbum | null> {
  try {
    // Use weekly album chart with custom time range (last 7 days)
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 604800; // 7 days in seconds

    const params = new URLSearchParams({
      method: 'user.getweeklyalbumchart',
      user: USERNAME!,
      api_key: API_KEY!,
      format: 'json',
      from: sevenDaysAgo.toString(),
      to: now.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.weeklyalbumchart?.album || data.weeklyalbumchart.album.length === 0) {
      return null;
    }

    // Albums are already sorted by playcount, first one is most listened
    const album = data.weeklyalbumchart.album[0];

    // Weekly chart doesn't include images, so we need to fetch album info separately
    const artistName = album.artist?.['#text'] || album.artist?.name || album.artist;
    const albumName = album.name;

    // Fetch album info to get the image
    const infoParams = new URLSearchParams({
      method: 'album.getinfo',
      artist: artistName,
      album: albumName,
      api_key: API_KEY!,
      format: 'json',
    });

    const infoResponse = await fetch(`${BASE_URL}?${infoParams.toString()}`, {
      cache: 'no-store',
    });

    let imageUrl = '';
    if (infoResponse.ok) {
      const infoData = await infoResponse.json();
      const images = infoData.album?.image || [];
      imageUrl = images.find((img: any) => img.size === 'large')?.['#text'] ||
                 images.find((img: any) => img.size === 'extralarge')?.['#text'] ||
                 images[images.length - 1]?.['#text'] || '';
    }

    return {
      name: albumName,
      artist: artistName,
      playcount: parseInt(album.playcount) || 0,
      albumUrl: album.url || `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`,
      artistUrl: `https://www.last.fm/music/${encodeURIComponent(artistName)}`,
      imageUrl,
    };
  } catch (error) {
    console.error('Error fetching Last.fm top album:', error);
    return null;
  }
}
