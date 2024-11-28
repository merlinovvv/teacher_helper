import axios from 'axios';
import { checkToken } from './utils';

export async function post(url, payload) {
  const notExpired = checkToken(localStorage.getItem('access_token'));
  if (notExpired) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
  } else {
    localStorage.setItem('access_token', '');
  }
}

export async function postFiles(url, formData) {
  const notExpired = checkToken(localStorage.getItem('access_token'));
  if (notExpired) {
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
  } else {
    localStorage.setItem('access_token', '');
  }
}

export async function remove(url) {
  const notExpired = checkToken(localStorage.getItem('access_token'));
  if (notExpired) {
    try {
      const response = await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
  } else {
    localStorage.setItem('access_token', '');
  }
}

export async function get(url) {
  const notExpired = checkToken(localStorage.getItem('access_token'));
  if (notExpired) {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      };
      const response = await axios.get(url, { headers });
      const { data } = response;
      return data?.response;
    } catch (error) {
      const { response } = error;

      if (response) {
        const { data } = response;
        return data;
      } else {
        return { success: false, message: 'Error' };
      }
    }
  } else {
    localStorage.setItem('access_token', '');
  }
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
