// components/ScheduleCalendar.tsx
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Card, CardContent } from "@/components/ui/card";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useState } from 'react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const localizer = momentLocalizer(moment);

const ScheduleCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Meeting with John',
      start: new Date(2025, 5, 5, 10, 0),
      end: new Date(2025, 5, 5, 11, 0),
    },
    {
      title: 'Team Standup',
      start: new Date(2025, 5, 6, 9, 0),
      end: new Date(2025, 5, 6, 9, 30),
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
  });

  const handleAddEvent = () => {
    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);

    if (!newEvent.title || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Please enter a valid title, start, and end time.');
      return;
    }

    setEvents([...events, {
      title: newEvent.title,
      start: startDate,
      end: endDate,
    }]);

    setNewEvent({ title: '', start: '', end: '' });
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      {/* Right side: Calendar */}
      <div className="w-2/3 bg-white rounded-xl shadow overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
          selectable
        />
      </div>

      {/* Left side: Schedule List + Add Form */}
      <div className="w-1/3 space-y-4">
        {/* Selected Date */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg mb-2">Selected Date</h2>
            <p>{selectedDate ? format(selectedDate, 'PPPP') : 'Click a date on the calendar.'}</p>
          </CardContent>
        </Card>

        {/* Add Schedule Form */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-lg mb-2">Add New Schedule</h2>
            <Input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            />
            <Button className="w-full mt-2" onClick={handleAddEvent}>Add Schedule</Button>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg mb-2">Schedule List</h2>
            {events.map((event, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(event.start, 'PPP p')} – {format(event.end, 'p')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
