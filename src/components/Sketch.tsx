import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Inputs } from "./CircleSettings";

//TODO: make canvas size responsive to screen size
type SketchProps = {
  circleSketch: Inputs;
  jiggliness: number;
};

const Sketch: React.FC<SketchProps> = ({ circleSketch, jiggliness }) => {
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
    let n: number;
    let circles = [];

    s.setup = () => {
      s.createCanvas(canvasWidth(), 500);
      x = s.random(0, s.width);
      y = s.random(0, s.height);
    };

    s.draw = () => {
      s.background(50, 89, 100);
      n = 6;
      for (let i = 0; i < n; i++) {
        s.ellipse(x, y, diameter, diameter);
        s.fill(circleSketch.colour);
        x = x + s.random(-jiggliness, jiggliness);
        y = y + s.random(-3 * jiggliness, 3 * jiggliness);
        // in case it jiggles off screen:
        if (y < 0) {
          y = s.height;
        }
        if (x < 0) {
          x = s.width;
        }
      }
    };

    s.mousePressed = () => {
      let d = s.dist(s.mouseX, s.mouseY, x, y);
      if (d < diameter) {
        console.log("pressed");
        y = y + 50;
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
