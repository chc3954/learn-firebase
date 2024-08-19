import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Nav from "./nav";

const Container = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;

export default function Layout() {
  return (
    <Container>
      <Nav />
      <Outlet />
    </Container>
  );
}
