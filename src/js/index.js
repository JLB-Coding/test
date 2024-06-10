async function setContent(filename)
{
  const filenameResponse = await fetch(filename);
  if (!filenameResponse.ok)
  {
    console.error("Could not set body content.", `(status: ${filenameResponse.status})`);
    return;
  }

  const filenameContent = await filenameResponse?.text();
  contentContainer.innerHTML = filenameContent;
}

function screenIsLandscape()
{
  return screen.orientation.type === "landscape-primary";
}

function getElementByIdChecked(id)
{
  const result = document.getElementById(id);
  if (result == null) console.error(`Could not find element with id: "${id}"`);
  return result;
}

async function homeInit()
{
  await setContent("home.html");
  const autoDriveBtn = document.getElementById("auto-drive-btn");
  autoDriveBtn.addEventListener("click", async () => {
    await post(ESP32_URL + "toggle-self-driving");
  })
}

async function controlInit()
{
  await setContent("control.html");
  const joystickCanvas = getElementByIdChecked("joystick-canvas");
  joystickCanvas.width = 200;
  joystickCanvas.height = 200;

  console.assert(joystickCanvas.width === joystickCanvas.height);

  const joystickCtx = joystickCanvas.getContext("2d");
  joystickInit(joystickCanvas, joystickCtx);
  joystickUpdate();
  initLightButtons();
}

async function init()
{
  if (!screenIsLandscape()) await homeInit();
  else await controlInit();
}

window.addEventListener("DOMContentLoaded", async () => {
  contentContainer = getElementByIdChecked("content");
  await init();
});

screen.orientation.addEventListener("change", async () => {
  await init();
});
