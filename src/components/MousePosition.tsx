export type MousePositionProps = {
    mousePos: any;
    circleStart: any;
    circleEnd: any;
};

const MousePosition: React.FC<MousePositionProps> = (
    {mousePos, circleStart, circleEnd}

    
    ) => {
    const diameter = -1*(circleStart.x - circleEnd.x)
    return (
        <>
      The mouse is at position <b>({mousePos.x}, {mousePos.y})</b>
      <br/>
      {circleStart && `The circle diameter starts at ${circleStart.x}, ${circleStart.y}`}
      <br/>
      {circleEnd && `It ends at ${circleEnd.x}, ${circleEnd.y} and is ${diameter} pixels long`}
        </>
    )
}

export default MousePosition