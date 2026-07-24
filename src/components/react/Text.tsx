import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Definimos los tipos de fuentes y variantes disponibles
type FontType = 'data' | 'gummi' | 'menu' | 'scala' | 'title';
type VariantType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: VariantType;
  font?: FontType;
  children: React.ReactNode;
}

// Mapeo de fuentes a clases de Tailwind
const fontMap: Record<FontType, string> = {
  data: 'font-kh-data',
  gummi: 'font-kh-gummi',
  menu: 'font-kh-menu',
  scala: 'font-kh-scala',
  title: 'font-kh-title',
};

// Estilos base por variante (sin márgenes para la p)
const variantMap: Record<VariantType, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
  p: 'text-base m-0 p-0 coding-default', // m-0 asegura que no herede márgenes del navegador ni defaults molestos
  span: 'inline-block',
  div: 'block',
};

export const Text: React.FC<TextProps> = ({
  variant = 'p',
  font,
  className,
  children,
  ...props
}) => {
  // Elegimos dinámicamente la etiqueta HTML
  const Component = variant;

  // Combinamos las clases base de la variante, la fuente (si viene) y las clases externas
  const mergedClasses = twMerge(
    clsx(
      variantMap[variant],
      font && fontMap[font],
      className
    )
  );

  return (
    <Component className={mergedClasses} {...props}>
      {children}
    </Component>
  );
};
