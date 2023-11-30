re = /\((.*)\)/;

function getQuizButtonElements() {
  return document
    .getElementById("ifr")
    .contentWindow.document.getElementsByTagName("birdid-the-quiz-choices")[0]
    .getElementsByClassName("quizAnsSelectButton");
}

chrome.runtime.onMessage.addListener((birds, _, __) => {
  let quizButtonElements = getQuizButtonElements();

  Array.from(quizButtonElements).forEach((button) => {
    let text = button.innerText; // "Scops Owl\n(Otus scops)""
    let scientificName = text.match(re)[1].toLowerCase(); // Otus scops
    let bird = birds.find((b) => b.species.toLowerCase() == scientificName);
    if (bird != undefined) {
      button.innerText += "\n" + bird.score;
      if (bird.score == 1.0) {
        button.click();
      }
    }
  });
});
