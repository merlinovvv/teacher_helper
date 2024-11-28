import { jwtDecode } from 'jwt-decode';
import { func } from 'prop-types';

export function buildApiUrl(baseUrl, endpoint, parameters) {
  const hasParams = baseUrl.includes('?');
  const separator = hasParams ? '&' : '?';
  const paramsString = parameters
    ? Object.entries(parameters)
        .filter(([key, value]) =>
          Array.isArray(value) ? value?.length !== 0 : value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  return `${baseUrl}${endpoint}${paramsString ? separator + paramsString : ''}`;
}

export function checkToken(token) {
  try {
    const decodeToken = jwtDecode(token);
    const { exp } = decodeToken;

    if (exp) {
      const bufferTime = 10;
      return exp > Date.now() / 1000 + bufferTime;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export function checkCodeStatus(status){
  if(status === 401){
    localStorage.clear()
    window.location.reload()
  }
}