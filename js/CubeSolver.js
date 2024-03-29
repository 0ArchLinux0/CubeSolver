import * as Control from "./CameraControl.js";
import {
  controls,
  camera,
  scene,
  renderer,
  cubeGroup,
  cubeRotateState,
  solveCubeEndNotify,
} from "./RubixCube.js";
import * as R from "./Rotation.js";

const CLOCKWISE = 1;
const ANTICLOCKWISE = -1;

let storedX;
let storedY;
let storedZ;
let count = 0;
let Initialized = false;
let isRunning = false;

let i = 0;
let countExecute = 0;
let needExecute = 1;
let Execute = 0;
let needExecuteInitialized = false;
let frameIdx = 0;
let isSolving = false;

// class Animator {
//   constructor() {
//     this.frameIdx = 0;
//   }

//   rotateByCommand(command) {
//     for (let i = 0; i < command.length; i++) {
//       command[i];
//     }
//   }
//   rotate() {
//     this.oneRotate();
//   }

//   oneRotate(axis, clockwise, value) {
//     R.RotateAxis("X", -1, 1);

//     if (++this.frameIdx == 60) {
//       this.frameIdx = 0;
//       return Promise.resolve();
//     }
//     controls.update();
//     renderer.render(scene, camera);
//     // return new Promise(requestAnimationFrame(() => this.oneRotate));
//     //TODO TOCHECK TOREVIEW requestAnimationFrame(this.oneRotate)) doesn't work
//     return new Promise((resolve, reject) => {
//       // requestAnimationFrame(() => this.oneRotate())
//       requestAnimationFrame(this.oneRotate.bind(this));
//       // requestAnimationFrame(this.oneRotate)
//       resolve();
//     });
//   }
// }

export const solveCubeStart = () => {
  //Solve Cube when solve button clicked
  // let animator = new Animator();
  // animator.oneRotate("X", 1, 1);
  // animator.rotate();
  if (i++ == 60) {
    i = 1;
    countExecute++;
  }
  if (countExecute == needExecute) {
    i = 0;
    countExecute = 0;
    needExecute = 1;
    needExecuteInitialized = false;
    Render_step1_2();
    return false;
  }

  if (!needExecuteInitialized) {
    needExecuteInitialized = true;
    needExecute = step1_1();
  } else {
    step1_1();
  }

  //camera.translateY(-1); //Move camea's relative position(sphere Y is limeted to -PI/2 to PI/2)
  //camera.position.x+=1; //Move camera's absolute position

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(solveCubeStart);
};

export const step1_1 = () => {
  //Make white face look up
  if (!Initialized) {
    //Store init position just one time
    Initialized = true;
    storedX = cubeGroup[1][2][1].cube.position.x; //Position of the white face center cube
    storedY = cubeGroup[1][2][1].cube.position.y;
    storedZ = cubeGroup[1][2][1].cube.position.z;
  }

  switch (storedY) {
    case 0: //White face center cube is placed on one of the side faces. Rotate properly to face up
      if (storedX != 0) {
        Control.rotateCube("Z", ANTICLOCKWISE * storedX, function () {});
      } else {
        Control.rotateCube("X", CLOCKWISE * storedZ, function () {});
      }
      Execute = 1;
      break;
    case 1: //If white face center cube is on it's right position
      Execute = 0;
      Initialized = false;
      count = 0;
      return 0;
    case -1: //On opsite side of cube.InitPosition  Have to rotate one more time
      Control.rotateCube("X", CLOCKWISE, function () {});
      Execute = 2;
      break;
  }
  if (count++ == 59) {
    count = 0;
    Initialized = false;
  }
  return Execute;
};

const step1_2 = () => {
  let needExecute;
  if (!Initialized) {
    //Store init position just one time
    Initialized = true;
    storedX = cubeGroup[2][1][1].cube.position.x; //Position of the white face center cube
    storedZ = cubeGroup[2][1][1].cube.position.z;
  }

  if (storedZ == 1) {
    Control.rotateCube("Y", ANTICLOCKWISE, function () {});
    needExecute = 1;
  } else if (storedZ == -1) {
    Control.rotateCube("Y", CLOCKWISE, function () {});
    needExecute = 1;
  } else if (storedX == -1) {
    Control.rotateCube("Y", CLOCKWISE, function () {});
    needExecute = 2;
  } else {
    needExecute = 0;
    Initialized = false;
    return 0;
  }
  if (count++ == 59) {
    count = 0;
    Initialized = false;
  }
  return needExecute;
};

const Render_step1_2 = () => {
  if (i++ == 60) {
    i = 1;
    countExecute++;
  }
  if (countExecute == needExecute) {
    i = 0;
    countExecute = 0;
    needExecute = 1;
    needExecuteInitialized = false;
    step2_1(2, 2, 1);
    return;
  }

  if (!needExecuteInitialized) {
    needExecuteInitialized = true;
    needExecute = step1_2(cubeGroup);
  } else {
    step1_2(cubeGroup);
  }

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(Render_step1_2);
};

