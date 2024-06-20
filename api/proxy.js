import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: true  // SSL 인증서 검증을 강제합니다 (보안을 위해 false에서 true로 변경).
});

// API URL을 동적으로 생성하는 함수
function createApiUrl(authkey, searchdate, data) {
  return `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
}

// Axios 요청을 수행하는 함수
async function fetchData(authkey, searchdate, data) {
  try {
    const apiUrl = createApiUrl(authkey, searchdate, data);
    let response = await axios.get(apiUrl, { httpsAgent, maxRedirects: 5 });  // 리디렉션 최대 횟수를 제한

    // 리디렉션을 추적하고 무한 루프를 방지
    const visited = new Set();
    while (response.status === 302 && response.headers.location) {
      if (visited.has(response.headers.location) || visited.size > 5) {
        throw new Error('Too many redirects or redirect loop detected');
      }
      visited.add(response.headers.location);
      response = await axios.get(response.headers.location, { httpsAgent, maxRedirects: 0 });
    }

    return response.data;
  } catch (error) {
    console.error('Error during API call:', error.message);
    throw error;  // 에러를 다시 던져 호출자가 처리할 수 있도록 합니다.
  }
}

// 예를 들어, 함수 사용 방법
fetchData('your_auth_key', '20240503', 'AP01')
  .then(data => console.log('API Data:', data))
  .catch(error => console.error('API Error:', error));
