import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TeamView: React.FC = () => {
  const { teamMembers } = useApp();
  const [assignmentMode, setAssignmentMode] = useState<'manual' | 'round-robin' | 'least-active'>('round-robin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Team & Sales Agents
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Role-Based Access (RBAC)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage agents responding to dealer inquiries, assign conversations, and configure auto-routing rules.
          </p>
        </div>
      </div>

      {/* Auto-Assignment Routing Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-white text-sm">Conversation Routing Engine</h3>
        <p className="text-xs text-slate-400">
          Determine how incoming WhatsApp chats and Click-to-WhatsApp leads are distributed to agents:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => setAssignmentMode('round-robin')}
            className={`p-3 rounded-xl border text-left transition ${
              assignmentMode === 'round-robin'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold">Round Robin (Default)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Distributes leads equally among online agents</div>
          </button>

          <button
            onClick={() => setAssignmentMode('least-active')}
            className={`p-3 rounded-xl border text-left transition ${
              assignmentMode === 'least-active'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold">Least Active Agent</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Routes to the agent with lowest active chat load</div>
          </button>

          <button
            onClick={() => setAssignmentMode('manual')}
            className={`p-3 rounded-xl border text-left transition ${
              assignmentMode === 'manual'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold">Manual Assignment</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Managers assign chats directly from Shared Inbox</div>
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-white text-xs truncate">{member.name}</h4>
                <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-1.5 py-0.5 rounded font-bold">
                  {member.role}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{member.assignedDepartment}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate text-slate-400">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono text-slate-400">{member.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Chats</span>
              <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {member.activeChatsCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
