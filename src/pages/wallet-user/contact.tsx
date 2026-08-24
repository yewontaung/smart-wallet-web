import { TrashIcon } from "lucide-react";
import { iconSize } from "../../utils/constants";

interface Contact {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
}

const SAMPLE_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Alex Morgan",
    phone: "+1 (555) 019-2834",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Sarah Chen",
    phone: "+1 (555) 014-9821",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "David Kim",
    phone: "+1 (555) 017-3344",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "Elena Rostova",
    phone: "+1 (555) 012-7789",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
];

export function ContactPage() {
  return (
    // Padding-top (pt-20) and padding-bottom (pb-24) ensure 
    // content is not clipped by the floating top and bottom navbars.
    <div className="flex flex-col gap-4 px-4 pt-20 pb-24">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-bold tracking-tight text-white">Contacts</h1>
        <span className="text-xs font-medium text-white/50">
          {SAMPLE_CONTACTS.length} Saved
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {SAMPLE_CONTACTS.map((contact) => (
          <div
            key={contact.id}
            className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all hover:bg-white/10 active:scale-[0.99]"
          >
            <img
              src={contact.photoUrl}
              alt={contact.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
            />

            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-white">
                {contact.name}
              </span>
              <span className="truncate text-xs text-white/60">
                {contact.phone}
              </span>
            </div>

            <button
              type="button"
              aria-label={`Call ${contact.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-red-400 transition-colors hover:bg-white/20"
            >
                <TrashIcon size={iconSize} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}