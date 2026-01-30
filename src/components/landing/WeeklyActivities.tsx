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
    <section className="py-6 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-3 md:mb-12">
          <span className="inline-block px-3 py-1 bg-purple-100 text-[#730051] text-sm font-medium rounded-full mb-4">
            Weekly Schedule
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Weekly Activities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us throughout the week for various fellowship activities and grow together in faith.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`relative p-3 md:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                activity.highlight
                  ? 'bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              {activity.highlight && (
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-[#730051] text-white text-[10px] md:text-xs font-medium rounded-full">
                  Special
                </span>
              )}

              <span className="text-xs md:text-sm font-semibold text-[#730051]">{activity.day}</span>

              <h3 className="text-sm md:text-lg font-semibold text-gray-800 mt-1 mb-1.5 md:mb-3">
                {activity.event}
              </h3>

              <div className="space-y-1 text-[11px] md:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={11} className="flex-shrink-0 md:hidden" />
                  <Clock size={14} className="flex-shrink-0 hidden md:block" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="flex-shrink-0 md:hidden" />
                  <MapPin size={14} className="flex-shrink-0 hidden md:block" />
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
