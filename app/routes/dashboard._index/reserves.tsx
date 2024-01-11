import { ListItem } from "~/components/list-item";

export function Reserves() {
  const items: unknown[] = [];

  if (items === null || items.length === 0) {
    return (
      <div className="border border-dashed rounded-2xl py-16 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="space-y-2">
            <div className="border shadow-sm rounded-xl h-16 w-32 p-2">
              <div className="rounded bg-gradient-to-b from-muted to-muted/40 w-full h-full"></div>
            </div>
            <div className="border shadow-sm rounded-xl h-32 w-32 p-2">
              <div className="rounded bg-gradient-to-b from-muted to-muted/40 w-full h-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="border shadow-sm rounded-xl h-32 w-32"></div>
            <div className="border shadow-sm rounded-xl h-16 w-32"></div>
          </div>
        </div>
        {/* <Gift size={48} className="text-muted-foreground mx-auto mb-4" /> */}
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          You don&apos;t have any reserved gifts yet
        </h2>
        <p className="text-muted-foreground">
          To reserve a gift, ask your friend for a link to his wish list.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
      {items.map((item) => (
        <ListItem key={item.id} item={item} actions={<div></div>} />
      ))}
    </ul>
  );
}
