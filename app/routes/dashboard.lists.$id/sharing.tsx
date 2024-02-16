import { Button } from "~/components/ui/button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { ClipboardCopy, ClipboardCheck, Send } from "lucide-react";
import { useRouteLoaderData } from "@remix-run/react";
import { LocaleData } from "~/locales";

export function Sharing({ text }: { text: string }) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  async function handleCopyToClipboard() {
    await copyToClipboard(text);
    toast("Link has been copied. Now you can share it.", {
      icon: <ClipboardCheck />,
    });
  }

  return (
    <div className="flex gap-2 items-center">
      <Button onClick={handleCopyToClipboard} size="sm" variant={"secondary"}>
        <ClipboardCopy className="w-5 h-5 mr-2" />{" "}
        {data?.t.dashboard.list.actions.copy_url}
      </Button>
      <Button
        onClick={handleCopyToClipboard}
        disabled
        size="sm"
        variant={"secondary"}
      >
        <Send className="w-5 h-5 mr-2" />{" "}
        {data?.t.dashboard.list.actions.share_with_friends}
      </Button>
    </div>
  );
}
