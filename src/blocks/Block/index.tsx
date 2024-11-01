import { MaybeSuspend } from "@brevity-builder/react";
import { lazy } from "react";

const Editor = lazy(() => import("./editor"));

export function Block(props: any) {
  return (
    <MaybeSuspend>
      <Editor {...props} />
    </MaybeSuspend>
  );
}
