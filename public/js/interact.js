document.addEventListener("DOMContentLoaded", function () {
  let score = 0;
  let currentQuestionIndex = 0;

  const quizData = {
    beginner: window.easyQuizzes || [],
    intermediate: window.mediumQuizzes || [],
    advanced: window.hardQuizzes || [],
  };

  function closeQuizModal(closeButtonId, quizModalId) {
    const closeButton = document.getElementById(closeButtonId);
    const quizModal = document.getElementById(quizModalId);
    if (closeButton && quizModal) {
      closeButton.addEventListener("click", () => {
        quizModal.style.display = "none";
      });
    }
  }

  const beginnerCloseButton = document.getElementById(
    "beginner-close-quiz-btn"
  );
  const beginnerQuizModal = document.getElementById("beginner-quiz-modal");
  if (beginnerCloseButton && beginnerQuizModal) {
    beginnerCloseButton.addEventListener("click", () => {
      beginnerQuizModal.style.display = "none";
    });
  }

  const intermediateCloseButton = document.getElementById(
    "intermediate-close-quiz-btn"
  );
  const intermediateQuizModal = document.getElementById(
    "intermediate-quiz-modal"
  );
  if (intermediateCloseButton && intermediateQuizModal) {
    intermediateCloseButton.addEventListener("click", () => {
      intermediateQuizModal.style.display = "none"; // Close the modal
    });
  }

  
  const advancedCloseButton = document.getElementById(
    "advanced-close-quiz-btn"
  );
  const advancedQuizModal = document.getElementById("advanced-quiz-modal");
  if (advancedCloseButton && advancedQuizModal) {
    advancedCloseButton.addEventListener("click", () => {
      advancedQuizModal.style.display = "none";
    });
  }

  
  function setStartQuizButtonListener(category) {
    const quizBtn = document.getElementById(`start-quiz-btn-${category}`);
    if (quizBtn) {
      quizBtn.addEventListener("click", () => {
        startQuiz(category);
      });
    }
  }

  ["beginner", "intermediate", "advanced"].forEach(setStartQuizButtonListener);

  function startQuiz(category) {
    const quizModal = document.getElementById(`${category}-quiz-modal`);
    quizModal.style.display = "flex";
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById(`${category}-correct-score`).textContent = score;
    loadQuizData(category);
  }

  function loadQuizData(category) {
    const categoryQuizData = quizData[category] || [];
    if (categoryQuizData.length > 0) {
      console.log(categoryQuizData);
      loadQuestion(category);
    } else {
      showTryAgainMessage(category);
    }
  }

  function showTryAgainMessage(category) {
    const resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML = `
      <p>No questions available for this quiz category.</p>
      <button id="${category}-try-again-btn" class="btn-try-again">Try Again</button>
    `;
    document
      .getElementById(`${category}-try-again-btn`)
      .addEventListener("click", () => {
        score = 0;
        document.getElementById(`${category}-correct-score`).textContent =
          score;
        currentQuestionIndex = 0;
        loadQuizData(category);
      });

    document.getElementById(`${category}-next-question`).style.display = "none";
    document.getElementById(`${category}-check-answer`).style.display = "none";
  }

  function loadQuestion(category) {
    const categoryQuizData = quizData[category];
    if (currentQuestionIndex < categoryQuizData.length) {
      const currentQuestion = categoryQuizData[currentQuestionIndex];
      showQuestion(category, currentQuestion);
    } else {
      endQuiz(category);
    }
  }

  function showQuestion(category, data) {
    const questionElement = document.getElementById(`${category}-question`);
    const optionsList = document.getElementById(`${category}-quiz-options`);
    const checkAnswerButton = document.getElementById(
      `${category}-check-answer`
    );

    const answerKeys = Object.keys(data.answers).filter((key) =>
      key.startsWith("answer_")
    );
    let options = answerKeys
      .map((key) => ({
        key: key,
        value: data.answers[key],
      }))
      .filter((option) => option.value !== null);

    questionElement.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;

    function escapeHTML(text) {
      const element = document.createElement("div");
      if (text) {
        element.innerText = text;
        element.textContent = text;
      }
      return element.innerHTML;
    }

    optionsList.innerHTML = options
      .map(
        (option, index) => `
      <div class="quiz-option">
        <input type="radio" id="${category}-option-${index}" class="quiz-radio" value="${
          option.value
        }" data-key="${option.key}" />
        <label for="${category}-option-${index}">${escapeHTML(
          option.value
        )}</label>
      </div>
    `
      )
      .join("");

    checkAnswerButton.disabled = false;
    checkAnswerButton.addEventListener("click", () => checkAnswer(category));
  }

  function checkAnswer(category) {
    const selectedOption = document.querySelector(
      `#${category}-quiz-options input[type="radio"]:checked`
    );

    const checkAnswerButton = document.getElementById(
      `${category}-check-answer`
    );
    const nextQuestionButton = document.getElementById(
      `${category}-next-question`
    );

    if (selectedOption) {
      const selectedAnswerKey = selectedOption.getAttribute("data-key");
      const isCorrect = checkSelectedAnswer(
        selectedAnswerKey,
        quizData[category][currentQuestionIndex]
      );

      // Show the result
      showResult(category, isCorrect);

      checkAnswerButton.disabled = true;
      nextQuestionButton.style.display = "inline-block";

      nextQuestionButton.addEventListener("click", () => {
        currentQuestionIndex++;
        loadQuestion(category);
        nextQuestionButton.style.display = "none";
        checkAnswerButton.style.display = "inline-block";

        const resultElement = document.getElementById(`${category}-result`);
        if (resultElement) {
          resultElement.innerHTML = "";
        }
      });
    }
  }

  function checkSelectedAnswer(selectedAnswerKey, data) {
    const correctAnswerKey = `${selectedAnswerKey}_correct`;
    const correctAnswer = data.correct_answers[correctAnswerKey];
    return correctAnswer && correctAnswer.trim().toLowerCase() === "true";
  }

  function showResult(category, isCorrect) {
    const resultElement = document.getElementById(`${category}-result`);
    if (resultElement) {
      resultElement.innerHTML = isCorrect
        ? '<h4 class="icon-correct" style="font-weight: bold; margin-top: 5px; color: green;">Correct!</h4>'
        : '<h4 class="icon-incorrect" style="font-weight: bold; margin-top: 5px; color: red;">Incorrect!</h4>';
    }

    // Update the score
    if (isCorrect) {
      score++;
    }
    document.getElementById(`${category}-correct-score`).textContent = score;

    // Hide the "Check Answer" button after checking answer
    document.getElementById(`${category}-check-answer`).style.display = "none";
  }

  function endQuiz(category) {
    if (score < 5) {
      document.getElementById(`${category}-play-again`).style.display =
        "inline-block";
      alert("Your score is too low. Try again!");
    } else {
      alert("Congratulations! You passed the quiz!");
    }
  }
});
