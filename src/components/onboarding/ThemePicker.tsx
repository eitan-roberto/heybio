'use client';

import { Check, Lock } from 'lucide-react';
import { freeThemes, proThemes, type Theme } from '@/config/themes';
import { cn } from '@/lib/utils';

interface ThemePickerProps {
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  showProThemes?: boolean;
}

function ThemeCard({ 
  theme, 
  isSelected, 
  isLocked,
  onSelect 
}: { 
  theme: Theme; 
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}) {
  const bgStyle = theme.colors.background.startsWith('linear')
    ? { background: theme.colors.background }
    : { backgroundColor: theme.colors.background };

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        "relative w-full aspect-[3/4] rounded-xl overflow-hidden transition-all",
        "border-2 hover:scale-[1.02]",
        isSelected 
          ? "border-gray-900 ring-2 ring-gray-900/20" 
          : "border-gray-200 hover:border-gray-300",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Theme preview */}
      <div 
        className="absolute inset-0 p-3 flex flex-col items-center justify-center gap-2"
        style={bgStyle}
      >
        {/* Avatar placeholder */}
        <div 
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: theme.colors.primary }}
        />
        
        {/* Name placeholder */}
        <div 
          className="w-16 h-2 rounded"
          style={{ backgroundColor: theme.colors.text, opacity: 0.8 }}
        />
        
        {/* Bio placeholder */}
        <div 
          className="w-12 h-1.5 rounded"
          style={{ backgroundColor: theme.colors.textMuted, opacity: 0.6 }}
        />
        
        {/* Link placeholders */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-4 rounded"
            style={{ 
              backgroundColor: theme.colors.linkBg,
              border: theme.colors.linkBorder ? `1px solid ${theme.colors.linkBorder}` : undefined,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Locked indicator */}
      {isLocked && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Theme name */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-white/90 backdrop-blur-sm">
        <span className="text-xs font-medium text-gray-700">{theme.name}</span>
        {isLocked && (
          <span className="ml-1 text-xs text-gray-400">Pro</span>
        )}
      </div>
    </button>
  );
}

export function ThemePicker({ selectedThemeId, onSelectTheme, showProThemes = false }: ThemePickerProps) {
  return (
    <div className="space-y-6">
      {/* Free themes */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Free themes</h3>
        <div className="grid grid-cols-3 gap-3">
          {freeThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={selectedThemeId === theme.id}
              isLocked={false}
              onSelect={() => onSelectTheme(theme.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Pro themes */}
      {showProThemes && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Pro themes
            <span className="ml-2 text-xs text-gray-400">Upgrade to unlock</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {proThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedThemeId === theme.id}
                isLocked={true}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
