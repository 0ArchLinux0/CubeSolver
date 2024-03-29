import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js";
import {
  controls,
  renderer,
  camera,
  scene,
  cubeGroup,
  cubeRotateState,
} from "./RubixCube.js";

/*const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Matthreejs object3d click eventh.PI / 2);*/

/*let countexe = 0;*/
let count = 0;
let resetCount = 1;

const rotXmatrix = math.matrix([
  [1, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
]);
const rev_rotXmatrix = math.matrix([
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
]);
const rotYmatrix = math.matrix([
  [0, 0, 1],
  [0, 1, 0],
  [-1, 0, 0],
]);
const rev_rotYmatrix = math.matrix([
  [0, 0, -1],
  [0, 1, 0],
  [1, 0, 0],
]);
const rotZmatrix = math.matrix([
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, 1],
]);
const rev_rotZmatrix = math.matrix([
  [0, 1, 0],
  [-1, 0, 0],
  [0, 0, 1],
]);
let transMatrix;

let i = 0;
let countExecute = 0;
let axisName;
let clockwise;
let value;
let needExecute;
let Initialized = false;
/*export async function RotateAxisRender(axisNameParam, clockwiseParam, valueParam, needExecuteParam) {
    if (!Initialized) {
        console.log("initialized");
        axisName = axisNameParam;
        clockwise = clockwiseParam;
        value = valueParam;
        needExecute = needExecuteParam;
        Initialized = true;
    }
    if (i++ == 60) { //Reset when rotates PI/2
        i = 1;
        countExecute++;
    }
    if (countExecute == needExecute) {
        i = 0;
        countExecute = 0;
        Initialized = false;
        return false; //To check if it's running or not
    }
    RotateAxis(cubeGroup, axisName, clockwise, value);
    controls.update(); //Update
    renderer.render(scene, camera); //render to display on screen
    requestAnimationFrame(RotateAxisRender); // No parameter come in
}*/

