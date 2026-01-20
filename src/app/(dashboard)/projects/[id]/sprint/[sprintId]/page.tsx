import dynamic from "next/dynamic"
const SprintBoardDnd = dynamic(() => import('@/components/projects/sprint-board-dnd'))

export default function SprintPage() {
  return (
    <SprintBoardDnd/>
  )
}
