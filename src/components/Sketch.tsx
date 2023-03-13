import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Inputs } from "./CircleSettings";

type SketchProps = {
  circleSketch: Inputs;
  jiggliness: number;
  setGameResult: (value: "won" | "lost" | undefined) => void;
};

const Sketch: React.FC<SketchProps> = ({
  circleSketch,
  jiggliness,
  setGameResult,
}) => {
  const diameter = circleSketch.radius * 2;
  const canvasWidth = () => {
    if (window.innerWidth > 200) {
      return window.innerWidth;
    } else return 200;
  };
  //h of component = h of window - header - settings - footer
  const componentHeight = window.innerHeight - 3 * 156;
  const canvasHeight = () => {
    if (componentHeight > 200) {
      return componentHeight;
    } else return 200;
  };

  const sketch = (s: P5CanvasInstance) => {
    let x: number;
    let y: number;
    let n: number;
    let circles = [];

    s.setup = () => {
      s.createCanvas(canvasWidth(), canvasHeight());
      x = s.random(0, s.width);
      y = s.random(s.height / 2, s.height / 3);
    };

    s.draw = () => {
      s.background(50, 89, 100);
      console.log(s.height);
      n = 6;
      for (let i = 0; i < n; i++) {
        s.ellipse(x, y, diameter, diameter);
        s.fill(circleSketch.colour);
        // jiggling
        x = x + s.random(-jiggliness, jiggliness);
        y = y + s.random(-jiggliness, jiggliness);
        // lose condition
        if (y < 0) {
          setGameResult("lost");
        }
        // win condition
        if (y >= s.height) {
          setGameResult("won");
        }
        // in case it jiggles off screen x-axis:
        if (x < 0) {
          x = s.width;
        }
        //
        y = y - 1;
      }
    };

    s.mousePressed = () => {
      let d = s.dist(s.mouseX, s.mouseY, x, y);
      if (d < diameter) {
        console.log("pressed");
        y = y + 100;
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
