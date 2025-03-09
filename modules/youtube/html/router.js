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

    const htmlBeginnerVideos = await model.getVideosFromPlaylists(
      beginnerPlaylistIds
    );

    const htmlIntermediateVideos = await model.getVideosFromPlaylists(
      intermediatePlaylistIds
    );
    const htmlAdvancedVideos = await model.getVideosFromPlaylists(
      advancedPlaylistIds
    );

    const beginnerQuizzes = await quiz.getHtmlQuiz("easy");
    const intermediateQuizzes = await quiz.getHtmlQuiz("medium");
    const advancedQuizzes = await quiz.getHtmlQuiz("hard");
    response.render("index", {
      title: "Learn HTML & CSS",
      beginnerVideos: htmlBeginnerVideos,
      intermediateVideos: htmlIntermediateVideos,
      advancedVideos: htmlAdvancedVideos,
      easyQuizzes: beginnerQuizzes,
      mediumQuizzes: intermediateQuizzes,
      hardQuizzes: advancedQuizzes,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