let step2_1Count = 0;
let countRender = 0;
const step2_1_execute = () => {
  switch (step2_1Count) {
    case 0:
      Control.rotateCube("Y", 1, function () {
        step2_1(1, 2, 0);
      });
      break;
    case 1:
      Control.rotateCube("Y", 1, function () {
        step2_1(0, 2, 1);
      });
      break;
    case 2:
      Control.rotateCube("Y", 1, function () {
        step2_1(1, 2, 2);
      });
      break;
    case 3:
      Control.rotateCube("Y", 1, function () {});
      break;
    default:
      return;
  }
  controls.update();
  renderer.render(scene, camera);
  if (countRender++ == 59) {
    countRender = 0;
    if (step2_1Count++ == 3) {
      step2_1Count = 0;
      step2_2(2, 2, 2);
    }
    return;
  }

  requestAnimationFrame(step2_1_execute);
};

const step2_2_execute = () => {
  switch (step2_1Count) {
    case 0:
      Control.rotateCube("Y", 1, function () {
        step2_2(2, 2, 0);
      });
      break;
    case 1:
      Control.rotateCube("Y", 1, function () {
        step2_2(0, 2, 0);
      });
      break;
    case 2:
      Control.rotateCube("Y", 1, function () {
        step2_2(0, 2, 2);
      });
      break;
    case 3:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 4:
      Control.rotateCube("X", ANTICLOCKWISE, function () {});
      break;
    case 5:
      Control.rotateCube("X", ANTICLOCKWISE, function () {});
      break;
    default:
      return;
  }
  controls.update();
  renderer.render(scene, camera);
  if (countRender++ == 59) {
    countRender = 0;
    if (step2_1Count == 3 || step2_1Count == 4) {
      step2_1Count++;
      step2_2_execute();
      return;
    }
    if (step2_1Count++ == 5) {
      step2_1Count = 0;
      step3(2, 1, 0);
    }
    return;
  }

  requestAnimationFrame(step2_2_execute);
};

let step3Count = 0;

const step3_execute = () => {
  //Complete Second row of Cube
  switch (step3Count) {
    case 0:
      Control.rotateCube("Y", 1, function () {
        step3(2, 1, 2);
      });
      break;
    case 1:
      Control.rotateCube("Y", 1, function () {
        step3(0, 1, 2);
      });
      break;
    case 2:
      Control.rotateCube("Y", 1, function () {
        step3(0, 1, 0);
      });
      break;
    case 3:
      Control.rotateCube("Y", 1, function () {});
      break;
    default:
      return;
  }
  controls.update();
  renderer.render(scene, camera);
  if (countRender++ == 59) {
    countRender = 0;

    if (step3Count++ == 3) {
      step3Count = 0;
      step4();
    }
    return;
  }

  requestAnimationFrame(step3_execute);
};

const step4_1 = () => {
  //Makes all the edges be in the right place.
  const cube = [
    cubeGroup[1][0][0],
    cubeGroup[2][0][1],
    cubeGroup[1][0][2],
    cubeGroup[0][0][1],
  ];
  const initPosition = [
    { x: 0, z: 1 },
    { x: 1, z: 0 },
    { x: 0, z: -1 },
    { x: -1, z: 0 },
  ];

  let count = 0;
  let rightFaceBinarySum = 0;
  let addNum = 0;

  for (let i = 0; i < 4; i++) {
    if (
      cube[i].cube.position.x == initPosition[i].x &&
      cube[i].cube.position.z == initPosition[i].z
    ) {
      count++;
      if (cube[i].cube.position.z == 1) addNum = 1;
      else if (cube[i].cube.position.z == -1) addNum = 4;
      else if (cube[i].cube.position.x == 1) addNum = 2;
      else addNum = 8;
      rightFaceBinarySum += addNum;
    }
  }

  if (count == 4) {
    step5();
    return;
  }
  if (count == 2) {
    switch (rightFaceBinarySum) {
      case 3:
        step4_1_minusY_1(function () {
          step4_1_set();
        });
        break;
      case 5:
        step4_1_set_2();
        break;
      case 6:
        step4_1_set();
        break;
      case 9:
        step4_1_Y_2(function () {
          step4_1_set();
        });
        break;
      case 10:
        step4_1_minusY_1(function () {
          step4_1_set_2();
        });
        break;
      case 12:
        step4_1_Y_1(function () {
          step4_1_set();
        });
        break;
    }
    return;
  }
  R.RotateAxis("Y", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1);
};

