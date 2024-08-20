import PostForm from "../components/post-form";
import styled from "styled-components";
import Timeline from "../components/timeline";

const Container = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: auto;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Container>
      <PostForm />
      <Timeline />
    </Container>
  );
}
