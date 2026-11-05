# Spotify Top Artists & Listening Insights

A single-page Spotify dashboard with PKCE authentication, top tracks, top artists, genre tags, shareable cards and playlist creation.

## Listening Insights

- **My Wrapped:** a six-slide recap of your top artist, track, genre (when Spotify provides it), top five artists and albums represented among your top tracks.
- **Artist ranking changes:** compares saved ranks across different dates; ↑ / ↓ indicators appear after a previous-day snapshot exists.
- **Recently played:** up to 50 recently played Spotify tracks, including their play time. Requires the `user-read-recently-played` OAuth scope; log out and reconnect to approve.
- **Top albums:** estimates album rankings from the albums represented in the user's top 50 tracks. These numbers **are not album stream counts**.
- **Timeline:** displays top artist ranks across daily browser snapshots, by Spotify account and time range.
- **Top genres:** uses genre tags actually returned by Spotify and offers editable, locally saved primary-genre labels for artists whose metadata is missing. Manual labels are identified as user classifications rather than Spotify data.

## Privacy and limitations

The site uses Spotify's OAuth PKCE flow. Access tokens are stored in sessionStorage. Daily ranking snapshots are kept in localStorage on your current browser, scoped to Spotify user ID and selected range. They are not synced across devices and are lost if site storage is cleared. There is no server-side data store.

Spotify's top-item API does not provide exact play counts or full listening history. Spotify has deprecated genre data on artist records, so the genre view may be unavailable.

## Running

Host `index.html` and `insights.js` together using GitHub Pages or a local web server. Register the exact served page URL as a redirect URI in the Spotify Developer Dashboard. The OAuth client ID and redirect URI live in `index.html`; no client secret is required for PKCE.

If Spotify authorization permissions change, use Log out followed by Log in again.

## Login and refresh behaviour

A Spotify 401 response no longer refreshes the whole page. Instead, the app shows the login screen and asks you to authenticate again. On the first page load, the app waits until the listening-insights script is ready and fetches the user ID once before rendering statistics.

## Automatic genre detection

On **Top genres**, select **Detect genres for top 10 artists**. The app searches the public MusicBrainz artist database and classifies its genre and community tag metadata into broad genres. Requests are queued to respect MusicBrainz rate limiting, and results are cached on your device for 30 days. Spotify's genres, if provided, take precedence; your manually selected genre overrides both. Missing or ambiguous matches are left unclassified rather than invented. This is a metadata-driven classifier, **not a large language model**. Running a private AI model would require a secure backend, which this GitHub Pages app does not have. Public third-party services will see the searched artist names (not your Spotify login token).
