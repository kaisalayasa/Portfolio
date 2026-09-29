import { Media } from './Media'

export function OrgLogo({ name, logo }: { name: string; logo: string }) {
  return <Media src={logo} alt={`${name} logo`} aspect="1/1" className="size-12 shrink-0 rounded-xl border border-line bg-white" imgClassName="object-contain! p-1" />
}
