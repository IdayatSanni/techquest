const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const quiz = "https://quizapi.io/api/v1/questions";
const apiKey = process.env.QUIZ_API_KEY;
const limit = 10;

async function getJavascriptQuiz(difficulty) {
  const reqUrl = `${quiz}?apiKey=${apiKey}&difficulty=${difficulty}&limit=${limit}&tags=JavaScript`;

  try {
    const response = await axios.get(reqUrl);
    

    const questions = response.data;

    if (questions && questions.length > 0) {
      
      return questions;
    } else {
      console.log("No quiz found for the specified parameters.");
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}


module.exports = {
  getJavascriptQuiz,
};
