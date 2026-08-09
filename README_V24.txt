조팸스 GO v24 - 지도 내 위치 강제 재중앙화 패치

- 내 위치 버튼 클릭 시 최신 GPS 실측 좌표를 지도 중심으로 직접 적용
- 기존 GPS 평균값 때문에 위치가 밀리는 현상 제거
- Kakao Map relayout + setCenter + setLevel 순서로 재정렬
- setBounds/pan 애니메이션 잔존 상태에서도 120ms/450ms 후 중심 재확정
- 버튼 클릭 후 10초 동안 들어오는 GPS 갱신도 현재 위치 중심을 유지
- 내 위치 마커/거리 목록/GPS 정확도 동시 갱신
- Service Worker 캐시 v24로 갱신
