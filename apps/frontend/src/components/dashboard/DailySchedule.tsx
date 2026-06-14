"use client";

export function DailySchedule() {
  const schedule = [
    { time: "10:00", period: "AM", title: "Project Kickoff", location: "Boardroom A", color: "border-[#2170e4]" },
    { time: "1:30", period: "PM", title: "Deep Work Session", location: "Design Office", color: "border-purple-400" },
    { time: "4:00", period: "PM", title: "Stakeholder Review", location: "Virtual Meeting", color: "border-red-400" },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10 p-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Schedule</h4>
      <div className="space-y-3">
        {schedule.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
            <div className="text-right min-w-[50px]">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{item.time}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.period}</p>
            </div>
            <div className={`border-l-4 ${item.color} pl-3`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
