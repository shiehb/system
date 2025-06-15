import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Terms() {
  return (
    <>
      <hr className="border-muted-foreground/30 w-full" />
      <p className="my-1 text-center text-sm text-muted-foreground">
        By logging in, you agree to our{" "}
        <Dialog>
          <DialogTrigger asChild>
            <a
              href="#"
              className="font-bold underline-offset-4 hover:underline cursor-pointer hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-64 w-full pr-4">
              <p>This is the Terms of Service content.</p>
            </ScrollArea>
          </DialogContent>
        </Dialog>{" "}
        and{" "}
        <Dialog>
          <DialogTrigger asChild>
            <a
              href="#"
              className="font-bold underline-offset-4 hover:underline cursor-pointer hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Privacy Policy</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-64 w-full pr-4">
              <p>This is the Privacy Policy content.</p>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </p>
    </>
  );
}
