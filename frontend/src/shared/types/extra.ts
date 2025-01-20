import { Axios } from 'axios';
import * as API from "../../config";

export type Extra = {
  client: {public: Axios, private: Axios},
  api: typeof API,
};
