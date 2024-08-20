import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { serverTimestamp } from "firebase/database";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || content === "" || content.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "posts"), {
        content,
        createdAt: serverTimestamp(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (photo) {
        const locationRef = ref(storage, `posts/${user.uid}/${doc.id}`);
        const res = await uploadBytes(locationRef, photo);
        const url = await getDownloadURL(res.ref);
        await updateDoc(doc, { photo: url });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        value={content}
        onChange={onChange}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="photo">
        {photo ? "✅ Photo added" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        type="file"
        id="photo"
        accept="image/*"
        onChange={onPhotoChange}
        hidden
      />
      <SubmitButton type="submit" value={isLoading ? "Loading..." : "Post"} />
    </Form>
  );
}
