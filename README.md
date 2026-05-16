# 박범준 | Backend & Web Application Portfolio

Flask와 Python을 중심으로 인증, 데이터베이스, 파일 처리, 데이터 시각화, 객체 감지까지
실제 사용 흐름이 있는 웹 애플리케이션을 정리한 단일 페이지 포트폴리오입니다.

## 프로젝트

| # | 프로젝트 | 핵심 기술 |
| - | -------- | --------- |
| 01 | Flask 웹 게시판 (인증·CRUD·파일 업로드) | Python, Flask, SQLAlchemy, MySQL |
| 02 | 주식 데이터 관리 웹 (시각화·Ajax) | Python, Flask, SQLite, Plotly.js, jQuery |
| 03 | 포트홀 감지 및 관리 시스템 (YOLO + 인증 대시보드) | Python, Flask, MySQL, OpenCV, YOLO |

## 디렉터리 구조

```
.
├── index.html          단일 페이지 마크업
├── style/
│   ├── style.css       반응형 스타일 (980px / 720px 분기)
│   └── style.js        미디어 모달 (포커스 트랩 · ESC · 키보드 진입)
└── data/
    ├── board/          Project 01 캡처 + 시연 영상
    ├── stock/          Project 02 캡처
    └── pothole/        Project 03 캡처 + 시연 영상
```

## 실행

정적 페이지라 별도 빌드가 필요 없습니다. 로컬에서 확인하려면 아무 정적 서버나 사용하세요.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 미디어

- 영상은 모든 모던 브라우저에서 재생되도록 **MP4 (H.264 + AAC, faststart)** 로 인코딩되어 있습니다.
- 각 영상에는 클릭 전에도 보이는 `poster` 썸네일이 지정되어 있습니다.
- 캡처 이미지는 `loading="lazy"` 로 지연 로딩됩니다.
