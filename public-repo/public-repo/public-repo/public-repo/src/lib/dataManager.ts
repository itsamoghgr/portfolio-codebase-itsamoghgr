import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveDemoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  category?: string;
  startDate?: string;
  endDate?: string;
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
  type?: 'work' | 'education';
  location?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
}

export interface Personal {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: {
    technical: string[];
    soft: string[];
  };
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  resume: {
    url: string;
    lastUpdated: string;
  };
  profileImage: string;
}

export class DataManager {
  private static getFilePath(filename: string): string {
    return path.join(dataDir, `${filename}.json`);
  }

  private static readJsonFile<T>(filename: string): T {
    const filePath = this.getFilePath(filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  private static writeJsonFile<T>(filename: string, data: T): void {
    const filePath = this.getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Projects
  static getProjects(): Project[] {
    const data = this.readJsonFile<{ projects: Project[] }>('projects');
    return data.projects;
  }

  static getProject(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(project => project.id === id) || null;
  }

  static addProject(project: Omit<Project, 'id'>): Project {
    const projects = this.getProjects();
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    projects.push(newProject);
    this.writeJsonFile('projects', { projects });
    return newProject;
  }

  static updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) return null;
    
    projects[index] = { ...projects[index], ...updates };
    this.writeJsonFile('projects', { projects });
    return projects[index];
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (filteredProjects.length === projects.length) return false;
    
    this.writeJsonFile('projects', { projects: filteredProjects });
    return true;
  }

  // Experience
  static getExperiences(): Experience[] {
    const data = this.readJsonFile<{ experiences: Experience[] }>('experience');
    return data.experiences;
  }

  static getExperience(id: string): Experience | null {
    const experiences = this.getExperiences();
    return experiences.find(experience => experience.id === id) || null;
  }

  static addExperience(experience: Omit<Experience, 'id'>): Experience {
    const experiences = this.getExperiences();
    const newExperience = {
      ...experience,
      id: Date.now().toString()
    };
    experiences.push(newExperience);
    this.writeJsonFile('experience', { experiences });
    return newExperience;
  }

  static updateExperience(id: string, updates: Partial<Experience>): Experience | null {
    const experiences = this.getExperiences();
    const index = experiences.findIndex(experience => experience.id === id);
    
    if (index === -1) return null;
    
    experiences[index] = { ...experiences[index], ...updates };
    this.writeJsonFile('experience', { experiences });
    return experiences[index];
  }

  static deleteExperience(id: string): boolean {
    const experiences = this.getExperiences();
    const filteredExperiences = experiences.filter(experience => experience.id !== id);
    
    if (filteredExperiences.length === experiences.length) return false;
    
    this.writeJsonFile('experience', { experiences: filteredExperiences });
    return true;
  }

  // Personal Info
  static getPersonalInfo(): Personal {
    const data = this.readJsonFile<{ personal: Personal }>('personal');
    return data.personal;
  }

  static updatePersonalInfo(updates: Partial<Personal>): Personal {
    const currentInfo = this.getPersonalInfo();
    const updatedInfo = { ...currentInfo, ...updates };
    this.writeJsonFile('personal', { personal: updatedInfo });
    return updatedInfo;
  }
}