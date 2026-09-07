import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BoxSelect } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
        <BoxSelect className="h-10 w-10" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Project not found</h1>
        <p className="text-muted-foreground max-w-[400px]">
          The project you&apos;re looking for doesn&apos;t exist, was deleted, or you don&apos;t have access to view it.
        </p>
      </div>
      <div className="mt-4">
        <Button >
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    </div>
  );
}
