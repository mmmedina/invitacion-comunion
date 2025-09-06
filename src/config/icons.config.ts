export type IconKey = 'ceremonia' | 'celebracion' | 'dress';

type IconSet = Record<IconKey, string>; // rutas públicas a .json (carpeta /public)

export const ICON_SETS: Record<string, IconSet> = {
  casamiento: {
    ceremonia: '/lotties/church.json',
    celebracion: '/lotties/confetti2.json',
    dress: '/lotties/dress.json',
  },
  casamiento2: {
    ceremonia: '/lotties/ringbox.json',
    celebracion: '/lotties/celebration3.json',
    dress: '/lotties/dress.json',
  },
  casamiento3: {
    ceremonia: '/lotties/weddingrings.json',
    celebracion: '/lotties/fireworks.json',
    dress: '/lotties/dresscode.json',
  },
  cumple: {
    ceremonia: '/lotties/birthdaycake.json',
    celebracion: '/lotties/celebration.json',
    dress: '/lotties/dresscode.json',
  },
};
