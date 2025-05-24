"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import React from 'react'

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  )
}

export default ThemeProvider