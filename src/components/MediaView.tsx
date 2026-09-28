import React from 'react';
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Download,
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MediaView: React.FC = () => {
  const { mediaAssets } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Media Library & Tile Catalogues
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Meta Resumable Media API
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store and send PDF catalogues, high-definition tile pattern mockups, and factory production videos directly in WhatsApp conversations.
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition">
          <Upload className="w-4 h-4" />
          Upload Media to Meta Cloud
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediaAssets.map(asset => (
          <div
            key={asset.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-emerald-400">
                  {asset.category}
                </span>
                <span className="font-mono text-[10px]">{asset.size}</span>
              </div>

              {asset.category === 'Images' ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-32 object-cover rounded-xl mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-slate-950 rounded-xl flex items-center justify-center text-slate-600 mb-2 border border-slate-800">
                  {asset.category === 'Catalogue' || asset.category === 'PDF' ? (
                    <FileText className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <Video className="w-10 h-10 text-teal-400" />
                  )}
                </div>
              )}

              <h4 className="font-bold text-xs text-white truncate" title={asset.name}>
                {asset.name}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{asset.format}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px]">{asset.uploadedAt}</span>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
