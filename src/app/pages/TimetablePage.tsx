import { useState } from 'react';
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
import { ArrowLeft, Calendar, Clock, Bell, BookOpen, Video, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialTimetableData = {
  Monday: [
    { time: '09:00 AM', title: 'Mathematics', type: 'Class', duration: '1h', color: 'blue' },
    { time: '11:00 AM', title: 'Physics', type: 'Class', duration: '1h', color: 'purple' },
    { time: '02:00 PM', title: 'Python Study', type: 'Study Session', duration: '2h', color: 'green' },
  ],
  Tuesday: [
    { time: '10:00 AM', title: 'Chemistry', type: 'Class', duration: '1h', color: 'orange' },
    { time: '01:00 PM', title: 'English', type: 'Class', duration: '1h', color: 'pink' },
    { time: '03:00 PM', title: 'Calculus Review', type: 'Study Session', duration: '1.5h', color: 'green' },
  ],
  Wednesday: [
    { time: '09:00 AM', title: 'Biology', type: 'Class', duration: '1h', color: 'blue' },
    { time: '11:30 AM', title: 'Computer Science', type: 'Class', duration: '1.5h', color: 'purple' },
    { time: '03:00 PM', title: 'Active Recall Practice', type: 'Study Session', duration: '1h', color: 'green' },
  ],
  Thursday: [
    { time: '10:00 AM', title: 'Mathematics', type: 'Class', duration: '1h', color: 'blue' },
    { time: '02:00 PM', title: 'Physics Lab', type: 'Lab', duration: '2h', color: 'purple' },
    { time: '05:00 PM', title: 'Web Development', type: 'Study Session', duration: '1h', color: 'green' },
  ],
  Friday: [
    { time: '09:00 AM', title: 'English Literature', type: 'Class', duration: '1h', color: 'pink' },
    { time: '11:00 AM', title: 'Chemistry', type: 'Class', duration: '1h', color: 'orange' },
    { time: '03:00 PM', title: 'Weekly Review', type: 'Study Session', duration: '2h', color: 'green' },
  ],
  Saturday: [
    { time: '10:00 AM', title: 'AI Tutor Session', type: 'Online Session', duration: '1h', color: 'purple' },
    { time: '02:00 PM', title: 'Project Work', type: 'Study Session', duration: '3h', color: 'green' },
  ],
  Sunday: [
    { time: '11:00 AM', title: 'Spaced Repetition', type: 'Study Session', duration: '1h', color: 'green' },
    { time: '04:00 PM', title: 'Plan Next Week', type: 'Planning', duration: '30m', color: 'blue' },
  ],
};

const upcomingReminders = [
  { time: '15 minutes', title: 'Mathematics Class', status: 'upcoming' },
  { time: '1 hour', title: 'Python Study Session', status: 'upcoming' },
  { time: '3 hours', title: 'Physics Lab', status: 'later' },
];

export default function TimetablePage() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(15);
  const [timetableData, setTimetableData] = useState(initialTimetableData);
  const [showNotification, setShowNotification] = useState(true);
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

  const handleDismissNotification = () => {
    setShowNotification(false);
    toast.success('Notification dismissed');
  };

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
              Timetable & Reminders
            </h1>
            <p className="text-gray-600 mt-2">Manage your schedule and stay organized</p>
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
                  <CardDescription>Your classes and study sessions</CardDescription>
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
                    {upcomingReminders.map((reminder, index) => (
                      <div key={index} className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-100">In {reminder.time}</p>
                            <p className="font-semibold">{reminder.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <Label htmlFor="reminder-toggle">Enable Reminders</Label>
                    <Switch
                      id="reminder-toggle"
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>
                  {reminderEnabled && (
                    <div className="space-y-2">
                      <Label>Remind me before:</Label>
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
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Classes</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Study Hours</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">18</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Online Sessions</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notification Card Example */}
          {showNotification && (
            <Card className="shadow-lg border-0 mt-6 bg-yellow-50 border-yellow-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800">Reminder: Class starts in 15 minutes</p>
                    <p className="text-sm text-yellow-700">Mathematics - 09:00 AM</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismissNotification}
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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