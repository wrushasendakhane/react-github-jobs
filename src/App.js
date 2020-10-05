import React, { useState } from 'react';
import { Container } from "react-bootstrap"
import useFetchJobs from './hooks/useFetchJobs';
import Job from './containers/Job';
import JobPagination from './containers/JobPagination';
import SearchForm from './components/SearchForm';

function App() {
  const [inputParams, setInputParams] = useState({})
  const [params, setParams] = useState({})
  const [page, setPage] = useState(1)
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page)

  const handleParamChange = ({ target }) => {
    setPage(1);
    setInputParams(prevParams => {
      return { ...prevParams, [target.name]: target.value }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setParams({ ...inputParams });
  }
  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={inputParams} onParamChange={handleParamChange} onSearch={handleSubmit} />
      { loading && <h1>Loading...</h1>}
      { error && <h1>Error. Try Refreshing.</h1>}
      { jobs.length > 0 ?
        <div>
          <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
          {jobs.map(job => <Job key={job.id} job={job} />)}
          <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
        </div> : null
      }
    </Container >
  );
}

export default App;
