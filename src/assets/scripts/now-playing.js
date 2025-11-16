class NowPlaying extends HTMLElement {
  constructor() {
    super();
    this.username = this.getAttribute("username");
    this.recents = this.getAttribute("recents") || false;
    this.refresh = this.getAttribute("refresh") || false;
  }

  connectedCallback() {
    this.render();
    this.fetchNowPlaying();

    if (this.refresh) {
      this.startPolling();
    }
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
    <div class="text-sm not-prose flex flex-col gap-y-2" id="now-playing-content">
      Fetching last.fm data...
    </div>
    `;
  }

  async fetchNowPlaying() {
    if (!this.username) {
      this.showError("Missing username");
      return;
    }

    try {
      const url = `https://now-playing-worker.flareon.workers.dev/api?username=${this.username}&limit=${this.recents ? "5" : "1"}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        this.showError("API call to last.fm failed, check the console");
        return;
      }

      const content = this.querySelector("#now-playing-content");

      // check for list of tracks is available
      const tracks = data.tracks;
      if (!tracks || tracks.length === 0) {
        content.innerHTML = this.getNotPlayingElement();
        return;
      }

      // get the first track in the list
      const track = Array.isArray(tracks) ? tracks[0] : tracks;
      const isNowPlaying = track["@attr"]?.nowplaying === "true";

      // update only if track has changed to avoid unnecessary DOM updates
      const trackId = `${track.name}-${track.artist["#text"] || track.artist}`;
      if (this.currentTrackId !== trackId || this.isPlaying !== isNowPlaying) {
        this.currentTrackId = trackId;
        this.isPlaying = isNowPlaying;

        const nowplayingEl = this.getNowPlayingElement(track, isNowPlaying);
        content.innerHTML = nowplayingEl;

        if (this.recents) {
          const recentTrackEl = this.getRecentTracksElement(tracks);
          content.innerHTML += recentTrackEl;
        }
      }
    } catch (error) {
      console.error(error);
      this.showError("Failed to load data");
    }
  }

  getNowPlayingElement(track, isNowPlaying) {
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-music"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v13" /><path d="M9 8h10" /></svg>`;
    const status = isNowPlaying ? "Now Playing" : "Last Played";

    const nowPlayingElement = `
    <div class="flex gap-x-3 items-center">
      ${this.albumArtElement(track, 72)}
      <div>
        <div class="gap-x-1 inline-flex items-center">${icon} ${status}</div>
        <div class="font-bold">${this.escapeHtml(track.name)}</div>
        <div class="">${this.escapeHtml(track.artist["#text"] || track.artist)}</div>
      </div>
    </div>
    `;

    return nowPlayingElement;
  }

  getRecentTracksElement(tracks) {
    const tracksElements = tracks.map((t) => this.trackAndAlbumListItem(t)).join("");
    const recentTracksElement = `
    <details>
      <summary>Recent Tracks</summary>
      <ul class="ml-2">
        ${tracksElements}
      </ul>
    </details>
    `;
    return recentTracksElement;
  }

  getNotPlayingElement() {
    return `Nothing playing right now`;
  }

  trackAndAlbumListItem(track) {
    return `
    <li class="flex my-2 gap-x-3 items-center">
      ${this.albumArtElement(track, 48)}
      <div>
        <div class="font-bold">${this.escapeHtml(track.name)}</div>
        <div>${this.escapeHtml(track.artist["#text"] || track.artist)}</div>
      </div>
    </li>
    `;
  }

  albumArtElement(track, size) {
    function getImageIndex(size) {
      const availableSizes = [34, 64, 174, 300];
      const index = availableSizes.findIndex((imageSize) => imageSize > size);
      return index !== -1 ? index : availableSizes.length - 1;
    }

    const imgElement = document.createElement("img");
    imgElement.src = track.image[getImageIndex(size)]["#text"] || this.albumArtFallback();
    imgElement.loading = "lazy";
    imgElement.className = "rounded-sm";
    imgElement.alt = `Album art for ${this.escapeHtml(track.album["#text"] || track.name)}`;
    imgElement.width = size;
    imgElement.height = size;

    return imgElement.outerHTML;
  }

  albumArtFallback() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-disc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M7 12a5 5 0 0 1 5 -5" /><path d="M12 17a5 5 0 0 0 5 -5" /></svg>`;
  }

  showError(message) {
    const content = this.querySelector("#now-playing-content");
    content.innerHTML = `
      <div class="text-red-500">⚠️ ${this.escapeHtml(message)}</div>
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
