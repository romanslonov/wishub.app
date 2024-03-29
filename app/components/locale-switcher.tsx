import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useRouteLoaderData } from "@remix-run/react";

export function LocaleSwitcher() {
  const data = useRouteLoaderData<{ ENV: Record<string, string> }>("root");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="w-9 p-0" variant="outline">
          <Globe size={16} />
          <span className="sr-only">Locale switcher</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link hrefLang="en" to={`https://${data?.ENV.DOMAIN}`}>
              English
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link hrefLang="ru" to={`https://ru.${data?.ENV.DOMAIN}`}>
              Русский
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
