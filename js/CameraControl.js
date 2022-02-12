// import {scene, camera} from "./RubixCube.js";
import * as R from "./Rotation.js";

// let exeCount = 0;
let i = 0;

export const rotateCube = (Axis, Clockwise, callback) => {
  R.RotateAll(Axis, Clockwise);
  if (i++ == 59) {
    i = 0;
    callback();
    return;
  }
};
