import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function SLAClock({ targetDate, status }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    if (!targetDate || status === 'RESOLVED' || status === 'CLOSED') {
      return;
    }

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsBreached(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate, status]);

  if (!targetDate) return <span className="text-gray-600 text-[10px] font-mono">NO SLA SET</span>;

  if (status === 'RESOLVED' || status === 'CLOSED') {
    return (
      <span className="text-success text-xs font-mono flex items-center gap-1">
        <Clock size={12} /> COMPLETED
      </span>
    );
  }

  if (isBreached) {
    return (
      <span className="text-alert text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
        <Clock size={12} /> BREACHED
      </span>
    );
  }

  return (
    <span className="text-holo-400 text-xs font-mono font-bold flex items-center gap-1">
      <Clock size={12} /> {timeLeft}
    </span>
  );
}
