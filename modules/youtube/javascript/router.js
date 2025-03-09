// Import required modules
const express = require("express");
const router = express.Router();
const model = require("./func");
const quiz = require("./quiz");

router.get("/", async (request, response) => {
  try {
    const kidsPlaylistIds = await model.getKidsPlaylists();

    const beginnerPlaylistIds = await model.getFilteredPlaylists(
      kidsPlaylistIds,
      "beginner"
    );
    const intermediatePlaylistIds = await model.getFilteredPlaylists(
      kidsPlaylistIds,
      "intermediate"
    );
    const advancedPlaylistIds = await model.getFilteredPlaylists(
      kidsPlaylistIds,
      "advanced"
    );

    const javascriptBeginnerVideos = await model.getVideosFromPlaylists(
      beginnerPlaylistIds
    );
    const javascriptIntermediateVideos = await model.getVideosFromPlaylists(
      intermediatePlaylistIds
    );
    const javascriptAdvancedVideos = await model.getVideosFromPlaylists(
      advancedPlaylistIds
    );

    const beginnerJQuizzes = await quiz.getJavascriptQuiz("Easy");
    const intermediateJQuizzes = await quiz.getJavascriptQuiz("Medium");
    const advancedJQuizzes = await quiz.getJavascriptQuiz("Hard");
    response.render("javascript", {
      title: "Learn Javascript",
      beginnerVideos: javascriptBeginnerVideos,
      intermediateVideos: javascriptIntermediateVideos,
      advancedVideos: javascriptAdvancedVideos,
      easyJQuizzes: beginnerJQuizzes,
      mediumJQuizzes: intermediateJQuizzes,
      hardJQuizzes: advancedJQuizzes,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