let checkInitialized = false;
let X_FacesBinarySum = 0;
let Z_FacesBinarySum = 0;
let visited1 = false;
let visited2 = false;
const step5 = () => {
  //Complete the Face
  const cube = [
    cubeGroup[2][0][0],
    cubeGroup[2][0][2],
    cubeGroup[0][0][2],
    cubeGroup[0][0][0],
  ];

  let addNum = 0;

  if (i++ == 60) {
    i = 1;
    X_FacesBinarySum = 0;
    Z_FacesBinarySum = 0;
    for (let j = 0; j < 4; j++) {
      if (cube[j].cube.position.x == 1 && cube[j].cube.position.z == 1)
        addNum = 1;
      else if (cube[j].cube.position.x == -1 && cube[j].cube.position.z == -1)
        addNum = 4;
      else if (cube[j].cube.position.x == 1 && cube[j].cube.position.z == -1)
        addNum = 2;
      else if (cube[j].cube.position.x == -1 && cube[j].cube.position.z == 1)
        addNum = 8;

      if (cube[j].axisDirection.subset(math.index(1, 0)) != 0) {
        X_FacesBinarySum += addNum;
      } else if (cube[j].axisDirection.subset(math.index(1, 2)) != 0) {
        Z_FacesBinarySum += addNum;
      }
    }
  }
  if (!checkInitialized) {
    checkInitialized = true;
    X_FacesBinarySum = 0;
    Z_FacesBinarySum = 0;
    for (let j = 0; j < 4; j++) {
      if (cube[j].cube.position.x == 1 && cube[j].cube.position.z == 1)
        addNum = 1;
      else if (cube[j].cube.position.x == -1 && cube[j].cube.position.z == -1)
        addNum = 4;
      else if (cube[j].cube.position.x == 1 && cube[j].cube.position.z == -1)
        addNum = 2;
      else if (cube[j].cube.position.x == -1 && cube[j].cube.position.z == 1)
        addNum = 8;

      if (cube[j].axisDirection.subset(math.index(1, 0)) != 0) {
        X_FacesBinarySum += addNum;
      } else if (cube[j].axisDirection.subset(math.index(1, 2)) != 0) {
        Z_FacesBinarySum += addNum;
      }
    }
  }
  if (X_FacesBinarySum == 0 && Z_FacesBinarySum == 0) {
    i = 0;
    checkInitialized = false;
    step6();
    return;
  } else if (
    !visited1 &&
    (Z_FacesBinarySum == 15 ||
      (Z_FacesBinarySum == 12 && X_FacesBinarySum == 3))
  ) {
    checkInitialized = false;
    i = 0;
    visited1 = true;
    step5_CompleteFace_1();
    return;
  } else if (
    !visited2 &&
    ((Z_FacesBinarySum == 8 && X_FacesBinarySum == 2) ||
      (Z_FacesBinarySum == 8 && X_FacesBinarySum == 5) ||
      (Z_FacesBinarySum == 5 && X_FacesBinarySum == 8) ||
      (Z_FacesBinarySum == 6 && X_FacesBinarySum == 0))
  ) {
    checkInitialized = false;
    i = 0;
    visited2 = true;
    step5_CompleteFace_2();
    return;
  } else if (Z_FacesBinarySum == 12 && X_FacesBinarySum == 0) {
    checkInitialized = false;
    i = 0;
    step5_CompleteFace_3();
    return;
  }

  R.RotateAll("Y", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step5);
};

let storeRightCube;
let supposedX;
let supposedZ;

const step6 = () => {
  //Count the number of cube which is placed in it's init position
  const cube = [
    cubeGroup[2][0][0],
    cubeGroup[2][0][2],
    cubeGroup[0][0][2],
    cubeGroup[0][0][0],
  ];
  const matrix_0 = math.matrix([
    [0, 0, 0],
    [1, -1, -1],
    [0, 0, 0],
  ]);
  const matrix_1 = math.matrix([
    [0, 0, 0],
    [1, -1, 1],
    [0, 0, 0],
  ]);
  const matrix_2 = math.matrix([
    [0, 0, 0],
    [-1, -1, 1],
    [0, 0, 0],
  ]);
  const matrix_3 = math.matrix([
    [0, 0, 0],
    [-1, -1, -1],
    [0, 0, 0],
  ]);
  const initPosition = [matrix_0, matrix_1, matrix_2, matrix_3];
  /* */
  let count = 0;

  for (let j = 0; j < 4; j++) {
    const supposedPosition = math.multiply(initPosition[j], cubeRotateState[0]);
    supposedX = supposedPosition.subset(math.index(1, 0));
    supposedZ = supposedPosition.subset(math.index(1, 2));

    if (
      cube[j].cube.position.x == supposedX &&
      cube[j].cube.position.z == supposedZ
    ) {
      count++;
      storeRightCube = cube[j];
    }
  }

  if (count == 0) {
    step6_LeftTop_To_RightBottom_just();
    return;
  } else if (count == 1) {
    step6_helper();
    return;
  } else if (count == 4) {
    step6_to7();
    return;
  }
};

const step6_to7 = () => {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    step7();
    return;
  }

  R.RotateAll("X", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step6_to7);
};

const step6_helper = () => {
  //Makes all the edges be in the right place.
  const cube = [
    cubeGroup[2][0][0],
    cubeGroup[2][0][2],
    cubeGroup[0][0][2],
    cubeGroup[0][0][0],
  ];
  const matrix_0 = math.matrix([
    [0, 0, 0],
    [1, -1, -1],
    [0, 0, 0],
  ]);
  const matrix_1 = math.matrix([
    [0, 0, 0],
    [1, -1, 1],
    [0, 0, 0],
  ]);
  const matrix_2 = math.matrix([
    [0, 0, 0],
    [-1, -1, 1],
    [0, 0, 0],
  ]);
  const matrix_3 = math.matrix([
    [0, 0, 0],
    [-1, -1, -1],
    [0, 0, 0],
  ]);
  const initPosition = [matrix_0, matrix_1, matrix_2, matrix_3];

  if (
    storeRightCube.cube.position.x == -1 &&
    storeRightCube.cube.position.z == 1
  ) {
    for (let j = 0; j < 4; j++) {
      const supposedPosition = math.multiply(
        initPosition[j],
        cubeRotateState[0]
      );
      const supposedX = supposedPosition.subset(math.index(1, 0));
      const supposedZ = supposedPosition.subset(math.index(1, 2));
      if (supposedX == 1 && supposedZ == -1) {
        if (cube[j].cube.position.x == 1) {
          step6_LeftTop_To_RightBottom();
          return;
        } else {
          step6_RightBottom_To_LeftTop();
          return;
        }
      }
    }
    return;
  }
  R.RotateAll("Y", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step6_helper);
};

