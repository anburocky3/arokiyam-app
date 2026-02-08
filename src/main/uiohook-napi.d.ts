declare module 'uiohook-napi' {
  type HookEvent = 'mousemove' | 'mousewheel' | 'mousedown' | 'mouseup' | 'keydown' | 'keyup'

  type MouseEvent = {
    x: number
    y: number
  }

  type KeyboardEvent = {
    keycode: number
  }

  type Listener = (event: MouseEvent | KeyboardEvent) => void

  type Uiohook = {
    on: (event: HookEvent, listener: Listener) => void
    start: () => void
    stop: () => void
  }

  export const uIOhook: Uiohook
}
