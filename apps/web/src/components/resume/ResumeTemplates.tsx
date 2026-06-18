import React from 'react';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    title: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  custom?: {
    certifications?: string[];
    languages?: string[];
  };
}

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
}

export function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const { personalInfo, experience = [], education = [], skills = [], projects = [], custom = {} } = data;

  const renderBullets = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((bullet, idx) => {
      const trimmed = bullet.trim().replace(/^-\s*/, '');
      if (!trimmed) return null;
      return (
        <li key={idx} className="text-slate-700 leading-relaxed text-xs list-disc ml-4 mb-1">
          {trimmed}
        </li>
      );
    });
  };

  // 1. Classic Minimalist
  if (templateId === 'minimalist') {
    return (
      <div className="bg-white text-slate-900 p-8 shadow-md font-sans w-full max-w-[210mm] mx-auto min-h-[297mm]">
        <div className="text-center border-b border-slate-300 pb-4 mb-6">
          <h1 className="text-3xl font-serif font-bold uppercase tracking-wide text-slate-900">{personalInfo.name || 'Your Name'}</h1>
          <p className="text-sm font-medium text-slate-600 mt-1 italic">{personalInfo.title || 'Professional Title'}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span className="underline">{personalInfo.website}</span>}
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2 font-serif">Summary</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3 font-serif">Professional Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{exp.role} — {exp.company}</span>
                    <span className="font-normal text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.location && <div className="text-slate-500 italic mb-1.5">{exp.location}</div>}
                  <ul className="list-disc ml-4 space-y-1">{renderBullets(exp.description)}</ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3 font-serif">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="font-normal text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-600">{edu.institution} {edu.gpa && `(GPA: ${edu.gpa})`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2 font-serif">Skills</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{skills.join(', ')}</p>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3 font-serif">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{proj.name} {proj.technologies && `[${proj.technologies}]`}</span>
                    {proj.link && <span className="font-normal text-slate-500 underline">{proj.link}</span>}
                  </div>
                  <p className="text-slate-600 mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Modern Professional
  if (templateId === 'modern') {
    return (
      <div className="bg-white text-slate-800 p-8 shadow-md font-sans w-full max-w-[210mm] mx-auto min-h-[297mm]">
        <div className="border-l-4 border-indigo-600 pl-4 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-950 uppercase tracking-tight">{personalInfo.name || 'Your Name'}</h1>
          <p className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mt-1">{personalInfo.title || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.website && <span>🔗 {personalInfo.website}</span>}
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-6 bg-slate-50 p-3.5 rounded-r-lg border-l border-indigo-600">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Professional Summary</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {experience.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Work History</h2>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute w-2 h-2 rounded-full bg-indigo-600 -left-[4.5px] top-1"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xs text-slate-900">{exp.role}</h3>
                          <p className="text-xs text-indigo-600/90 font-medium">{exp.company} {exp.location && `| ${exp.location}`}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">{renderBullets(exp.description)}</ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Featured Projects</h2>
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{proj.name}</span>
                        {proj.link && <span className="text-indigo-600 text-[10px] underline">{proj.link}</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{proj.technologies}</div>
                      <p className="text-slate-600 mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 space-y-6">
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Expertise</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium border border-indigo-100/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Education</h2>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-[11px] text-slate-600">{edu.fieldOfStudy}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">{edu.institution}</p>
                      <p className="text-[9px] text-indigo-600 font-medium mt-0.5">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Tech/Developer (Clean Tech/Grid styling)
  if (templateId === 'tech') {
    return (
      <div className="bg-slate-950 text-slate-100 p-8 shadow-md font-mono w-full max-w-[210mm] mx-auto min-h-[297mm]">
        <div className="border-b border-emerald-500 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-emerald-400">&gt; {personalInfo.name || 'Your Name'}</h1>
          <p className="text-slate-400 text-xs mt-1">// {personalInfo.title || 'Software Engineer'}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-2">
            <span>email: {personalInfo.email}</span>
            <span>phone: {personalInfo.phone}</span>
            <span>location: {personalInfo.location}</span>
            {personalInfo.website && <span className="text-emerald-400">web: {personalInfo.website}</span>}
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2"># summary</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2"># technical-skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-[11px] bg-slate-900 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3"># professional-experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{exp.role} @ {exp.company}</span>
                    <span className="text-slate-400 font-normal">[{exp.startDate} - {exp.current ? 'Present' : exp.endDate}]</span>
                  </div>
                  <ul className="mt-1 space-y-1">{renderBullets(exp.description)}</ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3"># build-portfolio</h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>{proj.name}</span>
                    {proj.link && <span className="underline text-slate-400">link</span>}
                  </div>
                  <div className="text-[10px] text-slate-400">tools: {proj.technologies}</div>
                  <p className="text-slate-300 mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2"># education</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between text-slate-200">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-400">[{edu.startDate} - {edu.endDate}]</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for remaining 7 templates (we will implement a generic layout that renders nicely, but let's provide visual variations)
  // Let's implement full layout variations for the other 7 templateIDs
  const getHeaderColor = () => {
    switch (templateId) {
      case 'executive': return 'bg-slate-900 text-white';
      case 'creative': return 'bg-rose-50 border-rose-200 text-slate-800';
      case 'academic': return 'bg-white border-b-2 border-slate-900 text-slate-900';
      case 'elegant': return 'bg-amber-50/50 border-amber-950/20 text-slate-900';
      case 'startup': return 'bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/10';
      default: return 'bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className="bg-white text-slate-800 p-8 shadow-md font-sans w-full max-w-[210mm] mx-auto min-h-[297mm]">
      <div className={`p-6 mb-6 border ${getHeaderColor()}`}>
        <h1 className="text-3xl font-extrabold tracking-tight">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-sm font-semibold opacity-90 mt-1">{personalInfo.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-75 mt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span className="underline">{personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-1 mb-2">Summary</h2>
          <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="font-normal text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-1.5">{exp.location}</p>
                <ul className="list-disc ml-4 space-y-1">{renderBullets(exp.description)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.fieldOfStudy}</p>
                  <p className="text-slate-500 italic">{edu.institution}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2 mb-3">Projects</h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <h3 className="font-semibold text-slate-900">{proj.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{proj.technologies}</p>
                    <p className="text-slate-600 mt-1">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
