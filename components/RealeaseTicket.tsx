"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { XCircle } from "lucide-react";
import { useState } from "react";

function RealeaseTicket({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) {
  const [isReleasing, setIsReleasing] = useState(false);
  const RealeaseTicket = useMutation(api.waitingList.releaseTicket);

  const handleRelease = async () => {
    if(!confirm("Are you sure you want to release this ticket?")) return

    try {
        setIsReleasing(true);
        await RealeaseTicket({ waitingListId, eventId });
      } catch (error) {
        console.error(error);
      } finally { 
        setIsReleasing(false);
      }
    }
  
  return (
    <button
      onClick={handleRelease}
      disabled={isReleasing}
      className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XCircle className="w-4 h-4" />
      {isReleasing ? "Releasing..." : "Release Ticket"}
    </button>
  );
}

export default RealeaseTicket;
