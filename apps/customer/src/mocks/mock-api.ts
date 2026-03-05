// Mock API 핸들러
// VITE_USE_MOCK=true 일 때 각 도메인 api/ 파일에서 직접 JSON import로 처리
// 향후 MSW 전환 시 이 파일에서 핸들러 정의

export const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'
