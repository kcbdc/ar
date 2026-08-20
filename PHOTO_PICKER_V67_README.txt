조팸스 GO v67 사진 선택기 수정

원인
- 이전 버전은 HTML은 촬영/앨범 버튼 2개로 바뀌었지만 social-map.js URL이 여전히 ?v=66이어서, 서비스워커/브라우저 캐시에 남은 구 JS가 실행될 수 있었습니다.
- 구 JS는 존재하지 않는 #socialFile 또는 이전 DOM을 참조해 버튼이 동작하지 않는 상태가 발생할 수 있었습니다.
- capture=environment는 Android에서 카메라를 강제 실행하므로 선택 기능과 충돌합니다.

수정
- '사진 촬영 또는 선택' 영역 하나만 사용
- label for=socialFile 방식으로 네이티브 선택기를 직접 호출 (JS click 의존성 제거)
- input accept=image/*, capture 속성 제거
- Android 시스템 선택기에서 카메라/갤러리/파일 앱 중 선택 가능
- social-map.js?v=67, style.css?v=67 캐시 버스터 적용
- Service Worker cache를 jopams-go-v67로 갱신
- 같은 파일 재선택도 onchange가 발생하도록 input value 초기화

변경 파일
- checkpoints.html
- assets/social-map.js
- assets/style.css
- sw.js
