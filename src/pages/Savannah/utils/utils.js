import {DATA_LINK} from '../../../constants/urlsRequests'

export function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function playSound(word){
  const audioSrc = DATA_LINK + word.audio;
  let audio = new Audio(audioSrc);
  let audioPromise = audio.play();
  if (audioPromise !== undefined) {
    audioPromise.then(_ => {
      audio.pause();
    })
      .catch(error => {
        console.log(error)
      });
  }
}
