import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";

const Sketch = () => {

  function sketch(p5: P5CanvasInstance) {
    p5.setup = () => p5.line(15, 25, 70, 90);

  }

  return(<ReactP5Wrapper sketch={sketch} />)


};

export default Sketch;