const step7 = () => {
  if (
    cubeGroup[1][1][2].cube.position.x == 0 &&
    cubeGroup[1][1][2].cube.position.z == 1
  ) {
    solveCubeEndNotify();
    return;
  }
  R.RotateAll("Y", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step7);
};

const step4 = () => {
  //Make edges face Y Axis
  const cube = [
    cubeGroup[1][0][0],
    cubeGroup[2][0][1],
    cubeGroup[1][0][2],
    cubeGroup[0][0][1],
  ];
  let rightFaceBinarySum = 0;
  let addNum = 0;
  for (let i = 0; i < 4; i++) {
    if (cube[i].axisDirection.subset(math.index(1, 1)) == -1) {
      if (cube[i].cube.position.z == 1) addNum = 1;
      else if (cube[i].cube.position.z == -1) addNum = 4;
      else if (cube[i].cube.position.x == 1) addNum = 2;
      else addNum = 8;
      rightFaceBinarySum += addNum;
    }
  }
  switch (rightFaceBinarySum) {
    case 0:
      step4_noMatch();
      break;
    case 3:
      step4_Y_2(function () {
        step4_vToCross();
      });
      break;
    case 5:
      step4_Y_1(function () {
        step4_lineToCross();
      });
      break;
    case 6:
      step4_minusY_1(function () {
        step4_vToCross();
      });
      break;
    case 9:
      step4_Y_1(function () {
        step4_vToCross();
      });
      break;
    case 10:
      step4_lineToCross();
      break;
    case 12:
      step4_vToCross();
      break;
    case 15:
      step4_1();
  }
};

export const step2_1 = (i, j, k) => {
  const cube = cubeGroup[i][j][k].cube;
  const matrix = cubeGroup[i][j][k].axisDirection;
  if (matrix.subset(math.index(1, 0)) == 1) {
    //Facing +X
    if (cube.position.y == 1) {
      rotate_X_1();
    } else if (cube.position.y == -1) {
      rotate_X_2();
    } else if (cube.position.y == 0) {
      if (cube.position.z == 1) rotate_X_0_1();
      else rotate_X_0_2();
    }
  } else if (matrix.subset(math.index(1, 0)) == -1) {
    //Facing -X
    if (cube.position.y == 1) {
      rotate_minusX_1();
    } else if (cube.position.y == -1) {
      rotate_minusX_2();
    } else if (cube.position.y == 0) {
      if (cube.position.z == 1) rotate_minusX_0_1();
      else rotate_minusX_0_2();
    }
  } else if (matrix.subset(math.index(1, 1)) == 1) {
    //Facing +Y axis
    if (cube.position.x == 1) {
      step2_1_execute();
    } else if (cube.position.x == -1) {
      rotate_Y_1();
    } else if (cube.position.z == 1) {
      rotate_Y_2();
    } else if (cube.position.z == -1) {
      rotate_Y_3();
    }
  } else if (matrix.subset(math.index(1, 1)) == -1) {
    //Facing -Y axis
    if (cube.position.x == 1) {
      rotate_minusY_0();
    } else if (cube.position.x == -1) {
      rotate_minusY_1();
    } else if (cube.position.z == 1) {
      rotate_minusY_2();
    } else if (cube.position.z == -1) {
      rotate_minusY_3();
    }
  } else if (matrix.subset(math.index(1, 2)) == 1) {
    //Facing Z
    if (cube.position.y == 1) {
      rotate_Z_1();
    } else if (cube.position.y == -1) {
      rotate_Z_2();
    } else if (cube.position.x == 1) {
      rotate_Z_0_1();
    } else if (cube.position.x == -1) {
      rotate_Z_0_2();
    }
  } else if (matrix.subset(math.index(1, 2)) == -1) {
    //Facing -Z
    if (cube.position.y == 1) {
      rotate_minusZ_1();
    } else if (cube.position.y == -1) {
      rotate_minusZ_2();
    } else if (cube.position.x == 1) {
      rotate_minusZ_0_1();
    } else if (cube.position.x == -1) {
      rotate_minusZ_0_2();
    }
  }
};

