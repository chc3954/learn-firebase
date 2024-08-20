import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
import { set } from "firebase/database";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IPost } from "../components/timeline";
import Post from "../components/post";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Posts = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setPosts] = useState<IPost[]>([]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const file = e.target.files?.[0];
    if (file) {
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const res = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(res.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );

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

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Container>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImage src={avatar} />
        ) : (
          <svg
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      <Name>{user?.displayName ?? "Anonymouse"}</Name>
      <Posts>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </Posts>
    </Container>
  );
}
