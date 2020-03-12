function SpeechToText(callback) {
  var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.start();
  recognition.onresult = function (event) {
    var last = event.results.length - 1;
    var text = event.results[last][0].transcript;
    callback(text);
  };
}

function TextToSpeech(text, callback) {
  if ("speechSynthesis" in window) {
    var synth = window.speechSynthesis;
    synth.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.5;
    utterance.lang = "es-ES";
    utterance.onend = callback;
    synth.speak(utterance);
  }
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    var synth = window.speechSynthesis;
    synth.cancel();
  }
}

export { SpeechToText, TextToSpeech, stopSpeech }