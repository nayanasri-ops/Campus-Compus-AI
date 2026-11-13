import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Star,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Filter,
  DollarSign,
  Award
} from 'lucide-react';
import { Course } from '../../types';

interface CoursesViewProps {
  courses: Course[];
}

export const CoursesView: React.FC<CoursesViewProps> = ({ courses }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const categories = ['All', 'Java', 'Cloud', 'Cybersecurity', 'AI/ML', 'Web Development', 'Data Science', 'DevOps'];

  const filtered = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.skillsGained.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesPrice = priceFilter === 'All' || (priceFilter === 'Free' ? c.isFree : !c.isFree);
    const matchesDiff = difficultyFilter === 'All' || c.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesPrice && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Curricular Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Course & Certification Recommender
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Curated programs from Oracle, Coursera, NPTEL, Cisco, AWS, and Google aligned with your weak subjects and Java Backend career targets.
          </p>
        </div>

        <div className="text-right p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <span className="text-[11px] text-slate-400 block">Catalog Inventory</span>
          <span className="text-xs font-bold text-indigo-300 font-mono">
            {courses.length} Verified Programs
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, skills, or providers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div
            key={course.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <div className="space-y-3">
              {/* Header: Provider & Difficulty */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                  {course.provider}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{course.difficulty}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      course.isFree
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {course.isFree ? 'FREE' : course.price || 'PAID'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {course.title}
              </h3>

              {/* AI Recommendation Reason */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 space-y-1">
                <span className="text-[10px] font-semibold text-cyan-300 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Why AI Recommends It
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {course.aiRecommendationReason}
                </p>
              </div>

              {/* Skills Gained */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Skills Gained:
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {course.skillsGained.join(' · ')}
                </p>
              </div>

              {/* Metadata row */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-slate-500 text-[11px] tabular-nums">
                    ({course.reviewCount.toLocaleString()})
                  </span>
                </div>
                <span>{course.duration}</span>
              </div>
            </div>

            {/* Action */}
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore Course Syllabus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
