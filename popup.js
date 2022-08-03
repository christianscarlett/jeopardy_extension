let buzzerButton = document.getElementById("buzzerButton");
let squares = Array.from(Array(9).keys()).map(id => document.getElementById("ts" + id));
let playPause = document.getElementById("playPause");

let buzzerButtonState = {
  pressed: false
};

let pressSpacebar = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: false },
    function: initPress,
  });
}

// Allow play/pause to play and pause the video
playPause.addEventListener("click", async () => {
  pressSpacebar();
});

// What happens when buzzer is pressed
buzzerButton.addEventListener("click", async () => {
  pressBuzzer();
});

let pressBuzzer = async () => {
  if (buzzerButtonState.pressed) {
    return; 
  }
  buzzerButtonState.pressed = true;
  pressSpacebar();
  setTimer(5000);
}

// Not sure this actually works
// // Also listen for the spacebar. Press the buzzer when space is pressed
// buzzerButton.addEventListener("keydown", async (event) => {
//   if (event.keyCode === 32) {
//     pressBuzzer();
//   }
// });

// Recursive f'n to set timer lights and reset buzzer state
let setTimer = (timeLeft) => {
  if (!buzzerButtonState.pressed) {
    setSquares(10, -1);
    return;
  }
  let offset = (5000 - timeLeft) / 1000
  let bottomSquare = Math.floor(offset);
  let topSquare = Math.ceil(8 - offset);
  setSquares(bottomSquare, topSquare);
  if (timeLeft > 0) {
    setTimeout(() => setTimer(timeLeft - 1000), 1000);
  } else {
    buzzerButtonState.pressed = false;
  }
};

// Helper to set sqaures between index i and j red, and the others black
let setSquares = (i, j) => {
  squares.forEach((square, k) => {
    let color = (i <= k && k <= j) ? 'red' : 'black';
    square.style.backgroundColor = color;
  });
};

let initPress = () => {
  let element = document.body;
  let event = new KeyboardEvent('keydown',{
    'keyCode':'32',
    'key': ' ',
    'code': 'Space',
    'target': document.body,
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
  });
  element.dispatchEvent(event);
};
