// src/types/index.ts

import type { FC, ReactNode } from 'react';
import type { Theme } from '../context/ThemeContext';

/**
 * Define la estructura de la configuración estática de un widget.
 * Cada widget debe exportar un objeto con esta forma.
 */
export interface WidgetConfig {
  id: string;
  title: string;
  icon: string | ReactNode;
  defaultSize: { width: number; height: number };
  component: FC; // El componente de React como una función
}

/**
 * Define la estructura de un widget que está actualmente activo en el escritorio.
 */
export interface ActiveWidget {
  instanceId: string;
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
  
  // --- LÍNEAS AÑADIDAS ---
  isMinimized?: boolean;
  isMaximized?: boolean;
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number | string; height: number | string };
  // --- FIN DE LÍNEAS AÑADIDAS ---
}

/**
 * Define la estructura para un único perfil de escritorio guardado.
 * Contiene todos los ajustes que queremos persistir.
 */
export interface DesktopProfile {
  theme: Theme;
  activeWidgets: ActiveWidget[];
  pinnedWidgets: string[];
}

/**
 * Define la colección de todos los perfiles guardados,
 * usando el nombre del perfil como clave.
 */
export type ProfileCollection = Record<string, DesktopProfile>;
