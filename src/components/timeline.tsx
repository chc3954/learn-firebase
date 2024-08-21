import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styled from "styled-components";
import Post from "./post";
import { Unsubscribe } from "firebase/auth";

export interface IPost {
  id: string;
  photo?: string;
  content: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
`;

export default function Timeline() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      // Query the latest 10 posts from Firestore
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      // Listen to the latest 10 posts
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { content, createdAt, userId, username, photo } = doc.data();
          return {
            id: doc.id,
            content,
            createdAt,
            userId,
            username,
            photo,
          };
        });

        setPosts(data);
      });
    };

    fetchPosts();

    // Unsubscribe from the snapshot listener when the component is unmounted
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
}
