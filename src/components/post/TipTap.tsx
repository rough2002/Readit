"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Code from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  FaBold,
  FaItalic,
  FaLink,
  FaCode,
  FaImage,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

function Editor({ content, setContent }: Props) {
  // const [content, setContent] = useState<string>("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // Configure available heading levels
        },
      }),
      Image, // Add any extensions that are not included in StarterKit
      Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: false, // Default content
  });

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const form = new FormData();
        form.set("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: form,
          });

          const data = await response.json();
          console.log(data);
          if (data.url) {
            editor?.chain().focus().setImage({ src: data.url }).run();
          } else {
            console.error("Image upload failed");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  const getEditorContent = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      setContent(htmlContent);
      console.log(htmlContent);
    }
  };
  return (
    <div>
      <div className="flex space-x-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter the URL") as string;
            editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <FaLink />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <FaCode />
        </button>
        <button onClick={addImage}>
          <FaImage />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </button>

        <Button onClick={getEditorContent}>Get Content</Button>

        {/* Add more buttons as needed */}
      </div>
      <EditorContent editor={editor} />
      <div className="mt-4">
        <h3>Editor Content:</h3>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default Editor;
