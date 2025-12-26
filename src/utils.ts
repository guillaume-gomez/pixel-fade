function resizeImageCanvas(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
  // resize image
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);

  // resize to 50%
  canvasBuffer.width = originCanvas.width * 0.5;
  canvasBuffer.height = originCanvas.height * 0.5;
  contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

  const contextTarget = getContext(targetCanvas);

  targetCanvas.width = expectedWidth;
  targetCanvas.height = expectedHeight;

  // clear react before drawing resized image
  contextTarget.clearRect(0,0, expectedWidth, expectedHeight);
  contextTarget.drawImage(
    canvasBuffer,
    0,
    0,
    canvasBuffer.width * 0.5,
    canvasBuffer.height * 0.5,
    0,
    0,
    expectedWidth,
    expectedHeight
  );
}

function getContext(canvas:  HTMLCanvasElement) : CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if(!context) {
      throw new Error("cannot find the context 2d for the canvas");
  }
  return context;
}



export function resizeImage(image: HTMLImageElement, expectedWidth: number, expectedHeight : number) : HTMLImageElement {
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);

  canvasBuffer.width = image.width;
  canvasBuffer.height = image.height;
  contextBuffer.drawImage(image, 0, 0, canvasBuffer.width ,  canvasBuffer.height);

  const canvasTarget = document.createElement("canvas");

  // mutate canvasTarget
  resizeImageCanvas(canvasBuffer, canvasTarget, expectedWidth, expectedHeight);

  const resizedImage = new Image();
  
  resizedImage.width = expectedWidth;
  resizedImage.height = expectedHeight;

  resizedImage.onload = () => {};
  resizedImage.src = canvasTarget.toDataURL();
  return resizedImage;
}

function componentToHex(c: number) : string {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

export function rgbToHex(r: number, g: number, b: number) : string {
  return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

export function getAverageBackground(image: HTMLImageElement) : string {
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);
  
  canvasBuffer.width = image.width;
  canvasBuffer.height = image.height;
  
  contextBuffer.drawImage(image, 0, 0, image.width, image.height);

  const [red, green, blue] = averageColor(contextBuffer, image.width, image.height);
  return rgbToHex(...darkColor(red, green, blue, 100));
}

function darkColor(red : number, green : number, blue: number, amount: number): [number, number, number] { 
    const clamp = (val : number) : number => Math.max(val, 0);
    
    const r = clamp(red - amount)
    const g = clamp( green - amount)
    const b = clamp( blue - amount)
    
    return [r, g, b];
}

function averageColor(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height);
  
  let red = 0;
  let green = 0;
  let blue = 0;

  const numberOfPixels = imageData.data.length/4;

  for (let i = 0; i < imageData.data.length; i += 4) {
   red += imageData.data[i];
   green += imageData.data[i + 1];
   blue += imageData.data[i + 2];
  }

  const redComponent = (red) / numberOfPixels;
  const greenComponent = (green) / numberOfPixels;
  const blueComponent = (blue) / numberOfPixels;

  return [redComponent, greenComponent, blueComponent];
}