export const step2_2 = (i, j, k) => {
  const cube = cubeGroup[i][j][k].cube;
  const matrix = cubeGroup[i][j][k].axisDirection;
  if (matrix.subset(math.index(1, 0)) == 1) {
    //Facing +X
    if (cube.position.y == 1) {
      if (cube.position.z == 1) rotate_step2_X_1();
      else rotate_step2_X_2();
    } else if (cube.position.y == -1) {
      if (cube.position.z == 1) rotate_step2_X_3();
      else rotate_step2_X_4();
    }
  } else if (matrix.subset(math.index(1, 0)) == -1) {
    //Facing -X
    if (cube.position.y == 1) {
      if (cube.position.z == 1) rotate_step2_minusX_1();
      else rotate_step2_minusX_2();
    } else if (cube.position.y == -1) {
      if (cube.position.z == 1) rotate_step2_minusX_3();
      //basic
      else rotate_step2_minusX_4();
    }
  } else if (matrix.subset(math.index(1, 1)) == 1) {
    //Facing +Y axis
    if (cube.position.z == 1) {
      if (cube.position.x == 1) step2_2_execute();
      else rotate_step2_Y_1();
    } else {
      if (cube.position.x == 1) rotate_step2_Y_2();
      else rotate_step2_Y_3();
    }
  } else if (matrix.subset(math.index(1, 1)) == -1) {
    //Facing -Y axis
    if (cube.position.z == 1) {
      if (cube.position.x == 1) rotate_step2_minusY_0();
      else rotate_step2_minusY_1();
    } else {
      if (cube.position.x == 1) rotate_step2_minusY_2();
      else rotate_step2_minusY_3();
    }
  } else if (matrix.subset(math.index(1, 2)) == 1) {
    //Facing Z
    if (cube.position.y == 1) {
      if (cube.position.x == 1) rotate_step2_Z_0();
      else rotate_step2_Z_1();
    } else {
      if (cube.position.x == 1) rotate_step2_Z_2();
      else rotate_step2_Z_3();
    }
  } else if (matrix.subset(math.index(1, 2)) == -1) {
    //Facing -Z
    if (cube.position.y == 1) {
      if (cube.position.x == 1) rotate_step2_minusZ_0();
      else rotate_step2_minusZ_1();
    } else {
      if (cube.position.x == 1) rotate_step2_minusZ_2();
      else rotate_step2_minusZ_3();
    }
  }
};

export const step3 = (i, j, k) => {
  const cube = cubeGroup[i][j][k].cube;
  const matrix = cubeGroup[i][j][k].axisDirection;

  if (matrix.subset(math.index(1, 0)) == 1) {
    //If cube element's Axis Z Facing +X(Orange face at start)
    if (cube.position.z == 1) {
      rotate_step3_Z_1();
    } else {
      rotate_step3_Y_3();
    }
  } else if (matrix.subset(math.index(1, 0)) == -1) {
    //If cube element's Axis Z Facing -X
    if (cube.position.z == 1) {
      rotate_step3_Y_2();
    } else {
      rotate_step3_minusZ_1();
    }
  } else if (matrix.subset(math.index(1, 1)) == 1) {
    //If cube element's Axis Z Facing +Y axis
    if (cube.position.x == 1) {
      if (cube.position.z == 1) rotate_step3_X_2();
      else rotate_step3_minusZ_2();
    } else {
      if (cube.position.z == 1) rotate_step3_Z_2();
      else rotate_step3_minusX_3();
    }
  } else if (matrix.subset(math.index(1, 1)) == -1) {
    //If cube element's Axis Z Facing -Y axis
    if (cube.position.x == 1) {
      if (cube.position.z == 1) step3_execute();
      else rotate_step3_X_3();
    } else {
      if (cube.position.z == 1) rotate_step3_minusX_2();
      else rotate_step3_minusZ_3();
    }
  } else if (matrix.subset(math.index(1, 2)) == 1) {
    //If cube element's Axis Z Facing Z
    if (cube.position.x == 1) {
      rotate_step3_Y_1();
    } else {
      rotate_step3_minusX_1();
    }
  } else if (matrix.subset(math.index(1, 2)) == -1) {
    //If cube element's Axis Z Facing -Z
    if (cube.position.x == 1) {
      rotate_step3_X_1();
    } else {
      rotate_step3_Y_4();
    }
  }
};

let step2_1_count = 0;

function rotate_X_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, 1);
      break;
    case 2:
      R.RotateAxis("Z", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_X_1);
}

function rotate_X_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, -1);
      break;
    case 1:
      R.RotateAxis("Z", -1, 1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_X_2);
}

function rotate_X_0_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, 1);
      break;
    case 1:
      R.RotateAxis("Z", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_X_0_1);
}

function rotate_X_0_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, 1);
      break;
    case 1:
      R.RotateAxis("Z", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_X_0_2);
}

function rotate_minusX_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 7) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", -1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Z", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusX_1);
}

function rotate_minusX_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("Z", -1, 1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusX_2);
}

function rotate_minusX_0_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Z", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusX_0_1);
}

function rotate_minusX_0_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("Z", 1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusX_0_2);
}

function rotate_Y_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, -1);
      break;
    case 1:
      R.RotateAxis("X", 1, -1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("Y", -1, -1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Y_1);
}

function rotate_Y_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("Z", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Y_2);
}

function rotate_Y_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, -1);
      break;
    case 1:
      R.RotateAxis("Z", 1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Y_3);
}

function rotate_minusY_0() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  R.RotateAxis("X", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusY_0);
}

function rotate_minusY_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusY_1);
}

function rotate_minusY_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusY_2);
}

function rotate_minusY_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, -1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusY_3);
}

function rotate_Z_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Z_1);
}

function rotate_Z_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Z", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Z_2);
}

