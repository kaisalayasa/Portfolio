import { lazy, useEffect } from 'react'
import { profile } from '@/content/profile'
import { LazySection } from '@/components/ui/Primitives'
import { Hero } from '@/sections/Hero'
import { Belt } from '@/sections/Belt'
import { Footer } from '@/sections/Footer'

const Experience = lazy(() => import('@/sections/Experience'))
const Education = lazy(() => import('@/sections/Education'))
const Projects = lazy(() => import('@/sections/Projects'))
const HowIBuild = lazy(() => import('@/sections/HowIBuild'))
const Journey = lazy(() => import('@/sections/Journey'))
const Languages = lazy(() => import('@/sections/Languages'))
const Life = lazy(() => import('@/sections/Life'))
const Music = lazy(() => import('@/sections/Music'))
const Activities = lazy(() => import('@/sections/Activities'))
const Recommendations = lazy(() => import('@/sections/Recommendations'))
const Contact = lazy(() => import('@/sections/Contact'))
const Resume = lazy(() => import('@/sections/Resume'))

/** Order matches HOME_SECTIONS in src/lib/sections.ts (which numbers them). */
export default function Home() {
  useEffect(() => {
    document.title = profile.seo.title
  }, [])

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Belt />
        <LazySection id="experience" minHeight={1000}>
          <Experience />
        </LazySection>
        <LazySection id="education" minHeight={900}>
          <Education />
        </LazySection>
        <LazySection id="projects" minHeight={1400}>
          <Projects />
        </LazySection>
        <LazySection id="process" minHeight={900}>
          <HowIBuild />
        </LazySection>
        <LazySection id="journey" minHeight={800}>
          <Journey />
        </LazySection>
        <LazySection id="languages" minHeight={2000}>
          <Languages />
        </LazySection>
        <LazySection id="life" minHeight={900}>
          <Life />
        </LazySection>
        <LazySection id="music" minHeight={1000}>
          <Music />
        </LazySection>
        <LazySection id="activities" minHeight={900}>
          <Activities />
        </LazySection>
        <LazySection id="resume" minHeight={900}>
          <Resume />
        </LazySection>
        <LazySection id="recommendations" minHeight={700}>
          <Recommendations />
        </LazySection>
        <LazySection id="contact" minHeight={700}>
          <Contact />
        </LazySection>
      </main>
      <Footer />
    </>
  )
}
