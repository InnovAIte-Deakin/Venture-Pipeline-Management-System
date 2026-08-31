interface TeamAvatarStackProps {
  team: string[]
  size?: "sm" | "md"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
}

export function TeamAvatarStack({ team, size = "sm" }: TeamAvatarStackProps) {
  const avatarSize = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
  const visibleTeam = team.slice(0, 3)

  return (
    <div className="flex -space-x-2" aria-label={`Team: ${team.join(", ")}`}>
      {visibleTeam.map((member) => (
        <div
          key={member}
          className={`${avatarSize} rounded-full border-2 border-white bg-blue-100 flex items-center justify-center font-medium text-blue-600`}
          title={member}
        >
          {getInitials(member)}
        </div>
      ))}
      {team.length > 3 && (
        <div className={`${avatarSize} rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-medium text-gray-600`}>
          +{team.length - 3}
        </div>
      )}
    </div>
  )
}
