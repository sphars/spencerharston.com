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
    <div class="text-gray-500">
      <div id="now-playing-content">Loading...</div>
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

      const tracks = data.recenttracks?.track;
      if (!tracks || tracks.length === 0) {
        this.showNotPlaying();
      }

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
    const status = isNowPlaying ? "🎵 Now playing" : "⏸️ Last played";

    content.innerHTML = `
      <div>${status}</div>
      <div>
        ${this.escapeHtml(track.name)} by ${this.escapeHtml(track.artist["#text"] || track.artist)}
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
