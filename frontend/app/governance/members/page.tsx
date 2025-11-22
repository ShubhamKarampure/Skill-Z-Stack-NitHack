"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Menu,
  X,
  Loader2,
  Sparkles,
  Ban,
  Gavel,
  Building2,
  Plus,
  UserPlus,
} from "lucide-react";

// --- TYPES ---
interface Member {
  id: string;
  name: string;
  address: string;
  joinedDate: string;
  status: "verified" | "probation" | "revoked";
  reputation: number; // 0-100
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "loading" | "destructive";
}

// --- MOCK DATA ---
const INITIAL_MEMBERS: Member[] = [
  {
    id: "1",
    name: "NIT Silchar",
    address: "0x71C...9A21",
    joinedDate: "2023-01-15",
    status: "verified",
    reputation: 98,
  },
  {
    id: "2",
    name: "IIT Bombay",
    address: "0x892...B31C",
    joinedDate: "2023-02-20",
    status: "verified",
    reputation: 99,
  },
  {
    id: "3",
    name: "Apex Academy",
    address: "0x33A...F12B",
    joinedDate: "2024-08-05",
    status: "probation",
    reputation: 45,
  },
  {
    id: "4",
    name: "Web3 University",
    address: "0x99C...D44E",
    joinedDate: "2023-11-22",
    status: "verified",
    reputation: 88,
  },
];

// --- COMPONENTS ---

const Aurora = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px]" />
  </div>
);

const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl shadow-black text-sm font-medium ${
            toast.type === "destructive"
              ? "bg-red-950/90 border-red-500/20 text-red-200"
              : "bg-[#09090b] border-white/10 text-white"
          }`}
        >
          {toast.type === "loading" && (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          )}
          {toast.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          {toast.type === "destructive" && (
            <Ban className="w-4 h-4 text-red-400" />
          )}
          {toast.type === "info" && (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          <span>{toast.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
            Z
          </div>
          <span>
            Skill-Z{" "}
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2 border border-emerald-500/20">
              DAO
            </span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="/governance/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-white">
            Members
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>0xDAO...Admin</span>
          </button>
        </div>
        <button
          className="md:hidden p-2 text-zinc-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-[#09090b] border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <a href="/governance" className="text-zinc-400 font-medium">
            Proposals
          </a>
          <a href="#" className="text-white font-medium">
            Members
          </a>
        </div>
      )}
    </nav>
  );
};

// --- ADD MODAL ---
const AddMemberModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, address: string) => void;
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-[#18181b] border border-emerald-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4 text-white">
          <UserPlus className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold">Add New Institute</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">
              Institute Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stanford University"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">
              Wallet Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none font-mono text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd(name, address);
              onClose();
              setName("");
              setAddress("");
            }}
            disabled={!name || !address}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"
          >
            Add Member
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- REVOKE MODAL ---
const RevokeModal = ({
  isOpen,
  onClose,
  onConfirm,
  memberName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-[#18181b] border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-bold">Revoke Membership?</h2>
        </div>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          Are you sure you want to revoke <strong>{memberName}</strong>? This
          will immediately disable their ability to issue credentials and slash
          their reputation score to 0.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            Confirm Revoke
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<Member | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const handleAddMember = (name: string, address: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: name,
      address: address,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "verified",
      reputation: 50, // Start neutral
    };
    setMembers((prev) => [newMember, ...prev]);
    addToast(`New Institute '${name}' added successfully`, "success");
  };

  const handleRevokeConfirm = () => {
    if (!revokeTarget) return;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === revokeTarget.id) {
          return { ...m, status: "revoked", reputation: 0 };
        }
        return m;
      })
    );

    addToast(`${revokeTarget.name} has been revoked.`, "destructive");
    setRevokeTarget(null);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      <Aurora />
      <Navbar />
      <ToastContainer toasts={toasts} />

      <RevokeModal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevokeConfirm}
        memberName={revokeTarget?.name || ""}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                DAO{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                  Members
                </span>
              </h1>
              <p className="text-zinc-400">
                Manage accredited institutes and reputation scores.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-white">
                {members.length}
              </div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Total Institutes
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-emerald-400">
                {members.filter((m) => m.status === "verified").length}
              </div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Good Standing
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-red-500/10 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1 text-red-400">
                {
                  members.filter(
                    (m) => m.status === "revoked" || m.status === "probation"
                  ).length
                }
              </div>
              <p className="text-xs text-red-400/70 uppercase font-bold tracking-wider">
                Flagged / Revoked
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search Institute Name or Address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`group relative p-6 rounded-2xl border transition-all ${
                    member.status === "revoked"
                      ? "bg-red-950/10 border-red-500/20 opacity-75 grayscale-[0.5]"
                      : member.status === "probation"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                          member.status === "revoked"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : member.status === "probation"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {member.status === "revoked" ? (
                          <Ban className="w-6 h-6" />
                        ) : (
                          <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          {member.name}
                          {member.status === "verified" && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                          {member.status === "probation" && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                          {member.status === "revoked" && (
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                              REVOKED
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-zinc-500 font-mono">
                          {member.address}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
                      <div className="text-center md:text-left">
                        <p className="text-xs text-zinc-500 uppercase font-bold">
                          Joined
                        </p>
                        <p className="text-sm font-mono">{member.joinedDate}</p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">
                          Reputation
                        </p>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              member.reputation < 30
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${member.reputation}%` }}
                          />
                        </div>
                        <p className="text-xs text-right mt-1 font-mono text-zinc-400">
                          {member.reputation}/100
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                        Details
                      </button>
                      {member.status !== "revoked" && (
                        <button
                          onClick={() => setRevokeTarget(member)}
                          className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-zinc-400 hover:text-red-400 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
