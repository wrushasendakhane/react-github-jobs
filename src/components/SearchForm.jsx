import React from "react";
import { Col, Form, Button } from "react-bootstrap";

function SearchForm({ params, onParamChange, onSearch }) {
  return (
    <Form className="mb-4" onSubmit={onSearch}>
      <Form.Row className="align-items-end">
        <Form.Group as={Col} sm="12" md="4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={onParamChange}
            value={params.description}
            name="description"
            type="text"
            placeholder="Filter by title, benefits, companies, expertise"
          />
        </Form.Group>
        <Form.Group as={Col} sm="12" md="4">
          <Form.Label>Location</Form.Label>
          <Form.Control
            onChange={onParamChange}
            value={params.location}
            name="location"
            type="text"
            placeholder="Filter by city, state, zip code or country"
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ml-2">
          <Form.Check
            onChange={onParamChange}
            value={params.full_time}
            id="full_time"
            name="full_time"
            label="Only Full Time"
            type="checkbox"
            className="mb-2"
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ml-2">
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}

export default SearchForm;
