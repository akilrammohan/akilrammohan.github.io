const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = process.env.LASTFM_USERNAME;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmAlbum {
  name: string;
  artist: string;
  playcount: number;
  albumUrl: string;
  artistUrl: string;
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
      next: { revalidate: 3600 },
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

    const artistName = album.artist?.['#text'] || album.artist?.name || album.artist;
    const albumName = album.name;

    return {
      name: albumName,
      artist: artistName,
      playcount: parseInt(album.playcount) || 0,
      albumUrl: album.url || `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`,
      artistUrl: `https://www.last.fm/music/${encodeURIComponent(artistName)}`,
    };
  } catch (error) {
    console.error('Error fetching Last.fm top album:', error);
    return null;
  }
}
