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
    let x: number = s.random(0, s.width);
    let y: number = s.random(0, s.height);

    s.setup = () => {
      s.createCanvas(canvasWidth(), 500);
      x = s.width / 2;
      y = s.height / 2;
      console.log("width: ", s.width);
    };

    // s.setup = () => s.createCanvas(1000, 660);
    s.draw = () => {
      s.background(100);
      console.log("x: ", x, "y: ", y);
      s.ellipse(x, y, diameter, diameter);
      s.fill(circleSketch.colour);
    };
    s.mousePressed = () => {
      let d = s.dist(s.mouseX, s.mouseY, x, y);
      if (d < 100) {
        console.log("pressed");
        x = x + s.random(-10, 10);
        y = y + s.random(-10, 10);
      }
      if (y < 0) {
        y = s.height;
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
