# iOS Web Simulator — GitHub Pages Edition

실제 iPhone의 시스템이나 개인정보에 접근하지 않는 **브라우저 내부 가상 iPhone UI**입니다.

## GitHub Pages 배포

### 1. GitHub 저장소 만들기

GitHub에서 새 Repository를 만들고 이 프로젝트의 파일 전체를 업로드합니다.

중요한 점은 `index.html`이 저장소의 최상위에 있어야 한다는 것입니다.

```text
repository/
├── index.html
├── style.css
├── app.js
├── .nojekyll
├── apps/
├── data/
└── assets/
```

### 2. Pages 켜기

Repository → **Settings → Pages**

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

저장하면 GitHub Pages 주소가 생성됩니다.

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

### 3. 변경사항 반영

파일을 수정한 뒤 GitHub에 다시 업로드/커밋하면 Pages가 자동으로 다시 배포합니다.

## 로컬 테스트

Python이 있다면 프로젝트 폴더에서:

```bash
python -m http.server 8000
```

그리고:

```text
http://localhost:8000
```

으로 접속합니다.

## 데이터

초기 가상 데이터는 `data/data.js`에서 관리합니다.

실행 중 수정되는 메시지/메모/사진/설정 등은 브라우저의 `localStorage`에 저장됩니다.

설정 앱의 초기화 기능으로 초기 데이터로 돌아갈 수 있습니다.

## 주의

GitHub Pages는 정적 호스팅이므로 이 프로젝트에는 서버가 필요하지 않습니다.

하지만 실제 iPhone의 기능을 사용하는 것이 아니라 브라우저 안에서 모든 것을 가상으로 처리합니다.

실제 전화, SMS, 카메라 센서, Face ID, GPS, iOS 설정, 실제 사진/연락처/계정에는 접근하지 않습니다.
