import { useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  startOfToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isWorkDay } from '../utils/date';

interface BookingCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  /** Optional: number of booked slots per date key (yyyy-MM-dd) to show busy indicator */
  busyDates?: Record<string, number>;
  /** Max slots per day — if busyDates[key] >= maxSlots, show as fully booked */
  maxSlotsPerDay?: number;
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function BookingCalendar({
  selectedDate,
  onDateSelect,
  busyDates = {},
  maxSlotsPerDay = 20,
}: BookingCalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next

  // Max navigable: 3 months ahead
  const maxMonth = addMonths(startOfMonth(today), 3);

  const canGoPrev = !isBefore(subMonths(currentMonth, 1), startOfMonth(today));
  const canGoNext = !isAfter(currentMonth, subMonths(maxMonth, 1));

  const goToPrevMonth = useCallback(() => {
    if (!canGoPrev) return;
    setDirection(-1);
    setCurrentMonth((m) => subMonths(m, 1));
  }, [canGoPrev]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    setDirection(1);
    setCurrentMonth((m) => addMonths(m, 1));
  }, [canGoNext]);

  // Build the calendar grid (6 rows × 7 cols)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = gridStart;
    while (day <= gridEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getDayStatus = useCallback(
    (day: Date) => {
      const isPast = isBefore(day, today);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isSelected = isSameDay(day, selectedDate);
      const isToday = isSameDay(day, today);
      const isAvailable = isWorkDay(day) && !isPast && isCurrentMonth;

      const dateKey = format(day, 'yyyy-MM-dd');
      const bookedCount = busyDates[dateKey] || 0;
      const isFullyBooked = isAvailable && bookedCount >= maxSlotsPerDay;
      const hasSomeBookings = isAvailable && bookedCount > 0 && !isFullyBooked;

      return {
        isPast,
        isCurrentMonth,
        isSelected,
        isToday,
        isAvailable,
        isFullyBooked,
        hasSomeBookings,
      };
    },
    [currentMonth, selectedDate, today, busyDates, maxSlotsPerDay]
  );

  const monthYearLabel = format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR });

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
  };

  return (
    <div className="booking-calendar w-full">
      {/* Header: Month/Year Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-primary hover:border-primary/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-300 disabled:hover:border-slate-600"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold capitalize text-white tracking-wide select-none">
          {monthYearLabel}
        </h3>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-primary hover:border-primary/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-300 disabled:hover:border-slate-600"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-xs font-semibold py-2 uppercase tracking-wider ${
              i === 0 || i === 6 ? 'text-primary/70' : 'text-slate-500'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid with Animated Transitions */}
      <div className="relative overflow-hidden min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="grid grid-cols-7 gap-1"
          >
            {calendarDays.map((day, idx) => {
              const status = getDayStatus(day);
              const dayNumber = format(day, 'd');

              return (
                <button
                  key={idx}
                  disabled={!status.isAvailable || status.isFullyBooked}
                  onClick={() => {
                    if (status.isAvailable && !status.isFullyBooked) {
                      onDateSelect(day);
                    }
                  }}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium
                    transition-all duration-200 select-none
                    ${!status.isCurrentMonth ? 'text-slate-700 cursor-default' : ''}
                    ${
                      status.isCurrentMonth && !status.isAvailable && !status.isPast
                        ? 'text-slate-600 cursor-not-allowed bg-slate-800/30'
                        : ''
                    }
                    ${
                      status.isPast && status.isCurrentMonth
                        ? 'text-slate-600 cursor-not-allowed'
                        : ''
                    }
                    ${
                      status.isFullyBooked
                        ? 'text-red-400/60 cursor-not-allowed bg-red-500/5 line-through'
                        : ''
                    }
                    ${
                      status.isAvailable && !status.isFullyBooked && !status.isSelected
                        ? 'text-white cursor-pointer hover:bg-primary/15 hover:text-primary hover:scale-105 active:scale-95 bg-slate-800/40 border border-slate-700/50 hover:border-primary/40'
                        : ''
                    }
                    ${
                      status.isSelected
                        ? 'bg-primary text-slate-900 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105 border-2 border-primary'
                        : ''
                    }
                  `}
                >
                  {/* Today indicator dot */}
                  {status.isToday && !status.isSelected && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}

                  <span className={status.isSelected ? 'text-base' : ''}>{dayNumber}</span>

                  {/* Busy indicator */}
                  {status.hasSomeBookings && !status.isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400/70" />
                    </span>
                  )}

                  {/* Fully booked indicator */}
                  {status.isFullyBooked && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary/30 border border-primary/50" />
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-800/50 border border-slate-700" />
          <span>Indisponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary border-2 border-primary shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Com agendamentos</span>
        </div>
      </div>
    </div>
  );
}
