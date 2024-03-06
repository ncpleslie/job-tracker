import { Button } from "@/components/ui/button";
import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { PlusSquare } from "lucide-react";

export const Route = createRootRoute({
  component: () => {
    const router = useRouterState();

    return (
      <>
        <nav className="flex w-full flex-row justify-between gap-2 p-2">
          <div className="flex flex-row gap-2">
            <Button variant="outline" asChild>
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/jobs" className="[&.active]:font-bold">
                Jobs
              </Link>
            </Button>
          </div>
          <Button
            variant="outline"
            asChild
            className="self-end justify-self-end"
          >
            <Link
              to={
                router.location.pathname === "/jobs"
                  ? "/jobs/add/modal"
                  : "/jobs/add"
              }
              className="[&.active]:font-bold"
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              New Job
            </Link>
          </Button>
        </nav>
        <hr className="mb-8" />
        <Outlet />
      </>
    );
  },
});
