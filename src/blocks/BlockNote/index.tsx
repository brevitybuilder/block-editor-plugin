import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { clsx, useGetKey, useGetSet } from "@brevity-builder/react";
import { HTMLAttributes, forwardRef, useEffect, useMemo } from "react";

export type BlockNoteProps = {
  placeholder?: string;
  readOnly?: boolean;
  defaultValue?: string;
  onTextChange: (text: string) => void;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

// Editor is an uncontrolled React component
export const BlockNote = forwardRef(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      className,
      placeholder,

      ...props
    }: BlockNoteProps,
    ref,
  ) => {
    const key = useGetKey(props);
    const initialValue = useMemo(
      () => ({ value: defaultValue as string }),
      [defaultValue],
    );
    const [_, setState] = useGetSet<{
      value: string;
    }>(key, initialValue);

    const editor = useCreateBlockNote({
      uploadFile: async (file: File) => {
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
      },
    });

    useEffect(() => {
      async function loadInitialHTML() {
        const blocks = await editor.tryParseHTMLToBlocks(defaultValue);
        editor.replaceBlocks(editor.document, blocks);
      }
      loadInitialHTML();
    }, [editor]);

    return (
      <div className={clsx("quill", className)} {...props}>
        <BlockNoteView
          editor={editor}
          onChange={async () => {
            const html = await editor.blocksToFullHTML(editor.document);
            onTextChange(html);
            setState({ value: html });
          }}
        />
      </div>
    );
  },
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
