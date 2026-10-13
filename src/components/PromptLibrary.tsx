import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DEFAULT_PROMPT_TASKS, 
  PROMPT_TEMPLATES,
  getTasksByCategory,
  getCategoryStats,
  type AgentCategory,
  type PromptTask 
} from '../lib/promptLibrary';

// ============================================================
// PROMPT LIBRARY UI COMPONENT
// Display and manage agent tasks with categorization
// ============================================================

export default function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<PromptTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: AgentCategory | 'all'; label: string; icon: string; color: string }[] = [
    { id: 'all', label: 'All Tasks', icon: '📋', color: 'purple' },
    { id: 'monitoring', label: 'Monitoring', icon: '👁️', color: 'blue' },
    { id: 'analysis', label: 'Analysis', icon: '🔍', color: 'green' },
    { id: 'execution', label: 'Execution', icon: '⚡', color: 'yellow' },
    { id: 'risk_management', label: 'Risk Mgmt', icon: '🛡️', color: 'red' },
    { id: 'strategy', label: 'Strategy', icon: '🎯', color: 'cyan' },
    { id: 'notification', label: 'Notifications', icon: '🔔', color: 'orange' },
  ];

  const filteredTasks = DEFAULT_PROMPT_TASKS.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categoryStats = getCategoryStats();

  const priorityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  };

  const frequencyIcons = {
    realtime: '⚡',
    '1min': '🕐',
    '5min': '🕔',
    '15min': '🕒',
    '1hour': '🕛',
    daily: '📅',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📚</span> Prompt Library
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {DEFAULT_PROMPT_TASKS.length} tasks across {Object.keys(categoryStats).length} categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'grid'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
            }`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'list'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
            }`}
          >
            ☰ List
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, tags, or descriptions..."
          className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-900/50 border border-gray-800/50 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? `bg-${cat.color}-500/20 text-${cat.color}-300 border border-${cat.color}-500/40`
                : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:bg-gray-800/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {cat.id !== 'all' && (
              <span className="text-[10px] opacity-60">({categoryStats[cat.id as AgentCategory] || 0})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2'}>
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedTask(task)}
              className={`p-3 rounded-lg bg-gray-900/30 border border-gray-800/50 cursor-pointer hover:bg-gray-900/50 hover:border-purple-500/30 transition-all ${
                selectedTask?.id === task.id ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{task.name}</h3>
                    {task.enabled ? (
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${priorityColors[task.priority]}`}>
                  {task.priority.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-800/50 text-gray-400 text-[10px] border border-gray-700/50">
                  {frequencyIcons[task.frequency]} {task.frequency}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] border border-purple-500/20">
                  {task.subAgentType.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex gap-1 flex-wrap">
                {task.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-800/30 text-gray-500 text-[9px]">
                    #{tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded bg-gray-800/30 text-gray-500 text-[9px]">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{selectedTask.name}</h2>
                    <p className="text-sm text-gray-400">{selectedTask.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-500 hover:text-gray-300 text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Category</div>
                    <div className="text-sm text-white capitalize">{selectedTask.category.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Sub-Agent</div>
                    <div className="text-sm text-white capitalize">{selectedTask.subAgentType.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Priority</div>
                    <div className={`text-sm font-bold capitalize ${
                      selectedTask.priority === 'critical' ? 'text-red-400' :
                      selectedTask.priority === 'high' ? 'text-orange-400' :
                      selectedTask.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {selectedTask.priority}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Frequency</div>
                    <div className="text-sm text-white">
                      {frequencyIcons[selectedTask.frequency]} {selectedTask.frequency}
                    </div>
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Prompt Template</div>
                  <div className="p-3 rounded-lg bg-gray-950/50 border border-gray-800/50">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                      {selectedTask.prompt}
                    </pre>
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Parameters</div>
                  <div className="p-3 rounded-lg bg-gray-950/50 border border-gray-800/50">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                      {JSON.stringify(selectedTask.parameters, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tags</div>
                  <div className="flex gap-1 flex-wrap">
                    {selectedTask.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dependencies */}
                {selectedTask.dependencies.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dependencies</div>
                    <div className="space-y-1">
                      {selectedTask.dependencies.map((dep) => {
                        const depTask = DEFAULT_PROMPT_TASKS.find(t => t.id === dep);
                        return (
                          <div key={dep} className="px-3 py-2 rounded bg-gray-800/30 border border-gray-700/30 text-xs text-gray-300">
                            → {depTask?.name || dep}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${selectedTask.enabled ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <span className="text-sm text-gray-400">
                      {selectedTask.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Output: {selectedTask.outputFormat}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <div className="text-sm text-gray-500">No tasks found</div>
          <div className="text-xs text-gray-600 mt-1">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
