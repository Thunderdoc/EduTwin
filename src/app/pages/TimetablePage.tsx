import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { curriculumForGrade } from '../lib/schoolCurriculum';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ArrowLeft, Calendar, Clock, Bell, BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type ScheduleEvent = { time: string; title: string; type: string; duration: string; color: string };
type WeeklyTimetable = Record<string, ScheduleEvent[]>;
const TIMETABLE_KEY = 'eduflow_timetable_v2';
function buildStudyPlan(subjects: string[], grade: number, dailyGoalMinutes: number): WeeklyTimetable {
  const curriculum = curriculumForGrade(grade);
  const selected = subjects.length ? subjects : Object.keys(curriculum.subjects);
  return Object.fromEntries(weekDays.map((day, index) => {
    const subject = selected[index % Math.max(1, selected.length)] || 'Study';
    const topics = curriculum.subjects[subject] || ['Review a topic from your class materials'];
    const event: ScheduleEvent = { time: '05:00 PM', title: `${subject} · ${topics[index % topics.length]}`, type: 'Suggested Study Session', duration: `${dailyGoalMinutes} min`, color: 'green' };
    return [day, index < 5 ? [event] : []];
  }));
}

export default function TimetablePage() {
  const navigate = useNavigate();
  const { learnerProfile, selectedSubjects, userPreferences, userProfile } = useApp();
  const learnerGrade = learnerProfile?.grade ?? 6;
  const scheduleKey = `${TIMETABLE_KEY}:${encodeURIComponent(userProfile?.id || 'anonymous')}`;
  const reminderKey = `eduflow_reminder_preferences:${encodeURIComponent(userProfile?.id || 'anonymous')}`;
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [reminderEnabled, setReminderEnabled] = useState(() => localStorage.getItem(`${reminderKey}:enabled`) !== 'false');
  const [reminderTime, setReminderTime] = useState(() => Number(localStorage.getItem(`${reminderKey}:lead`) || 15));
  const [timetableData, setTimetableData] = useState<WeeklyTimetable>(() => { try { const saved = localStorage.getItem(scheduleKey); return saved ? { ...buildStudyPlan(selectedSubjects, learnerGrade, userPreferences.dailyGoalMinutes), ...JSON.parse(saved) } : buildStudyPlan(selectedSubjects, learnerGrade, userPreferences.dailyGoalMinutes); } catch { return buildStudyPlan(selectedSubjects, learnerGrade, userPreferences.dailyGoalMinutes); } });
  useEffect(() => { localStorage.setItem(scheduleKey, JSON.stringify(timetableData)); }, [scheduleKey, timetableData]);
  useEffect(() => { localStorage.setItem(`${reminderKey}:enabled`, String(reminderEnabled)); localStorage.setItem(`${reminderKey}:lead`, String(reminderTime)); }, [reminderKey, reminderEnabled, reminderTime]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{day: string; index: number; event: any} | null>(null);
  const [newEvent, setNewEvent] = useState({
    time: '',
    title: '',
    type: 'Class',
    duration: '',
    color: 'blue',
  });

  const handleEditEvent = (day: string, index: number) => {
    const event = timetableData[day as keyof typeof timetableData][index];
    setEditingEvent({ day, index, event: { ...event } });
    setNewEvent({
      time: event.time,
      title: event.title,
      type: event.type,
      duration: event.duration,
      color: event.color,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;

    setTimetableData((prev) => {
      const newData = { ...prev };
      const dayData = [...newData[editingEvent.day as keyof typeof timetableData]];
      dayData[editingEvent.index] = newEvent;
      newData[editingEvent.day as keyof typeof timetableData] = dayData;
      return newData;
    });

    toast.success(`Updated "${newEvent.title}"!`);
    setShowEditDialog(false);
    setEditingEvent(null);
    resetNewEvent();
  };

  const handleDeleteEvent = (day: string, index: number, eventTitle: string) => {
    setTimetableData((prev) => {
      const newData = { ...prev };
      const dayData = [...newData[day as keyof typeof timetableData]];
      dayData.splice(index, 1);
      newData[day as keyof typeof timetableData] = dayData;
      return newData;
    });
    toast.success(`Deleted "${eventTitle}" from ${day}`);
  };

  const handleAddNewEvent = () => {
    resetNewEvent();
    setShowAddDialog(true);
  };

  const handleSaveNewEvent = () => {
    if (!newEvent.time || !newEvent.title || !newEvent.duration) {
      toast.error('Please fill in all fields');
      return;
    }

    setTimetableData((prev) => {
      const newData = { ...prev };
      const dayData = [...newData[selectedDay as keyof typeof timetableData]];
      dayData.push(newEvent);
      // Sort by time
      dayData.sort((a, b) => a.time.localeCompare(b.time));
      newData[selectedDay as keyof typeof timetableData] = dayData;
      return newData;
    });

    toast.success(`Added "${newEvent.title}" to ${selectedDay}!`);
    setShowAddDialog(false);
    resetNewEvent();
  };

  const resetNewEvent = () => {
    setNewEvent({
      time: '',
      title: '',
      type: 'Class',
      duration: '',
      color: 'blue',
    });
  };

  const allEvents = Object.values(timetableData).flat();
  const classCount = allEvents.filter((event) => event.type === 'Class').length;
  const studyMinutes = allEvents.filter((event) => event.type.toLowerCase().includes('study')).reduce((sum, event) => { const parsed = Number.parseFloat(event.duration); return sum + (Number.isFinite(parsed) ? parsed * (event.duration.toLowerCase().includes('h') ? 60 : 1) : 0); }, 0);
  const onlineCount = allEvents.filter((event) => event.type.toLowerCase().includes('online')).length;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      pink: 'bg-pink-100 border-pink-300 text-pink-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Timetable & Study Plan
            </h1>
            <p className="text-gray-600 mt-2">A starter schedule based on your selected class, subjects, and daily study goal.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar and Timetable */}
            <div className="lg:col-span-2 space-y-6">
              {/* Day Selector */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day}
                        variant={selectedDay === day ? 'default' : 'outline'}
                        onClick={() => setSelectedDay(day)}
                        className={
                          selectedDay === day
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap'
                            : 'whitespace-nowrap'
                        }
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Schedule */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {selectedDay}'s Schedule
                  </CardTitle>
                  <CardDescription>Suggested class-aware study sessions, saved on this device. Edit times around your real school schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timetableData[selectedDay as keyof typeof timetableData].map((event, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${getColorClasses(event.color)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">{event.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.duration}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                            <p className="text-sm opacity-75">{event.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditEvent(selectedDay, index)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEvent(selectedDay, index, event.title)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={handleAddNewEvent}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Event
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Reminders */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Upcoming Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="rounded-lg bg-white/15 p-4 text-sm leading-6">Your timetable is saved on this device. This prototype does not send background notifications; use your device calendar for reliable alerts.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Reminder Settings */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Reminder Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-toggle">Reminder preference (local only)</Label>
                    <Switch
                      id="reminder-toggle"
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>
                  {reminderEnabled && (
                    <div className="space-y-2">
                      <Label>Preferred lead time (not delivered as a notification):</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[5, 10, 15, 30].map((mins) => (
                          <Button
                            key={mins}
                            variant={reminderTime === mins ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setReminderTime(mins)}
                            className={
                              reminderTime === mins
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                : ''
                            }
                          >
                            {mins} min
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Saved Schedule Totals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Classes</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{classCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Study Hours</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{Math.round(studyMinutes / 60 * 10) / 10}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Online Sessions</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{onlineCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>

        {/* Add Event Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event to {selectedDay}</DialogTitle>
              <DialogDescription>Fill in the details for your new event</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  placeholder="e.g., Mathematics Class"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time *</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => {
                    const time = e.target.value;
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                    setNewEvent({ ...newEvent, time: formattedTime });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type *</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class">Class</SelectItem>
                    <SelectItem value="Study Session">Study Session</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Online Session">Online Session</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-duration">Duration *</Label>
                <Input
                  id="event-duration"
                  placeholder="e.g., 1h, 1.5h, 30m"
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-color">Color Theme</Label>
                <Select value={newEvent.color} onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveNewEvent} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update the event details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Mathematics Class"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time *</Label>
                <Input
                  id="edit-time"
                  placeholder="e.g., 09:00 AM"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Event Type *</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class">Class</SelectItem>
                    <SelectItem value="Study Session">Study Session</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Online Session">Online Session</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration *</Label>
                <Input
                  id="edit-duration"
                  placeholder="e.g., 1h, 1.5h, 30m"
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color Theme</Label>
                <Select value={newEvent.color} onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}