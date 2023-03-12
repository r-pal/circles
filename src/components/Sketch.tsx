import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";

//TODO: make canvas size responsive to screen size

type SketchProps = {
  radius: number;
  colourHex: string;
};

const Sketch: React.FC<SketchProps> = ({ radius, colourHex }) => {
  const diameter = radius * 2;

  const sketch = (s: P5CanvasInstance) => {
    s.setup = () => s.createCanvas(1000, 1000);
    s.draw = () => {
      s.circle(30, 30, diameter);
      s.fill(colourHex);
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Sketch;
