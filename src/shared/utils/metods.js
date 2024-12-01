import axios from 'axios';
import { checkToken } from './utils';

let tokenPromise = null;

export async function handleRequest(url, payload = null, method = 'get', contentType = 'application/json') {
  let accessToken = localStorage.getItem('access_token');
  let refreshToken = localStorage.getItem('refresh_token')

  const tokenIsNotExpired = checkToken(accessToken)

  if (!tokenIsNotExpired && !tokenPromise) {
    tokenPromise = (async () => {
      const refreshAllTokens = await refreshIfExpired(refreshToken)
      return refreshAllTokens
      
    })();
  }

  // Если токен обновляется, ждем завершения этого процесса
  if (tokenPromise) {
    const tokens = await tokenPromise;
    tokenPromise = null; // Сбрасываем Promise после завершения
    if (tokens?.accessToken && tokens?.refreshToken) {
      accessToken = tokens?.accessToken;
      refreshToken = tokens?.refreshToken;
    }
  }

  try {
    const headers = {
      'Content-Type': contentType,
      Authorization: `Bearer ${accessToken}`,
    };
    let response 
    if (payload) {
      response = await axios({ method, url, data: payload, headers });
    } else {
      response = await axios({ method, url, headers });
    }
    
    if (method === 'get') {
      return response.data?.response;
    } else {
      return response.data;
    }

  } catch (error) {
    const { response } = error;

    // Проверяем статус ошибки
    if (response) {
      checkCodeStatus(response.status); // Логика обработки статуса
      return response.data;
    }

    // Общая ошибка
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function post(url, payload) {
  return await handleRequest(url, payload, 'post');
}

export async function postFiles(url, formData) {
  return await handleRequest(url, formData, 'post', 'multipart/form-data');
}

export async function remove(url) {
  return await handleRequest(url, null, 'delete');
}

export async function get(url) {
  return await handleRequest(url);
}

export async function authorize(url, payload) {
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = response;
    return data;
  } catch (error) {
    const { response } = error;

    if (response) {
      const { data } = response;
      return data;
    } else {
      return { success: false, message: 'Error' };
    }
  }
}

async function refreshIfExpired(refreshToken) {
  if (!refreshToken) {
    checkCodeStatus(401)
    return false;
  }

  try {
    const responseData = await axios.post(import.meta.env.VITE_MAIN_API + 'auth/refresh', { refreshToken }, {
      headers: { 'Content-Type': 'application/json' },
    })

    const { success, response } = responseData.data;

    if (success && response?.accessToken && response?.refreshToken) {
      localStorage.setItem('access_token', response?.accessToken);
      localStorage.setItem('refresh_token', response?.refreshToken);

      return { accessToken: response?.accessToken, refreshToken: response?.refreshToken };
    } else {
      checkCodeStatus(401)
    }
  } catch (error) {
    checkCodeStatus(error.response.status)
    console.error('Failed to refresh token:', error);
    return false;
  }
}

function checkCodeStatus(status) {
  if (status === 401) {
    localStorage.clear()
    window.location.href = '/authorize'
  }
}
