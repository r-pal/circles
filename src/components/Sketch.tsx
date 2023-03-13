import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Inputs } from "./CircleSettings";

//TODO: make canvas size responsive to screen size
type SketchProps = {
  circleSketch: Inputs;
};

const Sketch: React.FC<SketchProps> = ({ circleSketch }) => {
  const diameter = circleSketch.radius * 2;
  const canvasWidth = () => {
    if (window.innerWidth > 200) {
      return window.innerWidth;
    } else return 200;
  };
  const canvasHeight = () => {
    if (window.innerHeight > 200) {
      return window.innerHeight;
    } else if (window.innerHeight < 500) {
      return 500;
    } else return 200;
  };

  const sketch = (s: P5CanvasInstance) => {
    let x: number;
    let y: number;

    s.setup = () => {
      s.createCanvas(canvasWidth(), 500);
      x = s.random(0, s.width);
      y = s.random(0, s.height);
      console.log("width: ", s.width);
    };

    // s.setup = () => s.createCanvas(1000, 660);
    s.draw = () => {
      s.background(100);
      s.ellipse(x, y, diameter, diameter);
      s.fill(circleSketch.colour);
      x = x + s.random(-1, 1);
      y = y + s.random(-1, 1);
    };

    s.mousePressed = () => {
      let d = s.dist(s.mouseX, s.mouseY, x, y);
      if (d < 100) {
        console.log("pressed");
      }
      if (y < 0) {
        y = s.height;
      }
      if (x < 0) {
        x = s.width;
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
