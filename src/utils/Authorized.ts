import RenderAuthorize from '@/components/Authorized';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(): string | string[] {
  const authorityString = localStorage.getItem('ne-auth');

  let authority;
  try {
    authority = typeof authorityString === 'string' ? JSON.parse(authorityString) : '';
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') return [authority];
  else return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('ne-auth', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

let Authorized = RenderAuthorize(getAuthority());

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/**
 * hard code
 * block need it。
 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
