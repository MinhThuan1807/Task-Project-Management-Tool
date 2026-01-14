import { useState } from 'react';
import { Project, Sprint, User } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Target,
  Download,
  Calendar,
  Activity,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

type ReportsViewProps = {
  project: Project;
  sprints: Sprint[];
  currentUser: User;
};

// Mock data for charts
const mockBurndownData = [
  { date: 'Dec 1', ideal: 50, actual: 48 },
  { date: 'Dec 3', ideal: 45, actual: 44 },
  { date: 'Dec 5', ideal: 40, actual: 42 },
  { date: 'Dec 7', ideal: 35, actual: 38 },
  { date: 'Dec 9', ideal: 30, actual: 32 },
  { date: 'Dec 11', ideal: 25, actual: 26 },
  { date: 'Dec 13', ideal: 20, actual: 20 },
  { date: 'Dec 15', ideal: 15, actual: 14 },
  { date: 'Dec 17', ideal: 10, actual: 8 },
  { date: 'Dec 19', ideal: 5, actual: 4 },
  { date: 'Dec 21', ideal: 0, actual: 0 },
];

const mockVelocityData = [
  { sprint: 'Sprint 1', planned: 45, completed: 42 },
  { sprint: 'Sprint 2', planned: 50, completed: 48 },
  { sprint: 'Sprint 3', planned: 48, completed: 45 },
  { sprint: 'Sprint 4', planned: 52, completed: 50 },
  { sprint: 'Sprint 5', planned: 50, completed: 48 },
];

const mockTaskDistribution = [
  { name: 'To Done', value: 12, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#3b82f6' },
  { name: 'Todo', value: 5, color: '#f59e0b' },
  { name: 'Blocked', value: 2, color: '#ef4444' },
];

const mockTeamContributions = [
  { name: 'John Doe', tasks: 18 },
  { name: 'Sarah Chen', tasks: 15 },
  { name: 'Mike Kumar', tasks: 13 },
  { name: 'Alan Jia', tasks: 11 },
  { name: 'Emma Wilson', tasks: 8 },
];

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  ideal: '#94a3b8',
};

export function ReportsView({ project, sprints, currentUser }: ReportsViewProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(
    sprints[0]?.id || ''
  );

  const selectedSprint = sprints.find((s) => s.id === selectedSprintId);

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // TODO: Implement PDF export
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // TODO: Implement CSV export
  };

  // Calculate metrics
  const velocity = 42;
  const totalVelocity = 50;
  const completionRate = Math.round((velocity / totalVelocity) * 100);
  const totalTasks = 17;
  const completedTasks = 20;
  const teamMembers = 8;
  const activeMembers = 5;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-gray-900">Sprint Reports</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track sprint progress and team performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Sprint Selector */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedSprint && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(selectedSprint.startDate)} - {formatDate(selectedSprint.endDate)}
                </span>
              </div>
              <Badge className="bg-green-500">Completed</Badge>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Velocity */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-blue-700">Story points</span>
                </div>
                <div className="text-3xl text-blue-900 mb-1">{velocity}</div>
                <p className="text-sm text-blue-700">Velocity</p>
                <p className="text-xs text-blue-600 mt-1">+4 (+10%)</p>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-700">Of tasks done</span>
                </div>
                <div className="text-3xl text-green-900 mb-1">{completionRate}%</div>
                <p className="text-sm text-green-700">Completion Rate</p>
              </CardContent>
            </Card>

            {/* Total Tasks */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-purple-700">Completed</span>
                </div>
                <div className="text-3xl text-purple-900 mb-1">
                  {totalTasks}/{completedTasks}
                </div>
                <p className="text-sm text-purple-700">Total Tasks</p>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-orange-700">Active</span>
                </div>
                <div className="text-3xl text-orange-900 mb-1">{teamMembers}</div>
                <p className="text-sm text-orange-700">Team Members</p>
                <p className="text-xs text-orange-600 mt-1">{activeMembers} SUM M.</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sprint Burndown */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Sprint Burndown</CardTitle>
                <CardDescription>Track remaining work over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockBurndownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ideal"
                      stroke={COLORS.ideal}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Ideal Burndown"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      name="Actual Progress"
                      dot={{ fill: COLORS.primary, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Team Velocity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Team Velocity (Last 5 Sprints)</CardTitle>
                <CardDescription>Compare planned vs completed work</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockVelocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="sprint"
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="planned"
                      fill="#dbeafe"
                      name="Planned"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill={COLORS.primary}
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Distribution */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Task Distribution</CardTitle>
                <CardDescription>Breakdown by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockTaskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockTaskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="ml-8 space-y-2">
                    {mockTaskDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className="text-sm text-gray-900 ml-auto">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Contributions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Team Contributions</CardTitle>
                <CardDescription>Tasks completed by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeamContributions.map((member, index) => (
                    <div key={member.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700">{member.name}</span>
                        </div>
                        <span className="text-sm text-gray-900">{member.tasks} SP</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(member.tasks / mockTeamContributions[0].tasks) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
