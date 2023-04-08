// Gets random Int between 0 and 12
function getRandInt() {
  let min = 4;
  let max = 13;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function b64encode(input, times) {
  let out = input;
  for (let i = 0; i < times; i++) {
    out = btoa(out);
  }
  return btoa(times.toString()) + "$" + out;
}

function b64decode(input) {
  const splitIn = input.split("$");
  const times = Number(atob(splitIn[0]));
  let out = splitIn[1];
  for (let i = 0; i < times; i++) {
    out = atob(out);
  }
  return out;
}

function randSave(key, input) {
  const randInt = getRandInt();
  const encoded = b64encode(input, randInt);
  localStorage.setItem(key, encoded);
}

function randLoad(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  return b64decode(value);
}

const storageKey = "emoji-cool-awesome-124-game";
let gameRootEl = document.getElementById("game-body");
let counter = 0;
const localStorageValue = randLoad(storageKey);
counter = localStorageValue ?? counter;
counter = Number(counter);

const textStyle = new PIXI.TextStyle({
  fontFamily: "Helvetica",
  fontSize: Math.floor(80 * window.devicePixelRatio),
  fontWeight: "bold",
  fill: ["#f9f295", "#e0aa3e", "#faf398", "#b88a44"],
  letterSpacing: 4,
  stroke: "#000000",
  strokeThickness: Math.floor(10 * (window.devicePixelRatio / 2)),
  align: "center",
});

paint();
window.addEventListener("resize", (event) => {
  console.log("resizse");
  clear();
  paint();
});

function clear() {
  gameRootEl.innerHTML = "";
}

function paint() {
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.LINEAR;

  // Create the application helper and add its render target to the page
  let app = new PIXI.Application({
    background: "#fff",
    width: gameRootEl.clientWidth,
    height: gameRootEl.clientHeight,
  });
  gameRootEl.appendChild(app.view);

  // Create the sprite and add it to the stage
  const sW = app.screen.width / 2;
  const sH = app.screen.height / 2;
  let sprite = PIXI.Sprite.from("sprites/smile/smile-large.png");
  sprite.anchor.set(0.5);
  sprite.x = sW;
  sprite.y = sH;
  sprite.width = 300;
  sprite.height = 300;
  sprite.eventMode = "dynamic";
  sprite.cursor = "pointer";
  sprite.on("pointerdown", onSpriteClick);

  app.stage.addChild(sprite);

  const counterText = new PIXI.Text(counter.toString(), textStyle);
  counterText.anchor.set(0.5);
  counterText.x = sW;
  counterText.y = app.screen.height / 6;

  app.stage.addChild(counterText);

  /* let border = new PIXI.Graphics();
    border.lineStyle(2, 0xde3249, 1);
    border.drawRect(sW - 150, sH - 150, 300, 300);
    border.endFill();

    app.stage.addChild(border); */

  let isLockedSprite = false;

  function onSpriteClick() {
    const scaleFactor = 1.12;
    if (!isLockedSprite) {
      isLockedSprite = true;

      counter++;
      counterText.text = counter.toString();
      randSave(storageKey, counter.toString());

      sprite.scale.x *= scaleFactor;
      sprite.scale.y *= scaleFactor;

      setTimeout(() => {
        sprite.scale.x /= scaleFactor;
        sprite.scale.y /= scaleFactor;
        isLockedSprite = false;
      }, 100);
    }
  }
}
