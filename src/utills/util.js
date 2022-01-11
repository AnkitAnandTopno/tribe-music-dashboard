import axios from "axios";
import _ from "lodash";
import Cookies from "universal-cookie";
const cookies = new Cookies();
// const server = "http://revivalsong.org.in/server";
const server = "https://tribe-music-api.herokuapp.com/api";
// const server = "http://localhost:5000/api";
// const server = process.env.REACT_APP_SERVER_DEV;

let source = axios.CancelToken.source();

const editDistance = (a, b) => {
  /**
   * @param {string} a
   * @param {string} b
   * @return {number}
   */
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(((a && a.length) || 0) + 1).fill(null));

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= ((a && a.length) || 0); i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= ((b && b.length) || 0); j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= ((b && b.length) || 0); j += 1) {
    for (let i = 1; i <= ((a && a.length) || 0); i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return distanceMatrix[(b && b.length) || 0][(a && a.length) || 0];
};
const urlMaker = (api, type, params) => {
  let queryString = "";
  if (type == "get") {
    queryString += "?";
    _.mapKeys(params, (value, key) => {
      queryString += `${key}=${value}&&`;
    });
    console.log(queryString);
  }
  return `${server}/${api}/${queryString}`;
};
const sendRequest = (api, data) => {
  const distributorId = cookies.get("distributorId");
  const thenFn = (data.success && data.success.fn) || (() => {});
  const errorFn = (data.error && data.error.fn) || (() => {});
  const param = _.omit(data, ["success", "error","cancelToken"]);
  axios({
    method: api.type,
    url: urlMaker(api.path, api.type, param),
    data: param,
    headers: { distributorId },
    cancelToken: data&&data.cancelToken
  }).then(response => {
    if (response.status == 200) {
      if (response.data && response.data.success) {
        try {
          thenFn(JSON.parse(response.data));
        } catch (e) {
          thenFn(response.data);
        }
      } else {
        errorFn(response.data && response.data.message);
      }
    } else {
      errorFn(response.data && response.data.message);
    }
  });
};

const fetchYoutubeDetails = (youtubeID, data) => {
  const thenFn = (data.success && data.success.fn) || (() => {});
  const errorFn = (data.error && data.error.fn) || (() => {});

  axios({
    method: "get",
    url: `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${youtubeID}&key=AIzaSyCO1kjTZe-18-W1lHS5adFCFLgzwm1HG5k`
  }).then(response => {
    if (response.status == 200) {
      try {
        thenFn(
          JSON.parse(
            response.data &&
              response.data.items[0] &&
              response.data.items[0] &&
              response.data.items[0].snippet
          )
        );
      } catch (e) {
        thenFn(
          response.data &&
            response.data.items[0] &&
            response.data.items[0] &&
            response.data.items[0].snippet
        );
      }
    } else {
      errorFn();
    }
  });
};
const uploadFile = (api, data) => {
  const thenFn = (data.success && data.success.fn) || (() => {});
  const errorFn = (data.error && data.error.fn) || (() => {});
  const progressFn = (data.progress && data.progress.fn) || (() => {});

  const param = _.omit(data, ["success", "error"]);
  const params = new FormData();
  const url = urlMaker(api.path);

  params.append("file", param.file);
  // console.log(params);
  axios({
    method: api.type,
    url,
    data: params,
    onUploadProgress: function(progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      progressFn(percentCompleted);
    },
    headers: {
      "Content-Type": "multipart/form-data",

      distributorid: cookies.get("distributorId")
    }
  })
    .then(response => {
      progressFn(0);
      if (response.status == 200) {
        if (response.data && response.data.success) {
          thenFn(`${response.data.data.fileUrl}`);
        } else {
          errorFn();
        }
      } else {
        errorFn();
      }
    })
    .catch(error => errorFn());
};
export { sendRequest, uploadFile, server, fetchYoutubeDetails, editDistance };
