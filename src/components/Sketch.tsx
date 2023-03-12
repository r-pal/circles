import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Inputs } from "./CircleSettings";

//TODO: make canvas size responsive to screen size
type SketchProps = {
  circleSketch: Inputs;
};

const Sketch: React.FC<SketchProps> = ({ circleSketch }) => {
  const diameter = circleSketch.radius * 2;

  function sketch(s: P5CanvasInstance) {
    // s.disableFriendlyErrors = true;
    s.setup = () => s.createCanvas(1000, 1000);
    s.draw = () => {
      s.circle(30, 30, diameter);
      s.fill(circleSketch.colour);
    };
  }

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
