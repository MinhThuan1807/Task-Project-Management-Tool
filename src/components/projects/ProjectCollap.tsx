import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight, List, FolderKanban, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/lib/types'

interface ProjectCollapProps {
  project: Project
  isSelected: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  sprintLink: string
}

const ProjectCollap = ({
  project,
  isSelected,
  isOpen,
  onOpenChange,
  sprintLink
}: ProjectCollapProps) => (
  <Collapsible
    key={project._id}
    open={isOpen}
    onOpenChange={onOpenChange}
    className="group/collapsible"
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          isActive={isSelected}
          tooltip={project.name}
          asChild
        >
         <Link href={`/projects/${project._id}`} className="flex items-center w-full">
            <Avatar className="w-4 h-4">
              <AvatarImage src={project.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px]">
                {project.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{project.name}</span>
            <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
         </Link>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href={`/projects/${project._id}/backlog`}>
                <List className="w-4 h-4" />
                <span>Product Backlog</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              asChild
              className={!sprintLink ? 'cursor-not-allowed opacity-50' : ''}
            >
              <Link
                href={
                  sprintLink
                    ? `/projects/${project._id}/${sprintLink}`
                    : `/projects/${project._id}/backlog`
                }
                tabIndex={!sprintLink ? -1 : 0}
                aria-disabled={!sprintLink}
                onClick={(e) => {
                  if (!sprintLink) e.preventDefault()
                }}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Sprint Board</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href={`/projects/${project._id}/report`}>
                <BarChart2 className="w-4 h-4" />
                <span>Reports</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
)

export default ProjectCollap
