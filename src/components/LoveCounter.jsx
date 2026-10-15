import React, { useState, useEffect } from 'react';
import TiltCard from './TiltCard';
import { Heart, Sparkles, Clock, Calendar } from 'lucide-react';

// Fecha exacta de novios: 18 de Junio de 2024
const ANNIVERSARY_DATE = new Date('2024-06-18T00:00:00');

export default function LoveCounter() {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffMs = now - ANNIVERSARY_DATE;

      if (diffMs <= 0) return;

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Cálculo de Años, Meses y Días precisos
      let years = now.getFullYear() - ANNIVERSARY_DATE.getFullYear();
      let months = now.getMonth() - ANNIVERSARY_DATE.getMonth();
      let days = now.getDate() - ANNIVERSARY_DATE.getDate();

      if (days < 0) {
        months -= 1;
        // Días del mes anterior
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTimeTogether({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TiltCard maxTilt={8} className="love-counter-card">
      <div className="love-counter-header">
        <div className="counter-icon-badge">
          <Calendar size={20} color="var(--color-heart)" />
        </div>
        <div>
          <span className="counter-eyebrow">NUESTRA HISTORIA</span>
          <h3 className="counter-main-title">Tiempo amándonos</h3>
        </div>
        <div className="counter-icon-badge">
          <Clock size={20} color="var(--color-lila-primary)" />
        </div>
      </div>

      <p className="counter-since-text">
        Juntos desde el <strong>18 de Junio de 2024</strong> 💜
      </p>

      {/* Cuadrícula de contadores 3D */}
      <div className="counter-grid">
        <div className="counter-box">
          <span className="counter-number">{timeTogether.years}</span>
          <span className="counter-label">{timeTogether.years === 1 ? 'Año' : 'Años'}</span>
        </div>
        <div className="counter-box">
          <span className="counter-number">{timeTogether.months}</span>
          <span className="counter-label">{timeTogether.months === 1 ? 'Mes' : 'Meses'}</span>
        </div>
        <div className="counter-box">
          <span className="counter-number">{timeTogether.days}</span>
          <span className="counter-label">{timeTogether.days === 1 ? 'Día' : 'Días'}</span>
        </div>
        <div className="counter-box highlight">
          <span className="counter-number">{String(timeTogether.hours).padStart(2, '0')}</span>
          <span className="counter-label">Horas</span>
        </div>
        <div className="counter-box highlight">
          <span className="counter-number">{String(timeTogether.minutes).padStart(2, '0')}</span>
          <span className="counter-label">Min</span>
        </div>
        <div className="counter-box highlight pulse">
          <span className="counter-number">{String(timeTogether.seconds).padStart(2, '0')}</span>
          <span className="counter-label">Seg</span>
        </div>
      </div>

      {/* Footer del contador */}
      <div className="counter-total-pill">
        <Heart size={16} fill="var(--color-heart)" color="var(--color-heart)" />
        <span>Más de <strong>{timeTogether.totalDays.toLocaleString('es-AR')}</strong> días eligiéndote cada mañana</span>
        <Sparkles size={16} color="var(--color-lila-primary)" />
      </div>
    </TiltCard>
  );
}
