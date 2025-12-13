export const useIp = () => {
  return useState<string | undefined>('ip', () => undefined)
}
