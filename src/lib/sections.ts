/** Home-page sections in page order. Section numbers (01, 02…) come from this list. */
export const HOME_SECTIONS = ['experience', 'education', 'projects', 'process', 'journey', 'languages', 'life', 'music', 'activities', 'resume', 'recommendations', 'contact'] as const
export type SectionId = (typeof HOME_SECTIONS)[number]

export function sectionNumber(id: string) {
  const i = HOME_SECTIONS.indexOf(id as SectionId)
  return i < 0 ? undefined : String(i + 1).padStart(2, '0')
}
