type BadgeVariant = 'signature' | 'popular' | 'new'

interface BadgeProps {
  variant: BadgeVariant
}

const badgeConfig: Record<BadgeVariant, { label: string; className: string }> = {
  signature: { label: '시그니처', className: 'bg-amber-100 text-amber-800' },
  popular: { label: '인기', className: 'bg-rose-100 text-rose-800' },
  new: { label: '신메뉴', className: 'bg-green-100 text-green-800' },
}

export function Badge({ variant }: BadgeProps) {
  const config = badgeConfig[variant]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
      aria-label={`${config.label} 메뉴`}
    >
      {config.label}
    </span>
  )
}
