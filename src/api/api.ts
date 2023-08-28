import axios from 'axios';
import querystring from 'query-string';
import { OVERWRITE, YANDEX_API_URL, YANDEX_TOKEN } from '../../const';

export async function submitFiles(files: File[]) {
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);

    const queryParams = {
      path: file.name,
      overwrite: OVERWRITE,
    };

    const queryString = querystring.stringify(queryParams);
    const url = `${YANDEX_API_URL}/?${queryString}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `OAuth ${YANDEX_TOKEN}`,
      },
    });

    const { href } = response.data;
    const uploadResponse = await axios.put(href, formData);

    if (uploadResponse.status !== 201) {
      throw new Error(`Ошибка загрузки файла ${file.name}`);
    }
  }
}
