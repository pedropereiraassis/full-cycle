import { useScroll } from '../../src/app/hooks/useScroll';
import { renderHook, act } from '@testing-library/react';

describe('useScroll', () => {
  it('should response to scroll events', () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current).toBe(false);

    act(() => {
      global.window.scrollY = 10;
      global.window.dispatchEvent(new Event('scroll'));
    })
    expect(result.current).toBe(true);

    act(() => {
      global.window.scrollY = 0;
      global.window.dispatchEvent(new Event('scroll'));
    })
    expect(result.current).toBe(false);
  })
})