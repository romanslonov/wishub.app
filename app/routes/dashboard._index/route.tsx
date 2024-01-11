import { Lists } from "./lists";
import { Reserves } from "./reserves";

export default function DashboardIndex() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your lists</h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Lists />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Reserved gifts</h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Reserves />
      </div>
    </div>
  );
}
