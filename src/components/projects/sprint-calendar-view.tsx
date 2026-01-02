import { useState } from 'react';
import { Task, Sprint } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPriorityColor } from '../../lib/utils';

type SprintCalendarViewProps = {
  tasks: Task[];
  sprint: Sprint;
  onTaskClick: (task: Task) => void;
};

export function SprintCalendarView({ tasks, sprint, onTaskClick }: SprintCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get calendar grid
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (direction === 'next' ? 1 : -1),
        1
      )
    );
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isInSprint = (date: Date | null) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= sprint.startDate && dateStr <= sprint.endDate;
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <Card className="border-0 shadow-lg max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm text-gray-600"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const today = isToday(date);
              const inSprint = isInSprint(date);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border rounded-lg p-2 ${
                    date ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                  } ${today ? 'border-blue-500 border-2' : 'border-gray-200'} ${
                    inSprint && date ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {date && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-sm ${
                            today
                              ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                              : 'text-gray-900'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className="text-xs p-1.5 rounded bg-white border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-1">
                              <div
                                className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                                  task.priority === 'critical'
                                    ? 'bg-red-500'
                                    : task.priority === 'high'
                                    ? 'bg-orange-500'
                                    : task.priority === 'medium'
                                    ? 'bg-blue-500'
                                    : 'bg-gray-500'
                                }`}
                              />
                              <span className="line-clamp-2 text-gray-900">
                                {task.title}
                              </span>
                            </div>
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-blue-500 rounded" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 bg-blue-50/30 border border-gray-200 rounded" />
              <span>Sprint Duration</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span>Low</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
