import { useEffect, useCallback } from "react";

export function useTaskEvent(eventName: string, handler: () => void) {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, handler]);
}

export function useTaskEvents(handlers: Record<string, () => void>) {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      window.addEventListener(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [handlers]);
}

export function dispatchTaskEvent(eventName: string) {
  window.dispatchEvent(new CustomEvent(eventName));
}
