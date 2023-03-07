type CanvasProps = {};

const Canvas: React.FC<CanvasProps> = ({}) => {

    function setup() {
        createCanvas(400, 400);
      }
      
      function draw() {
        background(220);
        ellipse(50,50,80,80);
      }

  return <>
  {setup}{draw}</>;
};

export default Canvas;