function rotate_Z_0_1() {
  if (i++ == 60) {
    i = 0;
    step2_1_execute();
    return;
  }

  R.RotateAxis("X", 1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Z_0_1);
}

function rotate_Z_0_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, -1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_Z_0_2);
}

function rotate_minusZ_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusZ_1);
}

function rotate_minusZ_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, 1);
      break;
    case 2:
      R.RotateAxis("Z", 1, -1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusZ_2);
}

function rotate_minusZ_0_1() {
  if (i++ == 60) {
    i = 0;
    step2_1_execute();
    return;
  }

  R.RotateAxis("X", -1, 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusZ_0_1);
}

function rotate_minusZ_0_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_1_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("Z", -1, -1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Z", -1, -1);
      break;
    case 4:
      R.RotateAxis("Z", -1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_minusZ_0_2);
}

//step2_2

function rotate_step2_X_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 8) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, -1);
      break;
    case 4:
      R.RotateAxis("Y", -1, -1);
      break;
    case 5:
      R.RotateAxis("Z", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, -1);
      break;
    case 7:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_X_1);
}

function rotate_step2_X_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_minusY_0();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("Z", -1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_X_2);
}

function rotate_step2_X_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("Z", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, -1);
      break;
    case 3:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_X_3);
}

function rotate_step2_X_4() {
  if (i++ == 60) {
    i = 0;
    rotate_step2_Z_2();
    return;
  }
  R.RotateAxis("Y", 1, -1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_X_4);
}

function rotate_step2_minusX_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, -1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusX_1);
}

function rotate_step2_minusX_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("X", -1, -1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
      break;
    case 4:
      R.RotateAxis("Y", 1, -1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusX_2);
}

function rotate_step2_minusX_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusX_3);
}

function rotate_step2_minusX_4() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_X_3();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusX_4);
}

function rotate_step2_Y_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 7) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, -1);
      break;
    case 6:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Y_1);
}

function rotate_step2_Y_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_Z_2();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;

    case 2:
      R.RotateAxis("Z", -1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Y_2);
}

function rotate_step2_Y_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("Z", 1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", 1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Y_3);
}

function rotate_step2_minusY_0() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_Z_3();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusY_0);
}

function rotate_step2_minusY_1() {
  if (i++ == 60) {
    i = 0;
    rotate_step2_minusY_0();
    return;
  }

  R.RotateAxis("Y", -1, -1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusY_1);
}

function rotate_step2_minusY_2() {
  if (i++ == 60) {
    i = 0;
    rotate_step2_minusY_0();
    return;
  }

  R.RotateAxis("Y", 1, -1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusY_2);
}

function rotate_step2_minusY_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_minusY_0();
    return;
  }

  R.RotateAxis("Y", 1, -1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusY_3);
}

function rotate_step2_Z_0() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    rotate_step2_X_4();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Z_0);
}

function rotate_step2_Z_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 7) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
      break;
    case 4:
      R.RotateAxis("Z", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, -1);
      break;
    case 6:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Z_1);
}

function rotate_step2_Z_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Z_2);
}

function rotate_step2_Z_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("Z", 1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_Z_3);
}

function rotate_step2_minusZ_0() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 5) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, -1);
      break;
    case 1:
      R.RotateAxis("Z", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, -1);
      break;
    case 3:
      R.RotateAxis("Z", -1, 1);
      break;
    case 4:
      R.RotateAxis("Z", -1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusZ_0);
}

function rotate_step2_minusZ_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("Y", -1, -1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, -1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("Z", 1, -1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusZ_1);
}

function rotate_step2_minusZ_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 3) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, -1);
      break;
    case 2:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusZ_2);
}

function rotate_step2_minusZ_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 4) {
    i = 0;
    step2_1_count = 0;
    step2_2_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step2_minusZ_3);
}

//step 3

function rotate_step3_X_1() {
  if (i++ == 60) {
    i = 0;
    rotate_step3_Z_1();
    return;
  }

  R.RotateAxis("Y", 1, 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_X_1);
}

function rotate_step3_X_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 9) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Z_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, 1);
      break;
    case 4:
      R.RotateAxis("Z", -1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, 1);
      break;
    case 6:
      R.RotateAxis("Z", 1, 1);
      break;
    case 7:
      R.RotateAxis("Y", 1, 1);
      break;
    case 8:
      R.RotateAxis("Y", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_X_2);
}

function rotate_step3_X_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 11) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Y_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      R.RotateAxis("Y", 1, 1);
      break;
    case 9:
      R.RotateAxis("Y", 1, 1);
      break;
    case 10:
      Control.rotateCube("Y", -1, function () {});
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_X_3);
}

function rotate_step3_minusX_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 7) {
    i = 0;
    step2_1_count = 0;
    step3_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", -1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, 1);
      break;
    case 4:
      R.RotateAxis("Z", -1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, 1);
      break;
    case 6:
      R.RotateAxis("Z", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusX_1);
}

function rotate_step3_minusX_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 9) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Y_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", -1, function () {});
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      Control.rotateCube("Y", 1, function () {});
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusX_2);
}

