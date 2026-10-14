import React from 'react';
import { StrategyDocData, WaveStep } from '../../types/generator';
import { DEFAULT_WAVE_STEPS_FALLEN, DEFAULT_WAVE_STEPS_HARDCORE } from '../../data/tdsGeneratorData';
import { Language } from '../../i18n/translations';
import {
  Sparkles,
  FileText,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';

interface StudioDocEditorProps {
  data: StrategyDocData;
  onChangeData: (data: StrategyDocData) => void;
  onGenerateDoc: () => void;
  lang?: Language;
}

export const StudioDocEditor: React.FC<StudioDocEditorProps> = ({
  data,
  onChangeData,
  onGenerateDoc
}) => {
  // Update fields in StrategyDocData
  const updateField = <K extends keyof StrategyDocData>(field: K, value: StrategyDocData[K]) => {
    onChangeData({ ...data, [field]: value });
  };

  // Wave step helpers
  const handleAddWaveStep = () => {
    const nextWaveNumber =
      data.waveSteps.length > 0
        ? data.waveSteps[data.waveSteps.length - 1].wave + 1
        : 0;
    const newStep: WaveStep = {
      id: `w-${Date.now()}`,
      wave: nextWaveNumber,
      player: 'All',
      action: 'Build / upgrade towers...',
      notes: '',
      skip: false
    };
    updateField('waveSteps', [...data.waveSteps, newStep]);
  };

  const handleUpdateWaveStep = (index: number, updated: Partial<WaveStep>) => {
    const newSteps = [...data.waveSteps];
    newSteps[index] = { ...newSteps[index], ...updated };
    updateField('waveSteps', newSteps);
  };

  const handleDeleteWaveStep = (index: number) => {
    const newSteps = data.waveSteps.filter((_, i) => i !== index);
    updateField('waveSteps', newSteps);
  };

  const handleLoadFallenTemplate = () => {
    updateField('waveSteps', DEFAULT_WAVE_STEPS_FALLEN);
  };

  const handleLoadHardcoreTemplate = () => {
    updateField('waveSteps', DEFAULT_WAVE_STEPS_HARDCORE);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 md:p-7 shadow-2xl space-y-7">
      {/* Top Section: Form Header & Big Generate Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-[10px] font-mono text-blue-300">
            <FileText className="w-3 h-3 text-blue-400" />
            <span>
              Google Docs Generator
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Strategy Document Parameters
          </h3>
          <p className="text-xs text-neutral-400">
            Fill in strategy details, wave plan, and press Generate to receive your Google Doc.
          </p>
        </div>

        {/* PRIMARY GENERATE BUTTON */}
        <button
          onClick={onGenerateDoc}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-sm tracking-wide shadow-xl shadow-blue-900/30 hover:shadow-blue-700/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 border border-white/20"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>
            ⚡ Generate Google Doc
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Basic Strategy Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Title */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Strategy Title *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="e.g. Lucille Strategy Hardcore (Gem Farm)"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Author */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Author *
          </label>
          <input
            type="text"
            value={data.author}
            onChange={e => updateField('author', e.target.value)}
            placeholder="Ayaka"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Gamemode */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Gamemode *
          </label>
          <select
            value={data.gamemode}
            onChange={e => updateField('gamemode', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white focus:outline-none cursor-pointer"
          >
            <option value="Hardcore">Hardcore</option>
            <option value="Fallen">Fallen</option>
            <option value="Molten">Molten</option>
            <option value="Badlands II">Badlands II</option>
            <option value="Polluted Wastelands II">Polluted Wastelands II</option>
            <option value="Pizza Party">Pizza Party</option>
            <option value="Frost Invasion">Frost Invasion</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Team Players Count */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Team Size (Players)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Solo', 'Duo', 'Trio', 'Quad'] as const).map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => updateField('playersCount', cnt)}
                className={`py-2 rounded-xl text-xs font-bold transition-colors border ${
                  data.playersCount === cnt
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Map Tag Display */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Selected Map from Canvas
          </label>
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-white">
            <span className="font-bold">{data.selectedMap.name}</span>
            <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded ml-auto">
              {data.selectedMap.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Wave by Wave Schedule Table Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>
                Wave-by-Wave Action Schedule (Google Doc Table)
              </span>
            </h4>
            <span className="text-[11px] text-neutral-500 font-mono">
              {data.waveSteps.length} steps configured
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Template Buttons */}
            <button
              onClick={handleLoadFallenTemplate}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
            >
              Load Fallen Template
            </button>
            <button
              onClick={handleLoadHardcoreTemplate}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
            >
              Load Hardcore Template
            </button>
            <button
              onClick={handleAddWaveStep}
              className="px-3 py-1 text-[11px] font-bold rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Wave</span>
            </button>
          </div>
        </div>

        {/* Wave Table */}
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900 text-[11px] font-mono uppercase text-neutral-400">
                  <th className="py-2.5 px-3 w-20">Wave</th>
                  <th className="py-2.5 px-3 w-28">Player</th>
                  <th className="py-2.5 px-3">Instruction / Action</th>
                  <th className="py-2.5 px-3 w-48">Timing / Notes</th>
                  <th className="py-2.5 px-3 w-20 text-center">Skip</th>
                  <th className="py-2.5 px-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {data.waveSteps.map((step, idx) => (
                  <tr key={step.id || idx} className="hover:bg-neutral-900/80 transition-colors">
                    {/* Wave Number */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={step.wave}
                        onChange={e =>
                          handleUpdateWaveStep(idx, { wave: parseInt(e.target.value) || 0 })
                        }
                        className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none"
                      />
                    </td>

                    {/* Player Slot */}
                    <td className="py-2 px-3">
                      <select
                        value={step.player}
                        onChange={e => handleUpdateWaveStep(idx, { player: e.target.value as any })}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="All">All</option>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                        <option value="P4">P4</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={step.action}
                        onChange={e => handleUpdateWaveStep(idx, { action: e.target.value })}
                        placeholder="e.g. Place Commander Lv.2 or Upgrade Farms"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:border-neutral-600"
                      />
                    </td>

                    {/* Notes */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={step.notes}
                        onChange={e => handleUpdateWaveStep(idx, { notes: e.target.value })}
                        placeholder="Skip timing / note..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-300 text-xs focus:outline-none"
                      />
                    </td>

                    {/* Skip Checkbox */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!step.skip}
                        onChange={e => handleUpdateWaveStep(idx, { skip: e.target.checked })}
                        className="rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Delete Step */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleDeleteWaveStep(idx)}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* General Notes Textarea */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
          General Notes & Recommendations for Google Doc
        </label>
        <textarea
          rows={3}
          value={data.generalNotes}
          onChange={e => updateField('generalNotes', e.target.value)}
          placeholder="Key rules, ability chaining instructions, boss notes..."
          className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
        />
      </div>

      {/* Bottom Sticky-style Generation Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-neutral-400">
          <span className="text-white font-bold block">
            Ready to create your document?
          </span>
          <span className="text-[11px] text-neutral-500">
            Click Generate to get .docx file, rich clipboard text, and Google Docs template.
          </span>
        </div>

        <button
          onClick={onGenerateDoc}
          className="py-3 px-6 rounded-xl bg-white text-black font-black text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>
            Generate Google Doc
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