export const RotateAxis = (axisName, clockwise, value, fps) => {
  count++;
  if (fps == 0 || fps == null) fps = 60;
  // console.log('fps: ' + fps);
  const dtheta = (clockwise * Math.PI) / (2 * fps);
  cubeGroup.forEach((cubeinPlane) => {
    cubeinPlane.forEach((cubeinLine) => {
      cubeinLine.forEach((cubeElement) => {
        switch (axisName) {
          case "X":
            if (cubeElement.cube.position.x == value) {
              //If coordinate X matches the value
              if (!cubeElement.stored) {
                //Only stores at the beginning of new Rotation of PI/2

                cubeElement.storePosition.z = cubeElement.cube.position.z; //Store initial position
                cubeElement.storePosition.y = cubeElement.cube.position.y;
                cubeElement.stored = true;
                /*cubeElement.AxisDeterm = math.inv(cubeElement.rotAxisZMatrix).subset(math.index(0, 0)) +
                                    +math.inv(cubeElement.rotAxisZMatrix).subset(math.index(0, 1)) * 2 +
                                    math.inv(cubeElement.rotAxisZMatrix).subset(math.index(0, 2)) * 4;*/
              }

              cubeElement.angle.x += dtheta; //Store angle of each cube element's rotation
              cubeElement.cube.position.z =
                Math.cos(cubeElement.angle.x) * cubeElement.storePosition.z -
                Math.sin(cubeElement.angle.x) * cubeElement.storePosition.y;
              cubeElement.cube.position.y =
                Math.sin(cubeElement.angle.x) * cubeElement.storePosition.z +
                Math.cos(clockwise * cubeElement.angle.x) *
                  cubeElement.storePosition.y;
              //By this you can get better accurracy than--->
              //--->cubeElement.cube.position.z = Math.cos(cubeElement.angle.x) * cubeElement.cube.position.z - Math.sin(cubeElement.angle.x) * cubeElement.cube.position.y;

              pivot.attach(cubeElement.cube); //If we just use cube.rotation.x if takes us to Euler's gimbal lock problem(has too use matrix **Line  41)
              pivot.rotation.x -= dtheta; //To avoid that we make each cube element to descendant of new Object3D and rotate Object3D(Which is pivot here)
              pivot.updateMatrixWorld(); //Update Object3D
              scene.attach(cubeElement.cube); //Assential to display in screen

              if (count == fps) {
                //When Rotate PI/2
                cubeElement.stored = false;
                //cubeElement.cube.rotation.y -= Math.PI / 120;
                cubeElement.cube.position.y = Math.round(
                  cubeElement.cube.position.y
                );
                cubeElement.cube.position.z = Math.round(
                  cubeElement.cube.position.z
                );
                transMatrix = clockwise == 1 ? rotXmatrix : rev_rotXmatrix;
                cubeElement.axisDirection = math.multiply(
                  cubeElement.axisDirection,
                  transMatrix
                );
                /*cubeElement.rotAxisZMatrix = math.multiply(rotXmatrix, cubeElement.rotAxisZMatrix);
                                cubeElement.rotAxisYMatrix = math.multiply(rotXmatrix, cubeElement.rotAxisYMatrix);*/
                cubeElement.angle.x = 0;
                pivot.rotation.set(0, 0, 0);
                pivot.updateMatrixWorld();

                if (resetCount++ == 9) {
                  //When all the 9 Cube Element finished rotation for PI/2. Reset count and resetCount
                  count = 0;
                  resetCount = 1;
                  if (value == 0)
                    cubeRotateState[0] = math.multiply(
                      cubeRotateState[0],
                      transMatrix
                    );
                }
              }
            }
            break;

          case "Y":
            if (cubeElement.cube.position.y == value) {
              if (!cubeElement.stored) {
                cubeElement.storePosition.x = cubeElement.cube.position.x;
                cubeElement.storePosition.z = cubeElement.cube.position.z;
                cubeElement.stored = true;
                /* cubeElement.AxisDeterm = math.inv(cubeElement.rotAxisYMatrix).subset(math.index(1, 0)) +
                                     +math.inv(cubeElement.rotAxisZMatrix).subset(math.index(1, 1)) * 2 +
                                     math.inv(cubeElement.rotAxisZMatrix).subset(math.index(1, 2)) * 4;*/
              }

              cubeElement.angle.y += dtheta;
              cubeElement.cube.position.x =
                Math.cos(cubeElement.angle.y) * cubeElement.storePosition.x -
                Math.sin(cubeElement.angle.y) * cubeElement.storePosition.z;
              cubeElement.cube.position.z =
                Math.sin(cubeElement.angle.y) * cubeElement.storePosition.x +
                Math.cos(cubeElement.angle.y) * cubeElement.storePosition.z;
              pivot.attach(cubeElement.cube);
              pivot.rotation.y -= dtheta;
              pivot.updateMatrixWorld();
              scene.attach(cubeElement.cube);

              /*switch (cubeElement.AxisDeterm) { //Tryied this but failed before facing gimblock lock 
                                case 1:
                                    cubeElement.cube.rotation.x -= Math.PI / 120;
                                    console.log("case1Y");
                                    break;
                                case -1:
                                    console.log("case-1Y");
                                    cubeElement.cube.rotation.x += Math.PI / 120;
                                    break;
                                case 2:
                                    console.log("case2Y");
                                    cubeElement.cube.rotation.y -= Math.PI / 120;
                                    break;
                                case -2:
                                    console.log("case-2Y");
                                    cubeElement.cube.rotation.y += Math.PI / 120;
                                    break;
                                case 4:
                                    console.log("case4Y");
                                    cubeElement.cube.rotation.z -= Math.PI / 120;
                                    break;
                                case -4:
                                    console.log("case-4Y");
                                    cubeElement.cube.rotation.z += Math.PI / 120;
                                    break;
                            }*/

              if (count == fps) {
                cubeElement.stored = false;
                cubeElement.cube.position.z = Math.round(
                  cubeElement.cube.position.z
                );
                cubeElement.cube.position.x = Math.round(
                  cubeElement.cube.position.x
                );

                /*  cubeElement.rotAxisZMatrix = math.multiply(cubeElement.rotAxisZMatrix, rotYmatrix);*/
                transMatrix = clockwise == 1 ? rotYmatrix : rev_rotYmatrix;
                cubeElement.axisDirection = math.multiply(
                  cubeElement.axisDirection,
                  transMatrix
                );

                cubeElement.angle.y = 0;
                pivot.rotation.set(0, 0, 0);
                pivot.updateMatrixWorld();

                if (resetCount++ == 9) {
                  count = 0;
                  resetCount = 1;
                  if (value == 0)
                    cubeRotateState[0] = math.multiply(
                      cubeRotateState[0],
                      transMatrix
                    );
                  /*  console.log("reset count X");*/
                }
              }
            }
            break;

          case "Z":
            if (cubeElement.cube.position.z == value) {
              if (!cubeElement.stored) {
                cubeElement.storePosition.y = cubeElement.cube.position.y;
                cubeElement.storePosition.x = cubeElement.cube.position.x;
                cubeElement.stored = true;
                /* cubeElement.AxisDeterm = math.inv(cubeElement.rotAxisZMatrix).subset(math.index(2, 0)) +
                                     +math.inv(cubeElement.rotAxisZMatrix).subset(math.index(2, 1)) * 2 +
                                     math.inv(cubeElement.rotAxisZMatrix).subset(math.index(2, 2)) * 4;*/
              }

              cubeElement.angle.z += dtheta;
              cubeElement.cube.position.y =
                Math.cos(cubeElement.angle.z) * cubeElement.storePosition.y -
                Math.sin(cubeElement.angle.z) * cubeElement.storePosition.x;
              cubeElement.cube.position.x =
                Math.sin(cubeElement.angle.z) * cubeElement.storePosition.y +
                Math.cos(cubeElement.angle.z) * cubeElement.storePosition.x;

              pivot.attach(cubeElement.cube);
              pivot.rotation.z -= dtheta;
              pivot.updateMatrixWorld();
              scene.attach(cubeElement.cube);

              /*  var some_quaternion = new THREE.Quaternion();
                              some_quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 120);
                              cubeElement.cube.rotation.setFromQuaternion(some_quaternion, "XYZ", true);*/
              // I think I need to search about this quaternion
              if (count == fps) {
                cubeElement.stored = false;
                cubeElement.cube.position.x = Math.round(
                  cubeElement.cube.position.x
                );
                cubeElement.cube.position.y = Math.round(
                  cubeElement.cube.position.y
                );

                transMatrix = clockwise == 1 ? rotZmatrix : rev_rotZmatrix;
                cubeElement.axisDirection = math.multiply(
                  cubeElement.axisDirection,
                  transMatrix
                );

                cubeElement.angle.z = 0;
                pivot.rotation.set(0, 0, 0);
                pivot.updateMatrixWorld();

                if (resetCount++ == 9) {
                  count = 0;
                  resetCount = 1;
                  if (value == 0)
                    cubeRotateState[0] = math.multiply(
                      cubeRotateState[0],
                      transMatrix
                    );
                }
              }
            }
            break;
        }
      });
    });
  });
};

