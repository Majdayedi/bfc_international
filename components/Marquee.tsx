
import React from 'react';
import { Shield, Zap, Layers, Command, Sun, Globe, Activity } from 'lucide-react';
import './Marquee.css';

const CLIENTS = [
  { name: 'Aether', icon: Shield },
  { name: 'Veloce', icon: Zap },
  { name: 'Nexus', icon: Layers },
  { name: 'Banko', icon: Command },
  { name: 'Lumos', icon: Sun },
  { name: 'Orbis', icon: Globe },
  { name: 'Kinetic', icon: Activity },
];

export const Marquee: React.FC = () => {
  return (
    <section className="marquee">
      <div className="marquee__header">
        <span className="marquee__eyebrow">Global Partnerships</span>
      </div>
      
      <div className="marquee__track">
        <div className="marquee__row">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="marquee__group">
              {CLIENTS.map((client, j) => (
                <div key={j} className="marquee__item">
                  <client.icon size={48} className="marquee__icon" />
                  <span className="marquee__name">{client.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
