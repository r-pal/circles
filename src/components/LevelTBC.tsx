import { useCallback, useEffect, useState } from "react";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import { Settings } from "./CircleSettings";

// NB level ideas
//  s.draw = () => {
//   // for (let i = 0; i < 2; i++) {
//   s.ellipse(s.random(s.width), s.random(s.height), 2 * d, 2 * d);
//   s.fill(stroke);
//   s.stroke(fill);
//   // }
// };
// for (let i = 0; i < 2; i++) {
//   s.ellipse(s.random(s.width), 50, s.random(100), s.random(100));
//   s.fill(stroke);
//   s.stroke(fill);
// }

type LevelTBCProps = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const LevelTBC: React.FC<LevelTBCProps> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const d = settings.radius * 2;
  const j = settings.jiggliness;
  const [fill, setFill] = useState(settings.colour2);
  const [stroke, setStroke] = useState(settings.colour1);
  const [allYGatesEntered, setAllYGatesEntered] = useState(false);
  const [allXGatesEntered, setAllXGatesEntered] = useState(false);
  // useEffect(() => {
  //   setMessage("It's a waiting game");
  // }, []);
  // useEffect(() => {
  //   if (allXGatesEntered === true && allXGatesEntered === true) {
  //     setMessage("All covered");
  //   }
  //   if (allYGatesEntered === true) {
  //     setMessage("All of the left side - covered");
  //   }
  //   if (allXGatesEntered === true) {
  //     setMessage("All of the bottom - covered");
  //   }
  // }, [allYGatesEntered, allXGatesEntered]);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      let x: number;
      let y: number;
      const xGatesEntered: number[] = [];
      const yGatesEntered: number[] = [];
      let colour1 = settings.colour1;
      let colour2 = settings.colour2;

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        s.createCanvas(width, height);
        x = Math.round(s.random(0, s.width));
        y = Math.round(s.random(0, s.height));
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
      };

      s.draw = () => {
        // without s.background() the circle produces chemtrails
        // const yGateNumber = Math.ceil(s.height / d);
        // const xGateNumber = Math.ceil(s.width / d);
        // const yGates = Array.from({ length: yGateNumber }, (_, i) => ({
        //   start: i === 0 ? 0 : i * d + 1,
        //   end: (i + 1) * d,
        // }));
        // const xGates = Array.from({ length: xGateNumber }, (_, i) => ({
        //   start: i === 0 ? 0 : i * d + 1,
        //   end: (i + 1) * d,
        // }));

        for (let i = 0; i < 6; i++) {
          s.ellipse(x, y, d, d);
          s.fill(fill);
          s.stroke(stroke);
          // jiggling
          x = x + s.random(-j, j);
          y = y + s.random(-j, j);
          //(0,0) is coordinates for top left corner
          //(s.width, s.height) for bottom right
          //enter right
          if (x > s.width) {
            x = 0;
          }
          //enter top
          if (y <= 0) {
            y = s.height;
          }
          // exit left (y-gates)
          if (x <= 0) {
            x = s.width;
            // make array of object gates where an object == (start, end) and where the length === gateNumber
            // iterate through gates array
            // if y value falls between value a and value b in an object of the gates array
            // then add to set of gatesEntered
            // when gatesEntered === gates.length, game won
            // const gate = yGates.find(
            //   (gate) => y >= gate.start && y <= gate.end
            // );
            // const gateIndex = gate ? yGates.indexOf(gate) : -1;
            // yGatesEntered.push(gateIndex);
            // const uniqueGatesEntered: number[] = Array.from(
            //   new Set(yGatesEntered)
            // );
            // console.log(`Count of Ygates entered: ${uniqueGatesEntered}`);
            // if (uniqueGatesEntered.length === yGates.length) {
            //   setAllYGatesEntered(true);
            //   if (allXGatesEntered) {
            //     setGameResult("won");
            //     setGameLive(false);
            //     setMessage("");
            //   }
            // }
          }
          //exit bottom (x-gates)
          if (y > s.height) {
            y = 0;
            // const gate = xGates.find(
            //   (gate) => x >= gate.start && x <= gate.end
            // );
            // const gateIndex = gate ? xGates.indexOf(gate) : -1;
            // xGatesEntered.push(gateIndex);
            // const uniqueGatesEntered: number[] = Array.from(
            //   new Set(xGatesEntered)
            // );
            // console.log(`Count of Xgates entered: ${uniqueGatesEntered}`);
            // if (uniqueGatesEntered.length === xGates.length) {
            //   setAllXGatesEntered(true);
            //   if (allYGatesEntered) {
            //     setGameResult("won");
            //     setGameLive(false);
            //   }
            // }
          }
          // movement across canvas
          y = y + 1;
          x = x - 1;
        }

        let xPixels = s.width;
        let yPixels = s.height;
      };

      s.mousePressed = () => {
        let distance = s.dist(s.mouseX, s.mouseY, x, y);
        if (distance < d) {
          if (fill === colour1) {
            setFill(colour2);
            setStroke(colour1);
          }
          if (fill === colour2) {
            setFill(colour1);
            setStroke(colour2);
          }
        }
      };
    },
    [settings, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default LevelTBC;

// import { useCallback, useEffect, useState } from "react";
// import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
// import { getGameCanvasDimensions } from "../constants/canvas";
// import { Settings } from "./CircleSettings";

// type Level03Props = {
//   settings: Settings;
//   setGameResult: (value: "won" | "lost" | undefined) => void;
//   setGameLive: (value: boolean) => void;
//   setMessage: (value: string) => void;
// };

// const Level03: React.FC<Level03Props> = ({
//   settings,
//   setGameResult,
//   setGameLive,
//   setMessage,
// }) => {
//   const d = settings.radius * 2;
//   const j = settings.jiggliness;
//   const [fill, setFill] = useState(settings.colour2);
//   const [stroke, setStroke] = useState(settings.colour1);
//   useEffect(() => {
//     setMessage("Hit that line");
//   }, []);

//   const sketch = useCallback(
//     (s: P5CanvasInstance) => {
//       let x: number;
//       let y: number;

//       s.setup = () => {
//         s.createCanvas(canvasWidth, canvasHeight);
//         x = Math.round(s.random(0, s.width));
//         y = Math.round(s.random(0, s.height));
//       };

//       s.windowResized = () => {
//         s.resizeCanvas(s.windowWidth, s.windowHeight);
//       };

//       s.draw = () => {
//         let rectX = 50;
//         let rectY = 50;
//         s.rect(rectX, rectY, 5, d * 2);
//         s.fill(stroke);
//         // without s.background() the circle produces chemtrails
//         for (let i = 0; i < 6; i++) {
//           s.ellipse(x, y, d, d);
//           s.fill(fill);
//           s.stroke(stroke);
//           // jiggling
//           x = x + s.random(-j, j);
//           y = y + s.random(-j, j);
//           //(0,0) is coordinates for top left corner
//           //(s.width, s.height) for bottom right
//           //enter right
//           if (x > s.width) {
//             x = 0;
//           }
//           //enter top
//           if (y <= 0) {
//             y = s.height;
//           }
//           // exit left (y-gates)
//           if (x <= 0) {
//             x = s.width;
//           }
//           //exit bottom (x-gates)
//           if (y > s.height) {
//             y = 0;
//           }
//           // movement across canvas
//           // y = y + 1;
//           x = x - 1;
//         }
//         // lose condition
//         // if (d > s.height) {
//         //   setGameResult("lost");
//         //   setGameLive(false);
//         //   setMessage("");
//         // }
//         // win condition
//         if (y >= 50 - d && y <= 50 + d) {
//           setGameResult("won");
//           setGameLive(false);
//           setMessage("");
//         }
//         console.log(y);
//       };

//       s.mousePressed = () => {
//         let distance = s.dist(s.mouseX, s.mouseY, x, y);
//         if (distance < d) {
//           y = y + 300;
//         }
//       };
//     },
//     [settings, setGameResult, setGameLive, setMessage]
//   );

//   return <ReactP5Wrapper sketch={sketch} />;
// };

// export default Level03;
