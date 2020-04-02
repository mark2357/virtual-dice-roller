import * as BABYLON from '@babylonjs/core';
import calcRandomFloatBetween from './calcRandomFloatBetween';
/**
 * @description
 * calculates a random Vector between the passed in min and max values
 * @param {BABYLON.Vector3} vectorMin 
 * @param {BABYLON.Vector3} vectorMax 
 */
const calcRandomVectorBetween = (vectorMin, vectorMax) => {
    return new BABYLON.Vector3(
        calcRandomFloatBetween(vectorMin.x, vectorMax.x),
        calcRandomFloatBetween(vectorMin.y, vectorMax.y),
        calcRandomFloatBetween(vectorMin.z, vectorMax.z)
    );
}
export default calcRandomVectorBetween;