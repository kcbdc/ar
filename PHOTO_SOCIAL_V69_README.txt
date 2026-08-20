조팸스 GO v69 소셜 사진 안정화

수정사항
1) NEAREST SIGNAL / SOCIAL EXPEDITION 카드 간격 복구
   - 중간 hidden DOM이 있어도 적용되는 general sibling(~) 선택자로 18~22px 확보

2) 앨범 버튼 UI 개선
   - 줄무늬 아이콘 제거
   - 모던한 사진/산 모양 SVG 아이콘 적용

3) iPhone/Android 앨범 선택 안정화
   - JS .click()이 아니라 <label for="socialGalleryFile"> 네이티브 파일선택 연결
   - iOS Safari/WKWebView와 Android 브라우저에서 사용자 제스처를 그대로 전달

4) 사진 촬영 안정화
   - getUserMedia 카메라 유지
   - 촬영 결과를 File 생성 없이 Blob 그대로 사용해 iOS 호환성 개선

5) 실제 업로드 안정화
   - XMLHttpRequest로 업로드하고 upload.onprogress 사용
   - Authorization 헤더 유지, multipart Content-Type은 브라우저가 자동 설정
   - 45초 timeout / 네트워크 오류 표시

6) 진행 프로그레스바
   - 사진 확인 → 압축 → 썸네일 → 전송 → D1 저장 확인 단계 표시
   - 실제 네트워크 업로드 구간은 XHR progress 이벤트로 퍼센트 표시

7) Worker D1 저장
   - 기존 사진 삭제 + 신규 사진 INSERT를 D1 batch로 묶어 실패 시 롤백
   - photo_table_missing 오류를 별도 반환
   - /api/social/photos/ready 상태 확인 API 추가
   - D1 BLOB 조회 시 Uint8Array 복원 유지

배포 파일
Pages: checkpoints.html / assets/social-map.js / assets/style.css / sw.js
Worker: server/worker.js

주의
D1에 social_photos_v66 테이블이 아직 없다면 server/schema.sql을 기존 D1에 1회 적용해야 합니다.
