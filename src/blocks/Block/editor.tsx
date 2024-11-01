import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useGetKey, useGetSet } from "@brevity-builder/react";
import { useEffect, useMemo } from "react";

async function uploadFile(file: File) {
  const headers = {};

  if (file.type.startsWith("image")) {
    const { width, height } = await getImageSize(file);
    headers["X-Image-Width"] = width.toString();
    headers["X-Image-Height"] = height.toString();
  }
  const result = await fetch(
    `https://app.boldapproved.com/api/upload/public/${file.name}`,
    {
      method: "PUT",
      headers: headers,
      body: file,
    },
  );

  if (!result.ok) {
    throw await result.text();
  }

  const data = await result.json();
  return data.src as string;
}

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

export default function Block({ readOnly, defaultValue, ...props }: any) {
  const key = useGetKey(props);
  const initialValue = useMemo(
    () => ({ value: defaultValue as string }),
    [defaultValue],
  );

  const editor = useCreateBlockNote({
    uploadFile: uploadFile,
  });

  const [_, setState] = useGetSet<{
    value: string;
  }>(key, initialValue);

  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(defaultValue);
      editor.replaceBlocks(editor.document, blocks);
    }
    if (defaultValue) {
      loadInitialHTML();
    }
  }, [editor]);

  const onChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await editor.blocksToHTMLLossy(editor.document);
    setState({
      value: html,
    });
  };

  return (
    <BlockNoteView editor={editor} editable={!readOnly} onChange={onChange} />
  );
}
