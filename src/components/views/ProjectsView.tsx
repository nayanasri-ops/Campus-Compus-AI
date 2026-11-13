import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Sparkles,
  ArrowRight,
  Code2,
  Calendar,
  Layers,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { Project, User } from '../../types';

interface ProjectsViewProps {
  currentUser: User;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [teammateMatches, setTeammateMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackInput, setTechStackInput] = useState('Java, Spring Boot, React, PostgreSQL');
  const [architecture, setArchitecture] = useState('Microservices with Spring Cloud & Kafka');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [estimatedDuration, setEstimatedDuration] = useState('8 Weeks');
  const [teamSize, setTeamSize] = useState(4);
  const [rolesInput, setRolesInput] = useState('Frontend Lead, AI Engineer, Cybersecurity Analyst');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.projects || []);
      if (res.projects?.length > 0) {
        handleSelectProject(res.projects[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectProject = async (proj: Project) => {
    setSelectedProject(proj);
    setLoadingMatches(true);
    try {
      const res = await api.getProjectMatches(proj.id);
      setTeammateMatches(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProj = {
        title,
        problemStatement,
        techStack: techStackInput.split(',').map(s => s.trim()),
        architecture,
        difficulty,
        estimatedDuration,
        teamSize,
        rolesNeeded: rolesInput.split(',').map(s => s.trim()),
      };
      const res = await api.createProject(newProj);
      if (res.success) {
        setProjects(prev => [res.project, ...prev]);
        setSelectedProject(res.project);
        setShowCreateModal(false);
        confetti({ particleCount: 60, spread: 70 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5" /> Collaborative Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Project Teammate Matching & Ideas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Form high-performing student engineering teams for hackathons and capstone projects based on complementary roles, verified GitHub skills, and availability.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Project</span>
        </button>
      </div>

      {/* Main Grid: Projects List + Teammate Matching */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projects Column */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Campus Projects ({projects.length})
          </h2>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {projects.map(proj => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelectProject(proj)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-600 shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {proj.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {proj.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.problemStatement}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Led by: {proj.creatorName}</span>
                    <span>Team: {proj.teamSize} members</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project Teammates & AI Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {selectedProject ? (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>
                  <span className="text-xs text-indigo-400 font-mono">
                    {selectedProject.estimatedDuration}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedProject.problemStatement}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedProject.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roles Needed */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Roles Needed for this Project:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.rolesNeeded.map((role, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-amber-950/40 text-amber-200 border border-amber-800/50 text-xs font-semibold"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Recommended Teammates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Recommended Teammates</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Ranked by skill compatibility</span>
                </div>

                {loadingMatches ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Finding compatible students...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teammateMatches.slice(0, 3).map((match, i) => {
                      const student: User = match.student;
                      return (
                        <div
                          key={student.id}
                          className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white">{student.name}</h4>
                                <span className="px-2 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-semibold">
                                  {match.suggestedRole}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {student.branch} · Year {student.year} · CGPA {student.cgpa}
                              </p>
                              <p className="text-slate-300 mt-1 leading-normal text-[11px]">
                                {match.reason}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            <span className="text-xs font-extrabold text-emerald-400 tabular-nums">
                              {match.compatibility}% Match
                            </span>
                            <button
                              onClick={() => {
                                confetti({ particleCount: 40, spread: 60 });
                                alert(`Invitation dispatched to ${student.name} for role "${match.suggestedRole}"!`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] cursor-pointer"
                            >
                              Invite to Team
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select a project from the left to view architecture and teammate recommendations.
            </div>
          )}
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Project Profile</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Project Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue in Java 21"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Problem Statement:</label>
                <textarea
                  rows={2}
                  required
                  value={problemStatement}
                  onChange={e => setProblemStatement(e.target.value)}
                  placeholder="Describe the technical or real-world problem being solved..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tech Stack (comma separated):</label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={e => setTechStackInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Roles Needed (comma separated):</label>
                  <input
                    type="text"
                    value={rolesInput}
                    onChange={e => setRolesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duration:</label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={e => setEstimatedDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Team Size:</label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={teamSize}
                    onChange={e => setTeamSize(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer"
                >
                  Post Project (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
