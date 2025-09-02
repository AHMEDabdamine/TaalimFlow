import React from 'react';
import { useTranslation } from 'react-i18next';

const AlgeriaMap = () => {
  const { t } = useTranslation();

  // School locations across Algeria (approximate coordinates converted to SVG positions)
  const schoolLocations = [
    // Algiers region
    { x: 180, y: 220, city: 'Algiers' },
    { x: 185, y: 225, city: 'Algiers' },
    { x: 175, y: 215, city: 'Algiers' },
    
    // Oran region
    { x: 120, y: 240, city: 'Oran' },
    { x: 125, y: 235, city: 'Oran' },
    { x: 115, y: 245, city: 'Oran' },
    
    // Constantine region
    { x: 280, y: 200, city: 'Constantine' },
    { x: 285, y: 205, city: 'Constantine' },
    { x: 275, y: 195, city: 'Constantine' },
    
    // Annaba region
    { x: 320, y: 180, city: 'Annaba' },
    { x: 325, y: 185, city: 'Annaba' },
    
    // Setif region
    { x: 240, y: 210, city: 'Setif' },
    { x: 245, y: 215, city: 'Setif' },
    
    // Batna region
    { x: 260, y: 230, city: 'Batna' },
    { x: 265, y: 235, city: 'Batna' },
    
    // Blida region
    { x: 170, y: 230, city: 'Blida' },
    { x: 175, y: 235, city: 'Blida' },
    
    // Tlemcen region
    { x: 100, y: 250, city: 'Tlemcen' },
    { x: 105, y: 255, city: 'Tlemcen' },
    
    // Sidi Bel Abbes region
    { x: 130, y: 260, city: 'Sidi Bel Abbes' },
    { x: 135, y: 265, city: 'Sidi Bel Abbes' },
    
    // Biskra region
    { x: 240, y: 280, city: 'Biskra' },
    { x: 245, y: 285, city: 'Biskra' },
    
    // Ouargla region
    { x: 220, y: 350, city: 'Ouargla' },
    { x: 225, y: 355, city: 'Ouargla' },
    
    // Ghardaia region
    { x: 180, y: 320, city: 'Ghardaia' },
    { x: 185, y: 325, city: 'Ghardaia' },
    
    // Bechar region
    { x: 120, y: 320, city: 'Bechar' },
    { x: 125, y: 325, city: 'Bechar' },
    
    // Adrar region
    { x: 140, y: 380, city: 'Adrar' },
    { x: 145, y: 385, city: 'Adrar' },
    
    // Tamanrasset region
    { x: 200, y: 450, city: 'Tamanrasset' },
    { x: 205, y: 455, city: 'Tamanrasset' },
    
    // Illizi region
    { x: 280, y: 420, city: 'Illizi' },
    { x: 285, y: 425, city: 'Illizi' },
    
    // Additional schools spread across regions
    { x: 160, y: 250, city: 'Tipaza' },
    { x: 200, y: 240, city: 'Bouira' },
    { x: 220, y: 250, city: 'M\'Sila' },
    { x: 300, y: 220, city: 'Guelma' },
    { x: 290, y: 240, city: 'Khenchela' },
    { x: 270, y: 260, city: 'Tebessa' },
    { x: 150, y: 270, city: 'Mascara' },
    { x: 140, y: 280, city: 'Saida' },
    { x: 160, y: 290, city: 'Tiaret' },
    { x: 190, y: 270, city: 'Medea' },
    { x: 210, y: 260, city: 'Djelfa' },
    { x: 250, y: 300, city: 'El Oued' },
    { x: 170, y: 340, city: 'Laghouat' },
    { x: 160, y: 360, city: 'El Bayadh' },
    { x: 100, y: 340, city: 'Naama' },
    { x: 180, y: 400, city: 'Ouled Djellal' },
    { x: 240, y: 380, city: 'Touggourt' },
    { x: 260, y: 400, city: 'Hassi Messaoud' },
    { x: 220, y: 420, city: 'In Salah' },
    { x: 160, y: 420, city: 'Timimoun' },
    { x: 120, y: 400, city: 'Reggane' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Algeria map outline */}
        <path
          d="M 80 200 
             L 120 180 
             L 160 170 
             L 200 165 
             L 240 170 
             L 280 175 
             L 320 180 
             L 340 200 
             L 350 220 
             L 340 240 
             L 330 260 
             L 320 280 
             L 310 300 
             L 300 320 
             L 290 340 
             L 280 360 
             L 270 380 
             L 260 400 
             L 250 420 
             L 240 440 
             L 220 460 
             L 200 470 
             L 180 465 
             L 160 450 
             L 140 430 
             L 120 410 
             L 100 390 
             L 90 370 
             L 85 350 
             L 80 330 
             L 75 310 
             L 70 290 
             L 65 270 
             L 70 250 
             L 75 230 
             L 80 210 
             Z"
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="2"
          className="transition-all duration-300 hover:fill-blue-100 dark:hover:fill-blue-900"
        />
        
        {/* School location dots */}
        {schoolLocations.map((location, index) => (
          <g key={index}>
            {/* Animated pulse ring */}
            <circle
              cx={location.x}
              cy={location.y}
              r="8"
              fill="rgba(34, 197, 94, 0.2)"
              className="animate-ping"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s'
              }}
            />
            {/* Main dot */}
            <circle
              cx={location.x}
              cy={location.y}
              r="4"
              fill="#22c55e"
              className="transition-all duration-300 hover:r-6 hover:fill-green-400"
            />
            {/* Inner dot */}
            <circle
              cx={location.x}
              cy={location.y}
              r="2"
              fill="#ffffff"
            />
          </g>
        ))}
        
        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect
            x="0"
            y="0"
            width="120"
            height="40"
            rx="8"
            fill="rgba(255, 255, 255, 0.9)"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
            className="dark:fill-gray-800/90"
          />
          <circle cx="15" cy="20" r="4" fill="#22c55e" />
          <circle cx="15" cy="20" r="2" fill="#ffffff" />
          <text
            x="25"
            y="25"
            fontSize="12"
            fill="#374151"
            className="dark:fill-gray-200"
            fontFamily="system-ui, sans-serif"
          >
            {t('hero.schoolLocation')}
          </text>
        </g>
      </svg>
      
      {/* Statistics overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {schoolLocations.length}+
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            {t('hero.schoolsConnected')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgeriaMap;