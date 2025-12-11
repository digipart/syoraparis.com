import qs from 'qs';

const TOKEN = 'TOKEN';
export default class Service {
  constructor() {}

  setTokenToCookie(token: string | null | undefined) {
    const tokenCookie = useCookie(TOKEN, {
      maxAge: 60 * 60 * 8,
    });
    tokenCookie.value = token;
  }
  getTokenFromoCookie() {
    const tokenCookie = useCookie(TOKEN);
    return tokenCookie;
  }

  headers(isAuth?: boolean) {
    const token = this.getTokenFromoCookie();

    const header: HeadersInit = {};
    if (token.value && isAuth) {
      header['Authorization'] = `Bearer ${token.value}`;
    }

    return header;
  }

  async $get<T>(api: string, body?: { options?: any; isAuth?: boolean }) {
    let query = '';

    if (body?.options) {
      const mappedArray = Object.entries(body?.options).map(([key, value]) => ({
        key,
        value,
      }));
      mappedArray.map((item, index) => {
        if (index === 0) {
          query += `?${item.key}=${item.value}`;
        } else {
          query += `&${item.key}=${item.value}`;
        }
      });
    }
    return await $fetch<T>(`/api2/${api}${query}`, {
      headers: this.headers(body?.isAuth),
    });
  }

  async $post<T>(api: string, body?: { options?: any; isAuth?: boolean }) {
    const formData = new FormData();

    if (body?.options) {
      const mappedArray = Object.entries(body?.options).map(([key, value]) => ({
        key,
        value,
      }));
      mappedArray.map((item) => {
        formData.append(item.key, item.value as string);
      });
    }

    return await $fetch<T>(`/api2/${api}`, {
      method: 'POST',
      body: formData,
      headers: this.headers(body?.isAuth),
    });
  }

  async $put<T>(api: string, body?: { options?: any; isAuth?: boolean }) {
    let dataQS = qs.stringify(body?.options);
    return await $fetch<T>(`/api2/${api}`, {
      method: 'PUT',
      body: dataQS,
      headers: this.headers(body?.isAuth),
    });
  }

  async $delete<T>(api: string, body?: { options?: any; isAuth?: boolean }) {
    let dataQS = qs.stringify(body?.options);
    return await $fetch<T>(`/api2/${api}`, {
      method: 'DELETE',
      body: dataQS,
      headers: this.headers(body?.isAuth),
    });
  }
}
