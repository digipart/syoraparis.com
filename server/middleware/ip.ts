export default defineEventHandler((event) => {
  let ip = getRequestHeader(event, 'x-forwarded-for') || getRequestIP(event);

  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    ip = '37.67.159.137';
  }

  event.context.ip = ip;
});
