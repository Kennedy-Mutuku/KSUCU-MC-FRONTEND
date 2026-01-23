import { Calendar, Clock, MapPin } from 'lucide-react';

interface Activity {
  day: string;
  event: string;
  time: string;
  venue: string;
  highlight?: boolean;
}

const activities: Activity[] = [
  { day: 'Monday', event: 'Discipleship', time: '6:50 PM - 8:50 PM', venue: 'Communicated daily' },
  { day: 'Tuesday', event: 'Ministry Meetings', time: '6:50 PM - 8:50 PM', venue: 'Communicated daily' },
  { day: 'Wednesday', event: 'Best P', time: '6:50 PM - 8:50 PM', venue: 'Communicated daily' },
  { day: 'Thursday', event: 'ET Fellowship', time: '6:50 PM - 8:50 PM', venue: 'Communicated daily' },
  { day: 'Friday', event: 'Friday Fellowship', time: '6:50 PM - 8:50 PM', venue: 'Communicated daily' },
  { day: 'Saturday', event: 'Class Fellowship', time: '9:00 AM - 12:00 PM', venue: 'Communicated earlier' },
  { day: 'Sunday', event: 'Services', time: '7:30 AM - 12:45 PM', venue: 'Communicated before service', highlight: true },
];

const WeeklyActivities = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full mb-4">
            Weekly Schedule
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Our Weekly Activities
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Join us throughout the week for various fellowship activities and grow together in faith.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`relative p-5 rounded-xl border transition-all duration-300 hover:shadow-card hover:-translate-y-1 ${
                activity.highlight
                  ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200'
                  : 'bg-white border-border'
              }`}
            >
              {activity.highlight && (
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                  Special
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-semibold text-primary">{activity.day}</span>
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {activity.event}
              </h3>

              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="flex-shrink-0" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{activity.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyActivities;
