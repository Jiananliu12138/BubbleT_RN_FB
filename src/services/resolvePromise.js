// src/services/resolvePromise.js
/**
 * Helper function to manage promise resolving state
 * @param {Promise} promise - The promise to be resolved
 * @param {Object} promiseState - Object to track promise state
 */
export function resolvePromise(promise, promiseState) {
  if (!promise) {
    return;
  }
  
  // Reset promiseState
  promiseState.promise = promise;
  promiseState.data = null;
  promiseState.error = null;
  
  promise
    .then(result => {
      // Only update if this is still the latest promise
      if (promiseState.promise === promise) {
        promiseState.data = result;
      }
    })
    .catch(error => {
      // Only update if this is still the latest promise
      if (promiseState.promise === promise) {
        promiseState.error = error;
      }
    });
}