let pivot = new THREE.Object3D(); //Create Ancestor Object3D
pivot.rotation.set(0, 0, 0);

export const RotateAll = (axisName, clockwise, fps) => {
  //Rotate the hole cube
  count++;
  // if(fps == 0 || fps == null) fps = 60;
  // console.log('fps: ' + fps);
  const dtheta = (clockwise * Math.PI) / (2 * 60);
  cubeGroup.forEach((cubeinPlane) => {
    cubeinPlane.forEach((cubeinLine) => {
      cubeinLine.forEach((cubeElement) => {
        switch (axisName) {
          case "X":
            if (!cubeElement.stored) {
              //Only stores at the beginning of new Rotation of PI/2

              cubeElement.storePosition.z = cubeElement.cube.position.z; //Store initial position
              cubeElement.storePosition.y = cubeElement.cube.position.y;
              cubeElement.stored = true;
            }
            cubeElement.angle.x += dtheta; //Store angle of each cube element's rotation
            cubeElement.cube.position.z =
              Math.cos(cubeElement.angle.x) * cubeElement.storePosition.z -
              Math.sin(cubeElement.angle.x) * cubeElement.storePosition.y;
            cubeElement.cube.position.y =
              Math.sin(cubeElement.angle.x) * cubeElement.storePosition.z +
              Math.cos(clockwise * cubeElement.angle.x) *
                cubeElement.storePosition.y;
            //By this you can get better accurracy than--->
            //--->cubeElement.cube.position.z = Math.cos(cubeElement.angle.x) * cubeElement.cube.position.z - Math.sin(cubeElement.angle.x) * cubeElement.cube.position.y;

            pivot.attach(cubeElement.cube); //If we just use cube.rotation.x if takes us to Euler's gimbal lock problem(has too use matrix **Line  41)
            pivot.rotation.x -= dtheta; //To avoid that we make each cube element to descendant of new Object3D and rotate Object3D(Which is pivot here)
            pivot.updateMatrixWorld(); //Update Object3D
            scene.attach(cubeElement.cube); //Assential to display in screen

            if (count == 60) {
              //When Rotate PI/2

              cubeElement.stored = false;
              //cubeElement.cube.rotation.y -= Math.PI / 120;
              cubeElement.cube.position.y = Math.round(
                cubeElement.cube.position.y
              );
              cubeElement.cube.position.z = Math.round(
                cubeElement.cube.position.z
              );

              transMatrix = clockwise == 1 ? rotXmatrix : rev_rotXmatrix;
              cubeElement.axisDirection = math.multiply(
                cubeElement.axisDirection,
                transMatrix
              );

              cubeElement.angle.x = 0;
              pivot.rotation.set(0, 0, 0);
              pivot.updateMatrixWorld();

              if (resetCount++ == 27) {
                count = 0;
                resetCount = 1;
                cubeRotateState[0] = math.multiply(
                  cubeRotateState[0],
                  transMatrix
                );
              }
            }
            break;

          case "Y":
            if (!cubeElement.stored) {
              cubeElement.storePosition.x = cubeElement.cube.position.x;
              cubeElement.storePosition.z = cubeElement.cube.position.z;
              cubeElement.stored = true;
            }

            cubeElement.angle.y += dtheta;
            cubeElement.cube.position.x =
              Math.cos(cubeElement.angle.y) * cubeElement.storePosition.x -
              Math.sin(cubeElement.angle.y) * cubeElement.storePosition.z;
            cubeElement.cube.position.z =
              Math.sin(cubeElement.angle.y) * cubeElement.storePosition.x +
              Math.cos(cubeElement.angle.y) * cubeElement.storePosition.z;

            pivot.attach(cubeElement.cube);
            pivot.rotation.y -= dtheta;
            pivot.updateMatrixWorld();
            scene.attach(cubeElement.cube);

            if (count == 60) {
              cubeElement.stored = false;
              cubeElement.cube.position.z = Math.round(
                cubeElement.cube.position.z
              );
              cubeElement.cube.position.x = Math.round(
                cubeElement.cube.position.x
              );

              transMatrix = clockwise == 1 ? rotYmatrix : rev_rotYmatrix;
              cubeElement.axisDirection = math.multiply(
                cubeElement.axisDirection,
                transMatrix
              );

              cubeElement.angle.y = 0;
              pivot.rotation.set(0, 0, 0);
              pivot.updateMatrixWorld();

              if (resetCount++ == 27) {
                count = 0;
                resetCount = 1;
                cubeRotateState[0] = math.multiply(
                  cubeRotateState[0],
                  transMatrix
                );
              }
            }

            break;

          case "Z":
            if (!cubeElement.stored) {
              cubeElement.storePosition.y = cubeElement.cube.position.y;
              cubeElement.storePosition.x = cubeElement.cube.position.x;
              cubeElement.stored = true;
            }
            cubeElement.angle.z += dtheta;
            cubeElement.cube.position.y =
              Math.cos(cubeElement.angle.z) * cubeElement.storePosition.y -
              Math.sin(cubeElement.angle.z) * cubeElement.storePosition.x;
            cubeElement.cube.position.x =
              Math.sin(cubeElement.angle.z) * cubeElement.storePosition.y +
              Math.cos(cubeElement.angle.z) * cubeElement.storePosition.x;

            pivot.attach(cubeElement.cube);
            pivot.rotation.z -= dtheta;
            pivot.updateMatrixWorld();
            scene.attach(cubeElement.cube);

            if (count == 60) {
              cubeElement.stored = false;
              cubeElement.cube.position.x = Math.round(
                cubeElement.cube.position.x
              );
              cubeElement.cube.position.y = Math.round(
                cubeElement.cube.position.y
              );

              transMatrix = clockwise == 1 ? rotZmatrix : rev_rotZmatrix;
              cubeElement.axisDirection = math.multiply(
                cubeElement.axisDirection,
                transMatrix
              );

              cubeElement.angle.z = 0;
              pivot.rotation.set(0, 0, 0);
              pivot.updateMatrixWorld();

              if (resetCount++ == 27) {
                count = 0;
                resetCount = 1;
                cubeRotateState[0] = math.multiply(
                  cubeRotateState[0],
                  transMatrix
                );
              }
            }
            break;
        }
      });
    });
  });
};
