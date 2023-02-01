// https://console.faceio.net/

import axios from 'axios';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import prompt from "../prompt";
import { FACEIO_API } from "../../src/environment";

// tsconfig.json
// "target": "ES2022",
(async () => {
  dotenv.config();
  // console.log(process.env);

  const { FACEIO_API_KEY } = process.env;

  const facialId = prompt('What is the facialId for a user to delete? ');

  // @ts-ignore
  // const { status, error } = await axios.get(`${FACEIO_API}/deletefacialid?${new URLSearchParams({
  const { data } = await axios.get(`${FACEIO_API}/deletefacialid?${new URLSearchParams({
    fid: facialId,
    key: FACEIO_API_KEY,
  }).toString()}`);

  const { status, error } = data;

  if (status !== 200) {
    console.error(error);
  } else {
    console.log("The facialId was deleted")
  }

})();