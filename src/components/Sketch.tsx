import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Colour } from "./Types";

type SketchProps = {
  radius: number;
  colour: Colour;
};

const Sketch: React.FC<SketchProps> = ({ radius, colour }) => {
  const diameter = radius * 2;

  function sketch(p5: P5CanvasInstance) {
    p5.setup = () => p5.createCanvas(500, 500);
    p5.draw = () => p5.circle(30, 30, diameter);
  }

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
