import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import TourDetailsLeft from "./TourDetailsLeft";
import TourDetailsSidebar from "./TourDetailsSidebar";

const TourDetailsTwo = () => {
  return (
    <section className="tour-details-two">
      <Container>
        <Row>
          <Col xl={12} lg={7}>
            <TourDetailsLeft />
          </Col>
        
        </Row>
      </Container>
    </section>
  );
};

export default TourDetailsTwo;
