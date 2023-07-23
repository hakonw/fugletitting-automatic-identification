console.log("Extension active");

var urls = [];

function logAndPass(thing) {
  console.log(thing);
  return thing;
}

function fetchSound(url) {
  let request = new Request(url, {
    method: "GET",
    mode: "cors",
  });
  return fetch(request);
}

function blobToBirnet(blob) {
  var fd = new FormData();
  fd.append("upload", blob, "0e97ce72c692e3e4fd2fe1d4f5c138db9dc392a8.mp3");

  return fetch("https://birdnet.cornell.edu/api/upload", {
    headers: {
      accept: "*/*",
      "accept-language": "no,en-US;q=0.9,en;q=0.8,nb;q=0.7",
      "sec-ch-ua":
        '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://birdnet.cornell.edu/api/",
    credentials: "omit",
    method: "POST",
    body: fd,
    mode: "no-cors",
  });
}

function processBirdnetResponse(analysis) {
  const maxAmount = 10;

  let prediction = analysis.prediction[0];

  let result = [];

  let p_keys = Object.keys(prediction);

  for (var i = 0; i < Math.min(p_keys.length, maxAmount); i++) {
    let species = prediction[p_keys[i]].species;
    let score = parseFloat(prediction[p_keys[i]].score);

    let name = species.split(";")[0];
    let scientificName = species.split(";")[1];
    result.push({
      score: score,
      name: name,
      species: scientificName, // May be empty
      valid:
        name != "Noise" &&
        name != "Other" &&
        name != "Human" &&
        name != "Unknown Species",
    });
  }

  return result;
}

function sendToContentScript(tabId, scores) {
  chrome.tabs.sendMessage(tabId, scores);
}

function processWebRequest(details) {
  var url = details.url;
  var tabId = details.tabId;
  if (urls.includes(url)) {
    return;
  }

  console.log("Got request", details);
  urls.push(url);

  // Currently no good way to look at the request response
  // So fetch the sound again, but this time on our terms
  fetchSound(url)
    .then((t) => logAndPass(t))
    .then((response) => response.blob())
    .then((t) => logAndPass(t))
    .then((blob) => blobToBirnet(blob))
    .then((response) => response.json())
    .then((t) => logAndPass(t))
    .then((analysis) => processBirdnetResponse(analysis))
    .then((t) => logAndPass(t))
    .then((response) => sendToContentScript(tabId, response));
}

chrome.webRequest.onCompleted.addListener(
  (details) => processWebRequest(details),
  { urls: ["https://quiz.natureid.no/*.mp3"] }
);
