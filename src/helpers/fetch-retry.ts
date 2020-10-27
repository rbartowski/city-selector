export const API_RETRY_ATTEMPTS = 3;
export const PATCH_SUCCESS_CODE = 204;
export const GET_SUCCESS_CODE = 200;

export const fetch_retry = async (url: string, options: any, n: number): Promise<Response> => {
  try {
      const res = await fetch(url, options)

      if (res.status !== GET_SUCCESS_CODE && res.status !== PATCH_SUCCESS_CODE) {
        throw new Error('Bad server response');
      }

      return res;
  } catch(err) {
      if (n === 1) throw err;
      const res = await fetch_retry(url, options, n - 1);

      if (res.status !== GET_SUCCESS_CODE && res.status !== PATCH_SUCCESS_CODE) {
        return await fetch_retry(url, options, n - 1);
      }

      return res;
  }
};