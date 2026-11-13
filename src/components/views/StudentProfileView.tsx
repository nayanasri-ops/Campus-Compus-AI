import React, { useState, useRef } from 'react';
import {
  UserCheck,
  Save,
  Sparkles,
  ExternalLink,
  BookOpen,
  Award,
  CheckCircle2,
  Check,
  Camera,
  Upload,
  GraduationCap,
  Building2,
  Tag,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User } from '../../types';

interface StudentProfileViewProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onNavigateToCommunity?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateToCommunity,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [course, setCourse] = useState(currentUser.course || 'B.Tech Computer Science & Engineering');
  const [branch, setBranch] = useState(currentUser.branch || 'Computer Science & Engineering');
  const [college, setCollege] = useState(currentUser.college || 'VNR VJIET, Hyderabad');
  const [year, setYear] = useState(currentUser.year || '2nd Year');
  const [semester, setSemester] = useState(currentUser.semester || 4);
  const [cgpa, setCgpa] = useState(currentUser.cgpa || 8.5);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [skillsInput, setSkillsInput] = useState((currentUser.skills || ['Java', 'Cybersecurity', 'Python']).join(', '));
  const [interestsInput, setInterestsInput] = useState((currentUser.interests || ['AI', 'Cybersecurity']).join(', '));
  const [careerGoal, setCareerGoal] = useState(currentUser.careerGoal || 'Software Engineer');
  const [targetCompaniesInput, setTargetCompaniesInput] = useState(
    (currentUser.targetCompanies || ['Google', 'Microsoft']).join(', ')
  );
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedSkills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedInterests = interestsInput
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const updatedData: Partial<User> = {
        name: name.trim(),
        course: course.trim(),
        branch: branch.trim(),
        college: college.trim(),
        year: String(year).trim(),
        semester: Number(semester),
        cgpa: Number(cgpa),
        bio: bio.trim(),
        avatarUrl,
        skills: parsedSkills,
        interests: parsedInterests,
        skillsTeaching: parsedSkills.slice(0, 2),
        skillsLearning: parsedSkills.slice(2),
        careerGoal: careerGoal.trim(),
        targetCompanies: targetCompaniesInput.split(',').map(s => s.trim()).filter(Boolean),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
      };

      const res = await api.updateProfile(updatedData);
      if (res.success && res.profile) {
        onUpdateUser(res.profile);
        setSavedSuccess(true);
        confetti({ particleCount: 50, spread: 60 });
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Parsed arrays for live preview
  const previewSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
  const previewInterests = interestsInput.split(',').map(i => i.trim()).filter(Boolean);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                {name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              <span>Change</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium mt-0.5">
              {course} · {year}
            </p>
            <p className="text-xs text-slate-400">
              {college} · CGPA {cgpa}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Profile Saved to Community!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form on Left, Live Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl text-xs">
            {/* Photo Upload Zone */}
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Profile Photo Upload</span>
              </h3>
              <div className="flex items-center gap-4 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-700 text-indigo-200 font-semibold hover:bg-indigo-900 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Choose Photo from Device</span>
                </button>
                <p className="text-[11px] text-slate-400">Upload your authentic portrait photo (PNG, JPG, or WEBP)</p>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4 pb-4 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Student Academic Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course *</label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year of Study *</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    min={1}
                    max={8}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cgpa}
                    onChange={e => setCgpa(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Skills & Interests Tags */}
            <div className="space-y-4 pb-4 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <span>Skills & Interests</span>
              </h3>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Skills (comma-separated tags) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="e.g. Java, Cybersecurity, Python"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Other students can filter and find you by these skills.</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Interests (comma-separated tags) *
                </label>
                <input
                  type="text"
                  required
                  value={interestsInput}
                  onChange={e => setInterestsInput(e.target.value)}
                  placeholder="e.g. AI, Cybersecurity, Cloud"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Shared interests power intelligent peer connection matching.</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio *</label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Describe your technical background, current projects, and what you want to learn or build..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Career & Social Links */}
            <div className="space-y-4 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Career Goal</label>
                  <input
                    type="text"
                    value={careerGoal}
                    onChange={e => setCareerGoal(e.target.value)}
                    placeholder="e.g. Cybersecurity Engineer"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Companies</label>
                  <input
                    type="text"
                    value={targetCompaniesInput}
                    onChange={e => setTargetCompaniesInput(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Cisco"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-slate-400 text-[11px]">Changes are immediately updated in the community directory.</span>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Profile...' : 'Save Profile Card'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Profile Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">Live Community Card Preview</span>
            <span className="text-emerald-400 font-medium">As seen by peers</span>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-indigo-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] border border-indigo-500/30">
                You
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-bold text-white">{name || 'Your Name'}</h3>
                <p className="text-xs text-indigo-400 font-medium">{course || 'B.Tech'}</p>
                <p className="text-[11px] text-slate-400">Year: {year} · {college}</p>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(previewSkills.length > 0 ? previewSkills : ['Java', 'Cybersecurity', 'Python']).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-800 text-indigo-300 text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Interests:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(previewInterests.length > 0 ? previewInterests : ['AI', 'Cybersecurity']).map((i, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-violet-950/70 border border-violet-800 text-violet-300 text-[11px] font-medium"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 italic pt-1 leading-relaxed">
                Bio: {bio || 'Your bio will appear here in the community student directory.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Directory format verified</span>
              {onNavigateToCommunity && (
                <button
                  type="button"
                  onClick={onNavigateToCommunity}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
