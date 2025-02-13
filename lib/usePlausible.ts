import { useCallback } from 'react'

// https://docs.plausible.io/custom-event-goals#using-custom-props
type Props = Record<string, unknown> | never
type EventOptions<P extends Props> = {
  props: P
  // https://plausible.io/docs/ecommerce-revenue-tracking
  revenue?: {
    currency: string
    amount: number
  }
  // https://plausible.io/docs/custom-locations,
  u?: string
  callback?: VoidFunction
}
type Events = { [K: string]: Props }
type IsAny<T> = 0 extends 1 & T ? true : false

export default function usePlausible<E extends Events = any>() {
  return useCallback(function <N extends keyof E>(
    eventName: N,
    ...rest: IsAny<E> extends true
      ? [
          (Omit<EventOptions<any>, 'props'> & {
            props?: Record<string, unknown>
          })?
        ]
      : [E[N]] extends [never]
      ? [Omit<EventOptions<never>, 'props'>?]
      : [EventOptions<E[N]>]
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  }, [])
}
