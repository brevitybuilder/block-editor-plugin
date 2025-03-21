import { useGetKey, useGetSet } from "@brevity-builder/react";
import { clsx } from "clsx";
import { useEffect, useMemo } from "react";
import { Mention, MentionsInput } from "react-mentions";
import styles from "./styles.module.css";
interface mentionsProps {
  className: string;
  users: Array<user>;
  isRequired: boolean;
}

type user = {
  email: string;
  given_name: string;
  family_name: string;
  profile_image_url: {
    src: string | null;
  };
  id: string;
};

export function Mentions({
  className,
  users = [],
  isRequired,
  ...props
}: mentionsProps) {
  const key = useGetKey(props);
  const [{ users: selected, value }, setState] = useGetSet<{
    users: Array<user>;
  }>(key, {
    users: [],
    value: "",
  });

  const usersById = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, user>,
    );
  }, [users]);

  function handleMentions(mentions: Array<{ id: string }>) {
    const users = mentions.map((u) => usersById[u.id]);
    setState({ users });
  }

  useEffect(() => {
    const handleClearBoardRows = () => {
      setState({ users: [], value: "" });
    };

    document.addEventListener("clear_mention_input", handleClearBoardRows);

    return () => {
      document.removeEventListener("clear_mention_input", handleClearBoardRows);
    };
  }, [setState]);

  return (
    <MentionsInput
      value={value}
      required={isRequired}
      className={clsx(styles.mentions, className)}
      style={{ outline: "none" }}
      onChange={(e, newValue, rawTExt, mentions) => {
        setState({ value: newValue });

        handleMentions(mentions);
      }}
      placeholder={"Mention people using '@'"}
      a11ySuggestionsListLabel={"Suggested mentions"}
      customSuggestionsContainer={(children) => {
        return <div className={styles.mentionSuggestions}>{children}</div>;
      }}
    >
      <Mention
        trigger="@"
        markup={`<span class="userTag" id="__id__">@__display__</span>`}
        appendSpaceOnAdd
        displayTransform={(url, display) => `@${display}`}
        renderSuggestion={(suggestion, search, highlightedDisplay) => (
          <div className={styles.user}>{highlightedDisplay}</div>
        )}
        onAdd={(userId: string) => {}}
        data={users.map((u) => ({
          id: u.id,
          display: `${u.given_name} ${u.family_name}`,
        }))}
      />
    </MentionsInput>
  );
}
