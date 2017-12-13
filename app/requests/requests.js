/* @flow */

import axios from 'axios';

export function get(path: string, params: Object) {
  return new Promise((resolve, reject) => {
    axios.get(path, {
      params: {params: JSON.stringify(params)},
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error);
    });
  });
}

export function post(path: string, params: Object) {
  return new Promise((resolve, reject) => {
    axios.post(path, {
      params: JSON.stringify(params),
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error);
    });
  });
}