function rotate_step3_minusX_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 11) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Z_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 1:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 2:
      R.RotateAxis("X", 1, 1);
      break;
    case 3:
      R.RotateAxis("Y", -1, 1);
      break;
    case 4:
      R.RotateAxis("X", -1, 1);
      break;
    case 5:
      R.RotateAxis("Y", -1, 1);
      break;
    case 6:
      R.RotateAxis("Z", -1, 1);
      break;
    case 7:
      R.RotateAxis("Y", 1, 1);
      break;
    case 8:
      R.RotateAxis("Z", 1, 1);
      break;
    case 9:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 10:
      Control.rotateCube("Y", 1, function () {});
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusX_3);
}

function rotate_step3_Y_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 8) {
    i = 0;
    step2_1_count = 0;
    step3_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", -1, 1);
      break;
    case 1:
      R.RotateAxis("Z", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
      break;
    case 4:
      R.RotateAxis("Y", 1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", -1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Y_1);
}

function rotate_step3_Y_2() {
  if (i++ == 60) {
    i = 0;
    rotate_step3_Y_1();
    return;
  }

  R.RotateAxis("Y", -1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Y_2);
}

function rotate_step3_Y_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 7) {
    i = 0;
    step2_1_count = 0;
    step3_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, 1);
      break;
    case 2:
      R.RotateAxis("Z", 1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", -1, 1);
      break;
    case 6:
      R.RotateAxis("X", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Y_3);
}

function rotate_step3_Y_4() {
  if (i++ == 60) {
    i = 0;
    rotate_step3_Y_3();
    return;
  }

  R.RotateAxis("Y", 1, 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Y_4);
}

function rotate_step3_Z_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 8) {
    i = 0;
    step2_1_count = 0;
    step3_execute();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Z_1);
}

function rotate_step3_Z_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 9) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_X_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", -1, function () {});
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", -1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      Control.rotateCube("Y", 1, function () {});
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_Z_2);
}

function rotate_step3_minusZ_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Z_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Y", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusZ_1);
}

function rotate_step3_minusZ_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Y_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 1:
      R.RotateAxis("Z", -1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, 1);
      break;
    case 4:
      R.RotateAxis("Y", 1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", -1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 8:
      Control.rotateCube("Y", -1, function () {});
      break;
    case 9:
      R.RotateAxis("Y", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusZ_2);
}

function rotate_step3_minusZ_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 12) {
    i = 0;
    step2_1_count = 0;
    rotate_step3_Z_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 1:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 2:
      R.RotateAxis("Z", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, 1);
      break;
    case 4:
      R.RotateAxis("Z", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, 1);
      break;
    case 6:
      R.RotateAxis("X", 1, 1);
      break;
    case 7:
      R.RotateAxis("Y", -1, 1);
      break;
    case 8:
      R.RotateAxis("X", -1, 1);
      break;
    case 9:
      R.RotateAxis("Y", 1, 1);
      break;
    case 10:
      Control.rotateCube("Y", 1, function () {});
      break;
    case 11:
      Control.rotateCube("Y", 1, function () {});
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(rotate_step3_minusZ_3);
}

//step 4

let storeCallback;
let isInitialized = false;
const step4_minusY_1 = (callback) => {
  if (i++ == 60) {
    i = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAxis("Y", -1, 1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_minusY_1);
};

const step4_Y_1 = (callback) => {
  if (i++ == 60) {
    i = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAxis("Y", 1, 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_Y_1);
};

const step4_Y_2 = (callback) => {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAxis("Y", 1, 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_Y_2);
};

function step4_lineToCross() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 6) {
    i = 0;
    step2_1_count = 0;
    step4_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_lineToCross);
}

function step4_vToCross() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    step4_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 8:
      R.RotateAxis("Y", -1, 1);
      break;
    case 9:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_vToCross);
}

function step4_noMatch() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 18) {
    i = 0;
    step2_1_count = 0;
    step4_1();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", 1, 1);
      break;
    case 1:
      R.RotateAxis("X", 1, 1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAxis("Z", -1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("Y", 1, 1);
      break;
    case 8:
      R.RotateAxis("Z", 1, 1);
      break;
    case 9:
      R.RotateAxis("X", 1, 1);
      break;
    case 10:
      R.RotateAxis("Y", 1, 1);
      break;
    case 11:
      R.RotateAxis("X", -1, 1);
      break;
    case 12:
      R.RotateAxis("Y", -1, 1);
      break;
    case 13:
      R.RotateAxis("X", 1, 1);
      break;
    case 14:
      R.RotateAxis("Y", 1, 1);
      break;
    case 15:
      R.RotateAxis("X", -1, 1);
      break;
    case 16:
      R.RotateAxis("Y", -1, 1);
      break;
    case 17:
      R.RotateAxis("Z", -1, 1);
      break;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_noMatch);
}
//step4_1

const step4_1_minusY_1 = (callback) => {
  if (i++ == 60) {
    i = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAll("Y", -1);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1_minusY_1);
};

const step4_1_Y_1 = (callback) => {
  if (i++ == 60) {
    i = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAll("Y", 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1_Y_1);
};

const step4_1_Y_2 = (callback) => {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 2) {
    i = 0;
    step2_1_count = 0;
    isInitialized = false;
    storeCallback();
    return;
  }
  if (isInitialized == false) {
    isInitialized = true;
    storeCallback = callback;
  }
  R.RotateAll("Y", 1);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1_Y_2);
};

