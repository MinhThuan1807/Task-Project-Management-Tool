import { Task } from '../../../../lib/types'
import { ScrollArea } from '../../../ui/scroll-area'
import { Card, CardContent } from '../../../ui/card'
import { TaskCard } from '../BoardView/Comlumn/TaskCard/TaskCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type SprintListViewProps = {
  tasks: Task[]
  columns: { id: string; title: string }[]
  onTaskClick: (task: Task) => void
  canEdit?: boolean
}

const SprintListView = ({
  tasks,
  columns,
  onTaskClick,
  canEdit
}: SprintListViewProps) => {
  const getCommentCount = () => Math.floor(Math.random() * 10)
  const getAttachmentCount = () => Math.floor(Math.random() * 5)

  return (
    <ScrollArea className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Button
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 cursor-pointer"
                    variant="ghost"
                    // onClick={() => {
                    //   setColumnIsSelected(true)
                    // }}
                    >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </Button>
                  <p className="text-sm text-gray-400">No tasks</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Drag tasks here or click + to add
                  </p>
                </div>
        ) : (
          tasks.map((task) => {
            return (
              // <Card
              //   key={task._id}
              //   className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              //   onClick={() => onTaskClick(task)}
              // >
              //   <CardContent className="p-4">
              //     <div className="flex items-start gap-4">
              //       <div className="flex-1 space-y-3">
              //         {/* Title */}
              //         <div className="flex items-start justify-between gap-3">
              //           <h3 className="text-base text-gray-900 hover:text-blue-600 transition-colors">
              //             {task.title}
              //           </h3>
              //           <DropdownMenu>
              //             <DropdownMenuTrigger
              //               asChild
              //               onClick={(e) => e.stopPropagation()}
              //             >
              //               <Button
              //                 variant="ghost"
              //                 size="icon"
              //                 className="h-8 w-8"
              //               >
              //                 <MoreVertical className="w-4 h-4" />
              //               </Button>
              //             </DropdownMenuTrigger>
              //             <DropdownMenuContent
              //               align="end"
              //               onClick={(e) => e.stopPropagation()}
              //             >
              //               <DropdownMenuItem>Edit Task</DropdownMenuItem>
              //               <DropdownMenuItem>Move to...</DropdownMenuItem>
              //               <DropdownMenuItem>Duplicate</DropdownMenuItem>
              //               <DropdownMenuSeparator />
              //               <DropdownMenuItem className="text-red-600">
              //                 Delete Task
              //               </DropdownMenuItem>
              //             </DropdownMenuContent>
              //           </DropdownMenu>
              //         </div>

              //         {/* Description */}
              //         {task.description && (
              //           <p className="text-sm text-gray-600 line-clamp-2">
              //             {task.description}
              //           </p>
              //         )}

              //         {/* Badges & Info */}
              //         <div className="flex items-center gap-2 flex-wrap">
              //           <Badge variant="outline" className="bg-gray-50">
              //             {columns.find((c) => c.id === task.boardColumnId)
              //               ?.title || task.boardColumnId}
              //           </Badge>
              //           <Badge className={getPriorityColor(task.priority)}>
              //             {task.priority}
              //           </Badge>
              //           {task.storyPoint && task.storyPoint > 0 && (
              //             <Badge
              //               variant="outline"
              //               className="bg-blue-50 text-blue-700 border-blue-200"
              //             >
              //               {task.storyPoint} SP
              //             </Badge>
              //           )}
              //           {/* {task.labels?.map((label) => (
              //             <Badge
              //               key={label}
              //               variant="outline"
              //               className="bg-gray-50 text-gray-700"
              //             >
              //               {label}
              //             </Badge>
              //           ))} */}
              //         </div>

              //         {/* Due Date & Stats */}
              //         <div className="flex items-center gap-4 text-xs text-gray-500">
              //           {task.dueDate && (
              //             <div className="flex items-center gap-1">
              //               <Calendar className="w-3.5 h-3.5" />
              //               <span>Due {formatDate(task.dueDate)}</span>
              //             </div>
              //           )}
              //           {commentCount > 0 && (
              //             <div className="flex items-center gap-1">
              //               <MessageSquare className="w-3.5 h-3.5" />
              //               <span>{commentCount}</span>
              //             </div>
              //           )}
              //           {attachmentCount > 0 && (
              //             <div className="flex items-center gap-1">
              //               <Paperclip className="w-3.5 h-3.5" />
              //               <span>{attachmentCount}</span>
              //             </div>
              //           )}
              //         </div>
              //       </div>

              //       {/* Assignees */}
              //       <div className="flex -space-x-2 shrink-0">
              //         {task.assigneeIds?.map((assignee) => (
              //           <Avatar
              //             key={assignee}
              //             className="w-8 h-8 border-2 border-white"
              //           >
              //             <AvatarImage
              //               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`}
              //             />
              //             <AvatarFallback>U</AvatarFallback>
              //           </Avatar>
              //         ))}
              //         {(!task.assigneeIds || task.assigneeIds.length === 0) && (
              //           <Avatar className="w-8 h-8 border-2 border-white">
              //             <AvatarFallback className="bg-gray-200">
              //               ?
              //             </AvatarFallback>
              //           </Avatar>
              //         )}
              //       </div>
              //     </div>
              //   </CardContent>
              // </Card>
              <TaskCard 
                task={task}
                key={task._id} 
                Click={() => onTaskClick(task)} 
                canEdit={canEdit}
                // className=
              />
            )
          })
        )}
      </div>
    </ScrollArea>
  )
}
export default SprintListView
