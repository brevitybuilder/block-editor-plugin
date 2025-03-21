import { createReactInlineContentSpec } from "@blocknote/react";
import { useMemo } from "react";

export const useMention = (users: any[]) => {
  return useMemo(() => {
    return createReactInlineContentSpec(
      {
        type: "mention",
        propSchema: {
          user: {
            default: "Unknown",
          },
          userId: {
            default: "Unknown",
          },
        },
        content: "none",
      },
      {
        render: (props) => {
          const user = users.find(
            (u) => u.id === props.inlineContent.props.userId,
          );

          return (
            <span className="_mention" style={{ backgroundColor: "#0000000F" }}>
              {user
                ? `@${user.given_name} ${user.family_name}`
                : "Deleted user"}
            </span>
          );
        },
      },
    );
  }, [users]);
};
// The Mention inline content.
