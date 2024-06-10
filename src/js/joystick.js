const JOYSTICK_STICK_RADIUS = 40;

const joystick = {
  canvas: null,
  ctx: null,

  requestStartTime: Date.now(),

  stickX: null,
  stickY: null,
  dragging: false,
};

function joystickTouchStart()
{
  joystick.dragging = true;
}

function joystickTouchMove(event)
{
  const rect = joystick.canvas.getBoundingClientRect();

  let x;
  let y;

  switch (event.type)
  {
    case "touchmove":
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
      break;
    case "mousemove":
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!joystick.dragging) return;
      break;
  }

  joystick.stickX = x;
  joystick.stickY = y;

  const maxDistance = joystick.canvas.width/2;
  while (euclideanDistance2d(joystick.canvas.width/2, joystick.stickX, joystick.canvas.height/2, joystick.stickY) >= maxDistance - JOYSTICK_STICK_RADIUS)
  {
    if (joystick.stickX < maxDistance)
    {
      joystick.stickX++;
    }
    else
    {
      joystick.stickX--;
    }

    if (joystick.stickY < maxDistance)
    {
      joystick.stickY++;
    }
    else
    {
      joystick.stickY--;
    }
  }

  joystickUpdate();
}

async function joystickTouchEnd()
{
  joystick.stickX = joystick.canvas.width / 2;
  joystick.stickY = joystick.canvas.height / 2;
  joystick.dragging = false;
  joystickUpdate();
  const distance = euclideanDistance2d(joystick.canvas.width/2, joystick.stickX, joystick.canvas.height/2, joystick.stickY) / (joystick.canvas.width/2 - JOYSTICK_STICK_RADIUS);
  await post(ESP32_URL + `move?angle=${encodeURIComponent("")}&distance=${encodeURIComponent(distance)}`);
}

function joystickInit(canvas, ctx)
{
  joystick.canvas = canvas;
  joystick.ctx = ctx;
  joystick.startTime = Date.now();

  joystickTouchEnd();

  canvas.addEventListener("touchstart", joystickTouchStart);
  canvas.addEventListener("mousedown", joystickTouchStart);
  canvas.addEventListener("touchmove", joystickTouchMove);
  canvas.addEventListener("mousemove", joystickTouchMove);
  canvas.addEventListener("touchend", joystickTouchEnd);
  canvas.addEventListener("mouseup", joystickTouchEnd);
}

async function joystickSendESP32()
{
  const degree = angleDegree(joystick.canvas.width/2, joystick.stickX, joystick.canvas.height/2, joystick.stickY);
  const distance = euclideanDistance2d(joystick.canvas.width/2, joystick.stickX, joystick.canvas.height/2, joystick.stickY) / (joystick.canvas.width/2 - JOYSTICK_STICK_RADIUS);

  console.log(degree);
  await post(ESP32_URL + `move?angle=${encodeURIComponent(degree)}&distance=${encodeURIComponent(distance)}`);
  joystick.requestStartTime = Date.now();
}

function joystickUpdate()
{
  ctxClearRect(joystick.ctx, 0, 0, joystick.canvas.width, joystick.canvas.height);
  ctxDrawCircle(joystick.ctx, joystick.canvas.width / 2, joystick.canvas.height / 2, joystick.canvas.width / 2, "#086080");

  { //- kd: Draw Joystick stick
    ctxDrawCircle(joystick.ctx, joystick.stickX, joystick.stickY, JOYSTICK_STICK_RADIUS, "#ffffff");
    ctxDrawCircle(joystick.ctx, joystick.stickX, joystick.stickY, JOYSTICK_STICK_RADIUS * 0.8, "#E9E9E9");
  }

  if (Date.now() - joystick.requestStartTime >= 50) joystickSendESP32();
}
