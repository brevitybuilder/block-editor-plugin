import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import LinkTool from '@editorjs/link';
import { clsx, useGetKey, useGetSet } from "@brevity-builder/react";

export type EditorProps = {
  placeholder?: string;
  readOnly?: boolean;
  defaultValue?: string;
  onTextChange: (text: string) => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

// Editor is an uncontrolled React component
export const BlockNote = React.forwardRef(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      className,
      placeholder,
      ...props
    },
    ref
  ) => {
    const editorRef = useRef<EditorJS>();
    const key = useGetKey(props);
    const [_, setState] = useGetSet<{ value: string }>(key, { value: defaultValue || '' });

    useEffect(() => {
      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: 'editorjs',
          placeholder: placeholder || 'Start writing...',
          readOnly: readOnly,
          tools: {
            header: Header,
            paragraph: Paragraph,
            list: List,
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: upload,
                },
              },
            },
            embed: Embed,
            table: Table,
            quote: Quote,
            marker: Marker,
            code: CodeTool,
            linkTool: LinkTool,
          },
          data: undefined,
          onChange: async () => {
            const content = await editorRef.current?.save();
            const html = JSON.stringify(content);
            onTextChange(html);
            setState({ value: html });
          },
        });
      }

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }, []);

    return (
      <div ref={ref} className={clsx("editor-js", className)} {...props}>
        <div id="editorjs" />
      </div>
    );
  }
);

BlockNote.displayName = "Editor";

type Dimensions = {
  width: number;
  height: number;
};
function getImageSize(file: File): Promise<Dimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function onload() {
      const { width, height } = img;
      resolve({ width, height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const upload = async (file: File) => {
  const headers = {};
  if (file.type.startsWith("image/")) {
    const { width, height } = await getImageSize(file);
    headers["X-Image-Width"] = width.toString();
    headers["X-Image-Height"] = height.toString();
  }
  const response = await fetch(`/api/upload/public/${file.name}`, {
    method: "PUT",
    headers,
    body: file,
  });

  if (!response.ok) {
    throw await response.text();
  }
  const devizeFile = await response.json();
  return devizeFile.src;
}
