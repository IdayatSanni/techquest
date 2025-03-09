const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const youtube = "https://www.googleapis.com/youtube/v3";

async function getKidsPlaylists() {
  const reqUrl = `${youtube}/playlists?part=snippet&channelId=${process.env.channelId}&key=${process.env.API_KEY}`;

  try {
    const response = await axios.get(reqUrl);
    const data = response.data;

    if (data.items) {
      return data.items
        .filter((playlist) =>
          playlist.snippet.title.toLowerCase().includes("kids")
        )
        .map((playlist) => playlist.id);
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error fetching kids playlists: ${error.message}`);
    return [];
  }
}

async function getFilteredPlaylists(kidsPlaylistIds, level) {
  const reqUrl = `${youtube}/playlists?part=snippet&channelId=${process.env.channelId}&key=${process.env.API_KEY}`;

  try {
    const response = await axios.get(reqUrl);
    const data = response.data;

    if (data.items) {
      return data.items
        .filter((playlist) => {
          const title = playlist.snippet.title.toLowerCase();
          return (
            title.includes("javascript") &&
            title.includes(level) &&
            kidsPlaylistIds.includes(playlist.id)
          );
        })
        .map((playlist) => playlist.id);
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error fetching HTML ${level} playlists: ${error.message}`);
    return [];
  }
}

async function getVideosFromPlaylists(playlistIds) {
  const videoData = [];

  for (const id of playlistIds) {
    const reqUrl = `${youtube}/playlistItems?part=snippet&playlistId=${id}&key=${process.env.API_KEY}`;

    try {
      const response = await axios.get(reqUrl);
      const data = response.data;
      if (data.items) {
        const videoDetails = data.items.map((item) => {
          const thumbnail = item.snippet.thumbnails.standard;
          return {
            playlistTitle: item.snippet.playlistId,
            playlistUrl: `https://www.youtube.com/playlist?list=${item.snippet.playlistId}`,
            videoTitle: item.snippet.title,
            videoId: item.snippet.resourceId.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            thumbnailUrl: thumbnail.url,
            thumbnailWidth: thumbnail.width,
            thumbnailHeight: thumbnail.height,
          };
        });

        videoData.push(...videoDetails);
      } else {
        console.log("No videos found in playlist:", id);
      }
    } catch (error) {
      console.error(
        `Error fetching videos from playlist ${id}: ${error.message}`
      );
    }
  }

  return videoData;
}

module.exports = {
  getKidsPlaylists,
  getFilteredPlaylists,
  getVideosFromPlaylists,
};
