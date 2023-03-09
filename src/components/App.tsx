import { useState, useEffect } from "react";
import Sketch from "./Sketch";
import CircleSettings from "./CircleSettings";
import Footer from "./Footer";
import Header from "./Header";
import MousePosition from "./MousePosition";
import Table from "./Table";

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState({});
  const [circleStart, setCircleStart] = useState({});
  const [circleEnd, setCircleEnd] = useState({});
  const [clicked, setClicked] = useState(false);

  // const startCircleDraw = () => {
  //   //anchor circle start at coordintes
  //   setCircleStart(mousePos)
  // };

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: any) => {
      if (!clicked) {
        setCircleStart(mousePos);
      } else {
        setCircleEnd(mousePos);
      }
      setClicked(!clicked);
    };

    window.addEventListener("click", handleClick);

    // return () => {
    //   window.removeEventListener(
    //     'mousemove',
    //     handleMouseMove
    //   );
    // };
  });

  return (
    <>
      <Header />
      <div className="bg-teal-300 h-max">
        {/* <Table /> */}
        {/* <MousePosition
          mousePos={mousePos}
          circleStart={circleStart}
          circleEnd={circleEnd}
        /> */}
      </div>
      <div className="bg-cyan-300 h-max">
        <CircleSettings/>
        {/* <Sketch/> */}
      </div>
      <Footer clicked={clicked} />
    </>
  );
};

export default App;
