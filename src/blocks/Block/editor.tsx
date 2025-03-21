import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  locales,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { useGetKey, useGetSet } from "@brevity-builder/react";
import { useEffect, useMemo, useRef } from "react";
import { useMention } from "./mention";

async function uploadFile(file: File) {
  const headers = {};

  if (file.type.startsWith("image")) {
    const { width, height } = await getImageSize(file);
    headers["X-Image-Width"] = width.toString();
    headers["X-Image-Height"] = height.toString();
  }
  const result = await fetch(`/api/upload/public/${file.name}`, {
    method: "PUT",
    headers: headers,
    body: file,
  });

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

const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor,
  users: user[],
  onAdd: (user: user) => void,
): DefaultReactSuggestionItem[] => {
  return users.map((user) => ({
    title: `${user.given_name} ${user.family_name}`,
    subtext: user.email,
    key: user.email,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user: user.email,
            userId: user.id,
          },
        },
        " ", // add a space after the mention
      ]);
      onAdd(user);
    },
  }));
};

type user = {
  email: string;
  given_name: string;
  family_name: string;
  profile_image_url: {
    src: string | null;
  };
  id: string;
};

const locale = locales["en"];
export default function Block({
  readOnly,
  defaultValue,
  users,
  onTextChange,
  placeholder,
  hideSideMenu,
  updateKey,
  ...props
}: {
  readOnly: boolean;
  placeholder: string;
  defaultValue: string;
  users: user[];
  hideSideMenu: boolean;
  updateKey?: string;
  onTextChange: (value: any) => void;
}) {
  const defaultRef = useRef(false);
  const Mention = useMention(users);
  const key = useGetKey(props);
  const addedUsers = useRef<user[]>([]);
  const initialValue = useMemo(
    () => ({ value: defaultValue as string }),
    [defaultValue],
  );
  users = users || [];
  const schema = useMemo(() => {
    return BlockNoteSchema.create({
      inlineContentSpecs: {
        // Adds all default inline content.
        ...defaultInlineContentSpecs,
        // Adds the mention tag.
        mention: Mention,
      },
    });
  }, []);

  const editor = useCreateBlockNote({
    schema,
    uploadFile: uploadFile,
    dictionary: {
      ...locale,
      placeholders: placeholder
        ? {
            ...locale.placeholders,
            // We override the default placeholder
            default: placeholder,
          }
        : locale.placeholders,
    },
  });

  useEffect(() => {
    const handleClearEditor = () => {
      editor.replaceBlocks(editor.document, []);
    };

    document.addEventListener("clearEditor", handleClearEditor);

    return () => {
      document.removeEventListener("clearEditor", handleClearEditor);
    };
  }, [editor]);

  const [_, setState] = useGetSet<{
    value: string;
  }>(key, initialValue);

  useEffect(() => {
    if (users.length && !addedUsers.current.length && editor.document.length) {
      const musers = getMentionedUsers(editor.document, users);
      addedUsers.current = musers;
      setState({
        users: [...addedUsers.current],
      });
    }
  }, [users]);

  useEffect(() => {
    async function loadInitialHTML() {
      defaultRef.current = true;
      const blocks = await editor.tryParseHTMLToBlocks(defaultValue);
      editor.replaceBlocks(editor.document, blocks);
      const musers = getMentionedUsers(editor.document, users);
      addedUsers.current = musers;
      setState({
        users: [...addedUsers.current],
      });
      defaultRef.current = false;
    }
    if (defaultValue) {
      loadInitialHTML();
    }
  }, [editor, updateKey]);

  const addUser = (user: user) => {
    if (!addedUsers.current.some((u) => u.id === user.id)) {
      addedUsers.current.push(user);
      setState({
        users: [...addedUsers.current],
      });
    }
  };

  const onChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const blocks = editor.document;
    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock.children && lastBlock.children.length === 0) {
        blocks.pop();
      }
    }
    const html = await editor.blocksToFullHTML(blocks);
    setState({
      // value: html.replaceAll("<p></p>", "<p>&nbsp;</p>"),
      value: html,
    });
    if (onTextChange && defaultRef.current === false) {
      onTextChange(html);
    }
  };

  return (
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      theme={"light"}
      onChange={onChange}
      sideMenu={!hideSideMenu}
    >
      <SuggestionMenuController
        triggerCharacter="@"
        minQueryLength={1}
        getItems={async (query) => {
          // Gets the mentions menu items
          return filterSuggestionItems(
            getMentionMenuItems(editor, users, addUser),
            query,
          );
        }}
      />
      {hideSideMenu && (
        <style>
          {`
          .bn-editor {
            padding: 0 !important;
          }
        `}
        </style>
      )}
    </BlockNoteView>
  );
}

export function getMentionedUsers(blocks: any[], users: user[]): user[] {
  const mentionedUserIds = new Set<string>();
  function traverseBlocks(blockArray: any[]): void {
    for (const block of blockArray) {
      // Check block content
      if (block.content) {
        for (const item of block.content) {
          if (item.type === "mention" && item.props?.userId) {
            mentionedUserIds.add(item.props.userId);
          }
        }
      }
      // Recursively check child blocks
      if (block.children && block.children.length > 0) {
        traverseBlocks(block.children);
      }
    }
  }

  traverseBlocks(blocks);
  return users.filter((user) => mentionedUserIds.has(user.id));
}
