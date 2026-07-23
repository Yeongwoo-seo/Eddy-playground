// 전역 네임스페이스. file:// 로컬 실행 시 ES module import가 CORS로
// 막히는 문제를 피하기 위해 이 프로젝트의 모든 모듈은 번들러 없이
// plain <script> 태그로 로드되고, 여기 등록된 객체 하나를 공유한다.
window.ARAM = window.ARAM || {};
