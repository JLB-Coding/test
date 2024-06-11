const ESP32_URL = "http://192.168.4.1/";
// const ESP32_URL = "http://192.168.178.115/";

function post(url, body)
{
  return fetch(url, {
    method: "POST",
    body: body,
  });
}

function sleep(ms)
{
  let end = Date.now() + ms;
  while (Date.now() < end);
}

function euclideanDistance2d(x1, x2, y1, y2)
{
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function angle(x1, x2, y1, y2)
{
  return Math.atan2(y2 - y1, x2 - x1);
}

function angleDegree(x1, x2, y1, y2)
{
  return angle(x1, x2, y1, y2) * (180/Math.PI);
}

function clamp(value, min, max)
{
  return Math.max(Math.min(value, max), min)
}

function ctxClearRect(ctx, x, y, w, h)
{
  ctx.clearRect(x, y, w, h);
}

function ctxDrawCircle(ctx, x, y, radius, fillStyle)
{
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function ctxDrawRect(ctx, x, y, w, h, fillStyle)
{
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}
