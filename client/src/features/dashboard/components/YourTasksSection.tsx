import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { myTasksHref } from '../../tasks/taskListFilters'
import type { DashboardStats } from '../computeDashboardStats'
import { PriorityBreakdown } from './PriorityBreakdown'
import { SectionHeading } from './SectionHeading'
import { StatCard } from './StatCard'

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
    gap: { xs: 1.5, sm: 2.25 },
  },
} satisfies Record<string, SxProps<Theme>>

// The tiles count active projects only, so every link filters the same way
// and lands on exactly the tasks it counted.
const ACTIVE_PROJECTS = { projectStatus: 'Active' } as const

// Stat tiles for the tasks assigned to the user; each links to My Tasks
// pre-filtered to the tasks it counts.
export function YourTasksSection({
  stats,
  openStatusNames,
  doneStatusNames,
}: {
  stats: DashboardStats
  openStatusNames: string[]
  doneStatusNames: string[]
}) {
  return (
    <Box data-testid="your-tasks-section">
      <SectionHeading
        title="Your tasks"
        subtitle="Assigned to you across active projects"
      />
      <Box sx={styles.grid}>
        <StatCard
          label="Open tasks"
          value={stats.open}
          accentColor={stats.open ? 'primary.main' : undefined}
          to={myTasksHref({ ...ACTIVE_PROJECTS, statusNames: openStatusNames })}
          testId="your-tasks-section-open-tasks"
        >
          <PriorityBreakdown
            counts={stats.openByPriority}
            hrefFor={(priority) =>
              myTasksHref({
                ...ACTIVE_PROJECTS,
                statusNames: openStatusNames,
                priorities: [priority],
              })
            }
          />
        </StatCard>
        <StatCard
          label="Overdue"
          value={stats.overdue}
          accentColor={stats.overdue ? 'error.main' : undefined}
          note="Past their due date"
          to={myTasksHref({
            ...ACTIVE_PROJECTS,
            statusNames: openStatusNames,
            due: ['overdue'],
          })}
          testId="your-tasks-section-overdue"
        />
        <StatCard
          label="Due this week"
          value={stats.dueThisWeek}
          accentColor={stats.dueThisWeek ? 'warning.main' : undefined}
          note="Due in the next 7 days"
          to={myTasksHref({
            ...ACTIVE_PROJECTS,
            statusNames: openStatusNames,
            due: ['next7'],
          })}
          testId="your-tasks-section-due-this-week"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          accentColor={stats.completed ? 'success.main' : undefined}
          note={`of ${stats.assigned} assigned`}
          to={myTasksHref({ ...ACTIVE_PROJECTS, statusNames: doneStatusNames })}
          testId="your-tasks-section-completed"
        />
      </Box>
    </Box>
  )
}
