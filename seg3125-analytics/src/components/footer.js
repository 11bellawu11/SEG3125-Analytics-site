import Container from "react-bootstrap/Container";

import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
        <Container style={{textAlign:"Center"}}>
            <h5>This Steam player dataset is provided by the following link: </h5>
            <a href="https://www.kaggle.com/datasets/jackogozaly/steam-player-data?resource=download">Steam Player Data</a>
        </Container>
    </footer>
  );
}