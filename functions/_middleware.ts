// Cloudflare Pages middleware for handling redirects and headers

export async function onRequest(context: any) {
  const { request, next } = context;
  
  // Handle trailing slashes
  const url = new URL(request.url);
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/';
    return Response.redirect(url.toString(), 301);
  }
  
  // Continue to next middleware or page
  const response = await next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}