function step4_1_set() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 9) {
    i = 0;
    step2_1_count = 0;
    step5();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 8:
      R.RotateAxis("Y", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1_set);
}

function step4_1_set_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    step4_1_set();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", 1, 1);
      break;
    case 1:
      R.RotateAxis("Y", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Y", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("Y", 1, 1);
      break;
    case 6:
      R.RotateAxis("Y", 1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 9:
      R.RotateAll("Y", -1);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step4_1_set_2);
}

//step5

function step5_CompleteFace_1() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    step5();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAll("X", 1);
      break;
    case 1:
      R.RotateAxis("X", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAll("X", -1);
      break;
    case 6:
      R.RotateAxis("X", 1, -1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      R.RotateAxis("X", 1, 1);
      break;
    case 9:
      R.RotateAxis("Z", -1, 1);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step5_CompleteFace_1);
}

function step5_CompleteFace_2() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    step5();
    return;
  }

  switch (step2_1_count) {
    case 0:
      R.RotateAll("X", 1);
      break;
    case 1:
      R.RotateAxis("X", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAll("X", -1);
      break;
    case 6:
      R.RotateAxis("X", 1, -1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      R.RotateAxis("X", 1, 1);
      break;
    case 9:
      R.RotateAxis("Z", -1, 1);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step5_CompleteFace_2);
}

function step5_CompleteFace_3() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 10) {
    i = 0;
    step2_1_count = 0;
    visited1 = false;
    visited2 = false;
    step6();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAll("X", 1);
      break;
    case 1:
      R.RotateAxis("X", -1, -1);
      break;
    case 2:
      R.RotateAxis("Y", 1, 1);
      break;
    case 3:
      R.RotateAxis("X", -1, 1);
      break;
    case 4:
      R.RotateAxis("Y", -1, 1);
      break;
    case 5:
      R.RotateAll("X", -1);
      break;
    case 6:
      R.RotateAxis("X", 1, -1);
      break;
    case 7:
      R.RotateAxis("Z", 1, 1);
      break;
    case 8:
      R.RotateAxis("X", 1, 1);
      break;
    case 9:
      R.RotateAxis("Z", -1, 1);
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step5_CompleteFace_3);
}

//Final step 6(Set edges of yellow face in right position)

function step6_LeftTop_To_RightBottom_just() {
  step6_again();
}

function step6_LeftTop_To_RightBottom() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 14) {
    i = 0;
    step2_1_count = 0;
    step7();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("Z", -1, -1);
      break;
    case 1:
      R.RotateAxis("X", 1, -1);
      break;
    case 2:
      R.RotateAxis("Z", -1, -1);
      break;
    case 3:
      R.RotateAxis("X", 1, 1);
      break;
    case 4:
      R.RotateAxis("X", 1, 1);
      break;
    case 5:
      R.RotateAxis("Z", 1, -1);
      break;
    case 6:
      R.RotateAxis("X", -1, -1);
      break;
    case 7:
      R.RotateAxis("Z", -1, -1);
      break;
    case 8:
      R.RotateAxis("X", 1, 1);
      break;
    case 9:
      R.RotateAxis("X", 1, 1);
      break;
    case 10:
      R.RotateAxis("Z", -1, -1);
      break;
    case 11:
      R.RotateAxis("Z", -1, -1);
      break;
    case 12:
      R.RotateAll("X", 1, 1);
      break;
    case 13:
      R.RotateAll("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step6_LeftTop_To_RightBottom);
}

function step6_again() {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 12) {
    i = 0;
    step2_1_count = 0;
    step6();
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Z", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", 1, -1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Z", -1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 8:
      R.RotateAxis("Z", 1, -1);
      break;
    case 9:
      R.RotateAxis("Z", 1, -1);
      break;
    case 10:
      R.RotateAxis("X", -1, 1);
      break;
    case 11:
      R.RotateAxis("X", -1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step6_again);
}

function step6_RightBottom_To_LeftTop(again) {
  if (i++ == 60) {
    i = 1;
    step2_1_count++;
  }
  if (step2_1_count == 14) {
    i = 0;
    step2_1_count = 0;
    if (again) {
      step6();
    } else {
      step7();
    }
    return;
  }
  switch (step2_1_count) {
    case 0:
      R.RotateAxis("X", -1, 1);
      break;
    case 1:
      R.RotateAxis("Z", 1, 1);
      break;
    case 2:
      R.RotateAxis("X", -1, 1);
      break;
    case 3:
      R.RotateAxis("Z", 1, -1);
      break;
    case 4:
      R.RotateAxis("Z", 1, -1);
      break;
    case 5:
      R.RotateAxis("X", 1, 1);
      break;
    case 6:
      R.RotateAxis("Z", -1, 1);
      break;
    case 7:
      R.RotateAxis("X", -1, 1);
      break;
    case 8:
      R.RotateAxis("Z", 1, -1);
      break;
    case 9:
      R.RotateAxis("Z", 1, -1);
      break;
    case 10:
      R.RotateAxis("X", -1, 1);
      break;
    case 11:
      R.RotateAxis("X", -1, 1);
      break;
    case 12:
      R.RotateAll("X", 1, 1);
      break;
    case 13:
      R.RotateAll("X", 1, 1);
      break;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(step6_RightBottom_To_LeftTop);
}
