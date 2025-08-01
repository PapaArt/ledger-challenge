import Container from "./Container";

import icon from '../../public/banco.png';

function Header() {
  return (
    <div className="header-component">
      <Container>
        <div className="logo">
          <img src={icon} alt="icon" className="my-icon" />
            <h1 className="name">Ledger</h1>
        </div>
      </Container>
    </div>
  );
}

export default Header;