"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { ClipboardCopy, ClipboardCheck } from "lucide-react";

export function CopyToClipboard({ text }: { text: string }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  async function handleCopyToClipboard() {
    await copyToClipboard(text);
    toast("Link has been copied. Now you can share it.", {
      icon: <ClipboardCheck />,
    });
  }

  return (
    <div className="flex gap-2 items-center">
      <Input className="h-9 text-sm" value={text} readOnly />
      <Button onClick={handleCopyToClipboard} size="sm" variant={"secondary"}>
        <ClipboardCopy className="w-5 h-5 mr-2" /> Copy URL
      </Button>
    </div>
  );
}
