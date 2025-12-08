export default defineEventHandler((event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for') || getRequestIP(event)
  event.context.ip = ip
})
