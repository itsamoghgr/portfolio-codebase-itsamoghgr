import HeroSection from './components/home/HeroSection';
import AboutSection from './components/home/AboutSection';
import ExperienceSection from './components/home/ExperienceSection';
import ProjectsSection from './components/home/ProjectsSection';
import ContactSection from './components/home/ContactSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}