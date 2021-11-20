import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import doorFront1 from "../assets/doorFront1.png";
import doorFront2 from "../assets/doorFront2.png";
import doorInnerDefault from "../assets/doorinner_default.png";
import doorInnerDefault2 from "../assets/doorinner_default2.png";

const SLIDING_DOOR_NEAR_WIDTH = 182;
const SLIDING_DOOR_MEDIUM_WIDTH = 144;
const SLIDING_DOOR_MEDIUM_LEFT = -38;

const DOOR_FRAME_NEAR_WIDTH = 259;
const DOOR_FRAME_NEAR_LEFT = -158;
const DOOR_FRAME_MEDIUM_WIDTH = 175;
const DOOR_FRAME_FAR_WIDTH = 127;

// --------------------------------------------------------------------------------

// Close
const DoorFront1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
`;
const DoorFront1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))`
  position: absolute;
  top: 6px;
  left: 38px;
  width: 182px;
`;
const DoorFront1Container = styled.div.attrs(() => ({
  children: [<DoorFront1 key={1} />, <DoorFront1Inner key={2} />],
}))`
  position: absolute;
  top: 30px;
  left: 96px;
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
  z-index: 300;
`;

// --------------------------------------------------------------------------------
// Ahead medium
const DoorFront2 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
`;
const DoorFront2Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 25px;
  width: 125px;
  position: absolute;
  top: 3px;
  image-rendering: pixelated;
`;
const DoorFront2Container = styled.div.attrs(() => ({
  children: [<DoorFront2 key={1} />, <DoorFront2Inner key={2} />],
}))`
  position: absolute;
  left: 136px;
  top: 47px;
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
  z-index: 200;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;
// --------------------------------------------------------------------------------
// Ahead far

const DoorFront3 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${DOOR_FRAME_FAR_WIDTH}px;
  image-rendering: pixelated;
`;
const DoorFront3Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 19px;
  width: 89px;
  position: absolute;
  top: 2px;
  image-rendering: pixelated;
`;
const DoorFront3Container = styled.div.attrs(() => ({
  children: [<DoorFront3 key={1} />, <DoorFront3Inner key={2} />],
}))`
  position: absolute;
  left: 160px;
  top: 52px;
  width: ${DOOR_FRAME_FAR_WIDTH}px;
  z-index: 200;
  filter: brightness(0.3);
  image-rendering: pixelated;
`;

// --------------------------------------------------------------------------------
// Close left
const DoorSide1_1Container = styled(DoorFront1Container)`
  left: ${DOOR_FRAME_NEAR_LEFT}px;
  z-index: 199;
`;

// --------------------------------------------------------------------------------
// Close right
const DoorSide1_2Container = styled(DoorFront1Container)`
  z-index: 299;
  right: ${DOOR_FRAME_NEAR_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium right
const DoorSide2_2Container = styled(DoorFront2Container)`
  z-index: 199;
  right: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium left

const DoorSide2_1Container = styled(DoorFront2Container)`
  z-index: 199;
  left: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  transform: scaleX(-1);
`;

export const doorTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img" | "div", any>
> = {
  // Ahead
  "0,-0.5,1,-0.5": DoorFront1Container, // Ahead close
  "0,-1.5,1,-1.5": DoorFront2Container, // Ahead medium
  "0,-2.5,1,-2.5": DoorFront3Container, // Ahead far
  "-1,-0.5,0,-0.5": DoorSide1_1Container, // Left close
  "1,-0.5,2,-0.5": DoorSide1_2Container, // Right close
  "-1,-1.5,0,-1.5": DoorSide2_1Container, // Left medium
  "1,-1.5,2,-1.5": DoorSide2_2Container, // Medium
};