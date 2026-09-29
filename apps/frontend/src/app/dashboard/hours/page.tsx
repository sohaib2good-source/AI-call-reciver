"use client";

import { useState } from "react";
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Check,
  Copy,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Bot,
  X,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Button } from "@ai-restaurant/ui";

interface ShiftData {
  id: string;
  shiftNumber: 1 | 2 | 3;
  name: string;
  subLabel: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface DaySchedule {
  day: string;
  isExpanded: boolean;
  shifts: [ShiftData, ShiftData, ShiftData];
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;       // "YYYY-MM-DD"
  endDate: string;    // "YYYY-MM-DD"
  allShiftsSuspended: boolean;
  aiMessage: string;
  createdAt: string;
}

const MAX_HOLIDAYS = 15;

const DEFAULT_DAYS: DaySchedule[] = [
  {
    day: "Monday",
    isExpanded: true,
    shifts: [
      { id: "mon-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "08:00", closeTime: "12:00" },
      { id: "mon-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "12:30", closeTime: "16:30" },
      { id: "mon-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "17:30", closeTime: "23:00" },
    ],
  },
  {
    day: "Tuesday",
    isExpanded: true,
    shifts: [
      { id: "tue-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "08:00", closeTime: "12:00" },
      { id: "tue-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "12:30", closeTime: "16:30" },
      { id: "tue-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "17:30", closeTime: "23:00" },
    ],
  },
  {
    day: "Wednesday",
    isExpanded: true,
    shifts: [
      { id: "wed-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "08:00", closeTime: "12:00" },
      { id: "wed-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "12:30", closeTime: "16:30" },
      { id: "wed-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "17:30", closeTime: "23:00" },
    ],
  },
  {
    day: "Thursday",
    isExpanded: true,
    shifts: [
      { id: "thu-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "08:00", closeTime: "12:00" },
      { id: "thu-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "12:30", closeTime: "16:30" },
      { id: "thu-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "17:30", closeTime: "23:00" },
    ],
  },
  {
    day: "Friday",
    isExpanded: true,
    shifts: [
      { id: "fri-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "08:00", closeTime: "12:00" },
      { id: "fri-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "12:30", closeTime: "16:30" },
      { id: "fri-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "17:30", closeTime: "23:30" },
    ],
  },
  {
    day: "Saturday",
    isExpanded: true,
    shifts: [
      { id: "sat-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "09:00", closeTime: "13:00" },
      { id: "sat-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "13:30", closeTime: "17:30" },
      { id: "sat-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "18:00", closeTime: "23:59" },
    ],
  },
  {
    day: "Sunday",
    isExpanded: true,
    shifts: [
      { id: "sun-s1", shiftNumber: 1, name: "1st Shift", subLabel: "Morning / Breakfast", isOpen: true, openTime: "09:00", closeTime: "13:00" },
      { id: "sun-s2", shiftNumber: 2, name: "2nd Shift", subLabel: "Afternoon / Lunch", isOpen: true, openTime: "13:30", closeTime: "17:30" },
      { id: "sun-s3", shiftNumber: 3, name: "3rd Shift", subLabel: "Evening / Dinner", isOpen: true, openTime: "18:00", closeTime: "23:00" },
    ],
  },
];

const INITIAL_HOLIDAYS: HolidayItem[] = [
  {
    id: "hol-1",
    name: "Eid-ul-Fitr Holiday",
    date: "2026-09-15",
    endDate: "2026-09-16",
    allShiftsSuspended: true,
    aiMessage: "Our restaurant is closed for Eid-ul-Fitr celebrations. We look forward to welcoming you back on September 17th!",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hol-2",
    name: "New Year's Day",
    date: "2027-01-01",
    endDate: "2027-01-01",
    allShiftsSuspended: true,
    aiMessage: "Happy New Year! We are closed today for the holiday and will reopen tomorrow for normal shifts.",
    createdAt: new Date().toISOString(),
  },
];

const HOLIDAY_PRESETS = [
  "Eid-ul-Fitr",
  "Eid-ul-Adha",
  "New Year's Day",
  "Christmas Day",
  "Independence Day",
  "Annual Staff Party",
  "Kitchen Renovation",
];

const SHIFT_THEMES = {
  1: {
    icon: Sun,
    iconColor: "text-amber-500",
  },
  2: {
    icon: Sunset,
    iconColor: "text-blue-500",
  },
  3: {
    icon: Moon,
    iconColor: "text-purple-500",
  },
};

export default function BusinessHoursPage() {
  const [schedules, setSchedules] = useState<DaySchedule[]>(DEFAULT_DAYS);
  const [holidays, setHolidays] = useState<HolidayItem[]>(INITIAL_HOLIDAYS);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  // Modal State for Adding Holiday
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formAiMessage, setFormAiMessage] = useState("");
  const [formAllShifts, setFormAllShifts] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Toggle shift open/closed status
  const handleToggleShift = (dayIdx: number, shiftIdx: number) => {
    setSchedules((prev) => {
      const next = [...prev];
      const targetDay = { ...next[dayIdx] };
      const targetShifts = [...targetDay.shifts] as [ShiftData, ShiftData, ShiftData];
      targetShifts[shiftIdx] = {
        ...targetShifts[shiftIdx],
        isOpen: !targetShifts[shiftIdx].isOpen,
      };
      targetDay.shifts = targetShifts;
      next[dayIdx] = targetDay;
      return next;
    });
  };

  // Update shift times
  const handleTimeChange = (
    dayIdx: number,
    shiftIdx: number,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setSchedules((prev) => {
      const next = [...prev];
      const targetDay = { ...next[dayIdx] };
      const targetShifts = [...targetDay.shifts] as [ShiftData, ShiftData, ShiftData];
      targetShifts[shiftIdx] = {
        ...targetShifts[shiftIdx],
        [field]: value,
      };
      targetDay.shifts = targetShifts;
      next[dayIdx] = targetDay;
      return next;
    });
  };

  // Copy Monday's 3 shifts to all other days
  const handleCopyMondayToAll = () => {
    const mondayShifts = schedules[0].shifts;
    setSchedules((prev) =>
      prev.map((dayItem, idx) => {
        if (idx === 0) return dayItem;
        return {
          ...dayItem,
          shifts: [
            { ...mondayShifts[0], id: `${dayItem.day}-s1` },
            { ...mondayShifts[1], id: `${dayItem.day}-s2` },
            { ...mondayShifts[2], id: `${dayItem.day}-s3` },
          ],
        };
      })
    );
    setCopyNotification("Monday's 3-shift timings copied to all days!");
    setTimeout(() => setCopyNotification(null), 3000);
  };

  // Open modal and reset fields
  const handleOpenModal = () => {
    if (holidays.length >= MAX_HOLIDAYS) return;
    setFormName("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormEndDate("");
    setFormAiMessage("");
    setFormAllShifts(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Preset selection
  const handleSelectPreset = (name: string) => {
    setFormName(name);
    if (!formAiMessage) {
      setFormAiMessage(`Our restaurant is closed for ${name}. We look forward to welcoming you back when we reopen!`);
    }
  };

  // Submit new holiday
  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please provide a name or reason for the closure.");
      return;
    }
    if (!formDate) {
      setFormError("Please select a valid date from the calendar.");
      return;
    }
    if (formEndDate && formEndDate < formDate) {
      setFormError("End date cannot be earlier than start date.");
      return;
    }
    if (holidays.length >= MAX_HOLIDAYS) {
      setFormError(`Maximum limit of ${MAX_HOLIDAYS} holidays reached.`);
      return;
    }

    const newHoliday: HolidayItem = {
      id: `hol-${Date.now()}`,
      name: formName.trim(),
      date: formDate,
      endDate: formEndDate || formDate,
      allShiftsSuspended: formAllShifts,
      aiMessage:
        formAiMessage.trim() ||
        `Our restaurant is closed on this day for ${formName.trim()}. We look forward to serving you when we reopen!`,
      createdAt: new Date().toISOString(),
    };

    setHolidays((prev) => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
    setIsModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Delete holiday
  const handleDeleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }, 800);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Business Operating Hours & Holiday Closures
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage daily operating shifts (1st, 2nd, 3rd shift) and schedule up to 15 holiday closures for the AI receptionist.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCopyMondayToAll}
            className="flex items-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-none font-medium py-2 px-3"
          >
            <Copy size={14} />
            Copy Monday to All Days
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2"
          >
            {isSaving ? "Saving Hours..." : "Save Hours"}
          </Button>
        </div>
      </div>

      {/* Toast / Notification Banner */}
      {savedSuccess && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-sm shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
          <span>Operating shifts and holiday closures saved successfully! AI receptionist context updated.</span>
        </div>
      )}

      {copyNotification && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-lg text-sm shadow-sm animate-in fade-in duration-200">
          <Check size={16} className="text-blue-600 dark:text-blue-400" />
          <span>{copyNotification}</span>
        </div>
      )}

      {/* Shifts Legend Card */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Clock size={16} className="text-gray-500" />
          <span>Daily Operating Shifts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-medium">
            <Sun size={14} className="text-amber-500" />
            <span>1st Shift: Morning / Breakfast</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 font-medium">
            <Sunset size={14} className="text-blue-500" />
            <span>2nd Shift: Afternoon / Lunch</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 font-medium">
            <Moon size={14} className="text-purple-500" />
            <span>3rd Shift: Evening / Dinner</span>
          </div>
        </div>
      </div>

      {/* Days Schedule List */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="px-6 py-4 bg-gray-50/60 dark:bg-gray-900/40 rounded-t-xl flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Weekly Shifts Schedule
          </h2>
          <span className="text-xs text-gray-500">
            Check &quot;Open&quot; to activate each shift and customize start & close times.
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {schedules.map((daySchedule, dayIdx) => {
            const activeCount = daySchedule.shifts.filter((s) => s.isOpen).length;

            return (
              <div key={daySchedule.day} className="p-5 md:p-6 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-gray-900 dark:text-white w-28">
                      {daySchedule.day}
                    </span>
                    {activeCount > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {activeCount} {activeCount === 1 ? "Shift" : "Shifts"} Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                        Closed All Day
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {daySchedule.shifts.map((shift, shiftIdx) => {
                    const theme = SHIFT_THEMES[shift.shiftNumber];
                    const IconComponent = theme.icon;

                    return (
                      <div
                        key={shift.id}
                        className={`relative rounded-lg border p-3.5 transition-all ${
                          shift.isOpen
                            ? "bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-xs"
                            : "bg-gray-50/70 dark:bg-gray-900/30 border-dashed border-gray-200 dark:border-gray-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent size={16} className={shift.isOpen ? theme.iconColor : "text-gray-400"} />
                            <div>
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                {shift.name}
                              </span>
                              <span className="block text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                                {shift.subLabel}
                              </span>
                            </div>
                          </div>

                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={shift.isOpen}
                              onChange={() => handleToggleShift(dayIdx, shiftIdx)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={shift.isOpen ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-gray-400"}>
                              {shift.isOpen ? "Open" : "Closed"}
                            </span>
                          </label>
                        </div>

                        {shift.isOpen ? (
                          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/60 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                              <label className="block text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
                                Start (Open)
                              </label>
                              <input
                                type="time"
                                value={shift.openTime}
                                onChange={(e) =>
                                  handleTimeChange(dayIdx, shiftIdx, "openTime", e.target.value)
                                }
                                className="w-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:border-blue-500"
                              />
                            </div>

                            <span className="text-gray-400 text-xs font-bold pt-3">-</span>

                            <div className="flex-1">
                              <label className="block text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
                                End (Close)
                              </label>
                              <input
                                type="time"
                                value={shift.closeTime}
                                onChange={(e) =>
                                  handleTimeChange(dayIdx, shiftIdx, "closeTime", e.target.value)
                                }
                                className="w-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:border-blue-500"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="py-2.5 text-center text-xs text-gray-400 italic bg-gray-100/50 dark:bg-gray-800/40 rounded border border-gray-100 dark:border-gray-700/50">
                            Shift Disabled
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SPECIAL CLOSURES & HOLIDAYS SECTION (UP TO 15 HOLIDAYS) */}
      {/* ======================================================== */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">
              <CalendarDays size={22} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Special Closures & Holiday Schedules
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  holidays.length >= MAX_HOLIDAYS
                    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                }`}>
                  {holidays.length} / {MAX_HOLIDAYS} Holidays Configured
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Add specific dates when all 3 shifts will be automatically suspended. The AI Voice Receptionist will read these holidays and announce them to callers.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleOpenModal}
            disabled={holidays.length >= MAX_HOLIDAYS}
            className={`flex items-center gap-2 text-xs font-semibold py-2 px-4 shadow-sm transition-all ${
              holidays.length >= MAX_HOLIDAYS
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            }`}
          >
            <Plus size={16} />
            {holidays.length >= MAX_HOLIDAYS ? "15 Holidays Limit Reached" : "Add Holiday Closure"}
          </Button>
        </div>

        {/* Holidays List / Empty State */}
        <div className="mt-5 space-y-3">
          {holidays.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No holiday closures scheduled yet.
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Click &quot;Add Holiday Closure&quot; above to pick dates from the calendar (e.g., Eid, Christmas, or New Year).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {holidays.map((item) => {
                const isToday = todayStr >= item.date && todayStr <= item.endDate;
                const isPast = todayStr > item.endDate;

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-xl border p-4 transition-all ${
                      isToday
                        ? "bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-800 shadow-sm ring-1 ring-red-400/40"
                        : "bg-gray-50/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {item.date === item.endDate
                              ? new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : `${new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })} — ${new Date(item.endDate + "T00:00:00").toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isToday ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white animate-pulse">
                            Active Today
                          </span>
                        ) : isPast ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            Past
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                            Upcoming
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteHoliday(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          title="Delete Holiday"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* AI Receptionist Announcement Message */}
                    <div className="mt-2 p-2.5 bg-white dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700/80 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        <Bot size={13} />
                        <span>AI Receptionist Voice Announcement:</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                        &quot;{item.aiMessage}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* ADD HOLIDAY MODAL (CALENDAR PICKER + MAX 15 VALIDATION)   */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-lg">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Add Special Closure or Holiday
                  </h3>
                  <p className="text-xs text-gray-500">
                    Slot {holidays.length + 1} of {MAX_HOLIDAYS} available
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddHolidaySubmit} className="p-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Holiday Name & Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Holiday / Closure Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Eid-ul-Fitr, New Year's Day, Private Event"
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  required
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" /> Presets:
                  </span>
                  {HOLIDAY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Date Picker (Single Day or Date Range) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Date (Start) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Date (End) <span className="text-gray-400 font-normal">(Optional for range)</span>
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    min={formDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="Same day if empty"
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* AI Voice Announcement Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  AI Voice Announcement Message
                </label>
                <textarea
                  rows={2}
                  value={formAiMessage}
                  onChange={(e) => setFormAiMessage(e.target.value)}
                  placeholder={`e.g. Our restaurant is closed today for ${formName || "the holiday"}. We look forward to welcoming you back tomorrow!`}
                  className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500 leading-relaxed"
                />
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  The AI voice agent reads this exact sentence when customers call on this date.
                </span>
              </div>

              {/* Suspend All 3 Shifts Checkbox */}
              <label className="flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-gray-200 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formAllShifts}
                  onChange={(e) => setFormAllShifts(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span>Automatically suspend all 3 operating shifts on this date</span>
              </label>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-none shadow-none py-2 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5"
                >
                  Confirm & Schedule Holiday
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
