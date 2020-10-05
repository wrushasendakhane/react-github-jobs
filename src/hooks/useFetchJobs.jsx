import { useEffect, useReducer } from "react";
import axios from "axios";
if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL =
    "https://cors-anywhere.herokuapp.com/https://jobs.github.com/";
}
const INITIAL_STATE = {
  jobs: [],
  loading: false,
  error: null,
};

const actions = {
  FETCH_JOBS_START: "FETCH_JOBS_START",
  FETCH_JOBS_SUCCESS: "FETCH_JOBS_SUCCESS",
  FETCH_JOBS_FAILED: "FETCH_JOBS_FAILED",
  UPDATE_HAS_NEXT_PAGE: "UPDATE_HAS_NEXT_PAGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.FETCH_JOBS_START:
      return { ...state, loading: true, error: null };
    case actions.FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.payload.jobs,
        loading: false,
        error: null,
      };
    case actions.FETCH_JOBS_FAILED:
      return {
        ...state,
        jobs: [],
        loading: false,
        error: action.payload.error,
      };
    case actions.UPDATE_HAS_NEXT_PAGE:
      return {
        ...state,
        hasNextPage: action.payload.hasNextPage,
      };
    default:
      return state;
  }
};

const useFetchJobs = (params, page) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const cancelToken1 = axios.CancelToken;
    const source1 = cancelToken1.source();

    dispatch({ type: actions.FETCH_JOBS_START });
    axios
      .get("/positions.json", {
        cancelToken1: source1.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((response) =>
        dispatch({
          type: actions.FETCH_JOBS_SUCCESS,
          payload: { jobs: response.data },
        })
      )
      .catch((error) => {
        if (axios.isCancel(error)) return;
        dispatch({
          type: actions.FETCH_JOBS_FAILED,
          payload: { error: error },
        });
      });

    const cancelToken2 = axios.CancelToken;
    const source2 = cancelToken2.source();

    dispatch({ type: actions.FETCH_JOBS_START });
    axios
      .get("/positions.json", {
        cancelToken2: source2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((response) =>
        dispatch({
          type: actions.UPDATE_HAS_NEXT_PAGE,
          payload: { hasNextPage: response.data.length !== 0 },
        })
      )
      .catch((error) => {
        if (axios.isCancel(error)) return;
        dispatch({
          type: actions.FETCH_JOBS_FAILED,
          payload: { error: error },
        });
      });

    return () => {
      source1.cancel();
      source2.cancel();
    };
  }, [params, page]);

  return state;
};

export default useFetchJobs;

// link: <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=13>; rel="prev",
// <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=15>; rel="next",
// <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34>; rel="last",
// <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=1>; rel="first"
