class NowPlaying extends HTMLElement {
  apiKey = "";
  constructor() {
    super();
    this.username = this.getAttribute("username");
  }

  connectedCallback() {
    this.render();
    this.fetchNowPlaying();

    this.startPolling();
  }

  disconnectedCallback() {
    // clean up when component is removed
    this.stopPolling();
  }

  startPolling() {
    // remove any previous
    this.stopPolling();

    // poll every 30 seconds
    this.pollInterval = setInterval(() => {
      this.fetchNowPlaying();
    }, 30_000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  render() {
    this.innerHTML = `
    <div class="text-sm inline-block" id="now-playing-content">
      Fetching tracks...
    </div>
    `;
  }

  async fetchNowPlaying() {
    if (!this.username) {
      return;
    }

    try {
      const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.username}&api_key=${this.apiKey}&format=json`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.log(data.message);
        return;
      }

      console.log(data);

      // check for list of tracks is available
      const tracks = data.recenttracks?.track;
      if (!tracks || tracks.length === 0) {
        this.showNotPlaying();
      }

      // get the first track in the list
      const track = Array.isArray(tracks) ? tracks[0] : tracks;
      const isNowPlaying = track["@attr"]?.nowplaying === "true";

      // update if track has changed to avoid unnecessary DOM updates
      const trackId = `${track.name}-${track.artist["#text"] || track.artist}`;
      if (this.currentTrackId !== trackId || this.isPlaying !== isNowPlaying) {
        this.currentTrackId = trackId;
        this.isPlaying = isNowPlaying;
        this.showTrack(track, isNowPlaying);
      }
    } catch (error) {
      console.error(error);
    }
  }

  showTrack(track, isNowPlaying) {
    console.log(`updating track`);
    const content = this.querySelector("#now-playing-content");
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-music"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v13" /><path d="M9 8h10" /></svg>`;
    const status = isNowPlaying ? "Now Playing" : "Last Played";

    const albumArt = track.image[2]["#text"]; // TODO: does last.fm provide fallback art if there is no artwork?

    content.innerHTML = `
    <div class="flex gap-x-3 items-center">
      <img width="72" height="72" src="${albumArt}" title="Album art for ${this.escapeHtml(track.album["#text"])}">
      <div>
        <div class="gap-x-1 inline-flex items-center">${icon} ${status}</div>
        <div class="font-bold">${this.escapeHtml(track.name)}</div>
        <div class="">${this.escapeHtml(track.artist["#text"] || track.artist)}</div>
      </div>
    </div>
    `;
  }

  showNotPlaying() {
    const content = this.querySelector("#now-playing-content");
    content.innerHTML = `
      <div>Nothing playing right now</div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Register the custom element
customElements.define("now-playing", NowPlaying);
