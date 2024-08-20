import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styled from "styled-components";
import Post from "./post";

export interface IPost {
  id: string;
  photo?: string;
  content: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const data = await getDocs(postsQuery).then((snapshot) =>
        snapshot.docs.map((doc) => {
          const { content, createdAt, userId, username, photo } = doc.data();
          return {
            id: doc.id,
            content,
            createdAt,
            userId,
            username,
            photo,
          };
        })
      );
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
}
