export const speakText = (text) => {
  if (!("speechSynthesis" in window)) {
    alert("Voice is not supported in this browser");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
};

export const pauseVoice = () => {
  window.speechSynthesis.pause();
};

export const resumeVoice = () => {
  window.speechSynthesis.resume();
};

export const stopVoice = () => {
  window.speechSynthesis.cancel();
};