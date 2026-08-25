import { useState, useEffect } from "react";
import { Plus, Trash2, UserCheck, X, Search, Loader2 } from "lucide-react";
import { privateRequest } from "../../utils/api";

// Backend DTO Mappings
export interface ContactListItem {
  contactId: string;
  contactName: string;
  ownerId: number;
  contactPhone: string;
  hasAccount: boolean;
}

export interface ContactForm {
  name: string;
  phone: string;
}

export interface ModificationResult<T = unknown> {
  resultItem: T;
  isSuccess: boolean;
  message?: string | null;
}

function maskPhone(phone?: string) {
  if (!phone) return "";
  if (phone.length <= 4) return phone;
  return `•••• ${phone.slice(-4)}`;
}

export function ContactPage() {
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const data = await privateRequest<ContactListItem[]>("/wallet-user/contacts", {
          method: "GET",
        });
        setContacts(data ?? []);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);


  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      setIsSubmitting(true);
      const payload: ContactForm = { name: name.trim(), phone: phone.trim() };

      const response = await privateRequest<ModificationResult<ContactListItem>>("/wallet-user/contacts", {
        method: "POST",
        body: payload,
      });

      if (response?.isSuccess && response.resultItem) {
        setContacts((prev) => [response.resultItem, ...prev]);
        closeModal();
      }
    } catch (error) {
      console.error("Failed to add contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      setDeletingId(contactId);
      await privateRequest<ModificationResult>(`/wallet-user/contacts/${contactId}`, {
        method: "DELETE",
      });
      setContacts((prev) => prev.filter((c) => c.contactId !== contactId));
    } catch (error) {
      console.error("Failed to delete contact:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPhone("");
  };

  const filteredContacts = contacts.filter((c) => {
    const name = c.contactName ?? "";
    const phone = c.contactPhone ?? "";
    const query = searchQuery.toLowerCase();

    return name.toLowerCase().includes(query) || phone.includes(query);
  });
  return (
    <div className="flex flex-col gap-4 px-4 pt-20 pb-24 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-50">
            Contacts
          </h1>
          <p className="text-xs text-slate-400">
            {contacts.length} {contacts.length === 1 ? "Contact" : "Saved Contacts"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 backdrop-blur-md outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
        />
      </div>

      {/* Contacts List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex py-12 items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-indigo-400" />
            Loading contacts...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <p className="text-xs font-medium text-slate-300">
              {searchQuery ? "No matching contacts" : "No contacts added yet"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {searchQuery
                ? "Try searching with a different keyword"
                : "Tap 'Add Contact' to store saved recipients"}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.contactId}
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 backdrop-blur-md transition-all hover:bg-slate-900/80 active:scale-[0.99]"
            >
              {/* Avatar Initial */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50 text-sm font-bold text-slate-200 shadow-inner">
                {(contact.contactName ?? "U").charAt(0).toUpperCase()}
              </div>
              {/* Details */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-100">
                    {contact.contactName}
                  </span>
                  {contact.hasAccount && (
                    <span className="flex items-center gap-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-medium text-emerald-400">
                      <UserCheck className="h-2.5 w-2.5" />
                      App User
                    </span>
                  )}
                </div>
                <span className="truncate text-xs text-slate-400 font-mono mt-0.5">
                  {maskPhone(contact.contactPhone)}
                </span>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                disabled={deletingId === contact.contactId}
                onClick={() => handleDeleteContact(contact.contactId)}
                aria-label={`Delete ${contact.contactName}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/40 text-slate-400 border border-slate-800/60 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-90 disabled:opacity-50"
              >
                {deletingId === contact.contactId ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-100">Add New Contact</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium uppercase text-slate-400 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Contact"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}