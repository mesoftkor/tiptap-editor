# 버전 관리 가이드

이 프로젝트는 [Semantic Versioning (SemVer)](https://semver.org/)을 따릅니다.

## 버전 형식

버전은 `MAJOR.MINOR.PATCH` 형식입니다:
- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환성을 유지하면서 기능 추가
- **PATCH**: 하위 호환성을 유지하면서 버그 수정

## 버전 업데이트 명령어

### 패치 버전 (1.0.0 → 1.0.1)
버그 수정이나 작은 변경사항:
```bash
npm run version:patch
```

### 마이너 버전 (1.0.0 → 1.1.0)
새로운 기능 추가:
```bash
npm run version:minor
```

### 메이저 버전 (1.0.0 → 2.0.0)
호환되지 않는 변경사항:
```bash
npm run version:major
```

## 릴리즈 프로세스

### 자동 릴리즈 (권장)

릴리즈 명령어는 다음을 자동으로 수행합니다:
1. 버전 업데이트
2. 프로젝트 빌드
3. Git 커밋
4. Git 태그 생성
5. GitHub에 푸시

#### 패치 릴리즈
```bash
npm run release:patch
```

#### 마이너 릴리즈
```bash
npm run release:minor
```

#### 메이저 릴리즈
```bash
npm run release:major
```

### 수동 릴리즈

1. **버전 업데이트**
   ```bash
   npm run version:patch  # 또는 minor, major
   ```

2. **변경사항 작성**
   - `CHANGELOG.md`에 변경사항 추가
   - Unreleased 섹션을 새 버전으로 이동

3. **빌드**
   ```bash
   npm run build
   ```

4. **커밋 및 태그**
   ```bash
   git add .
   git commit -m "chore: release v1.0.1"
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin main
   git push origin --tags
   ```

5. **GitHub Release 생성** (선택사항)
   - GitHub 저장소에서 태그 기반 Release 생성
   - `CHANGELOG.md`의 해당 버전 섹션을 Release 노트로 사용

## CHANGELOG 작성 가이드

변경사항은 다음 카테고리로 분류합니다:
- **Added**: 새로운 기능
- **Changed**: 기존 기능 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 취약점 수정

예시:
```markdown
## [1.1.0] - 2025-11-05

### Added
- 새로운 이미지 리사이징 기능 추가

### Changed
- S3 업로드 타임아웃 시간 증가

### Fixed
- 다크 모드에서 툴바 표시 오류 수정
```

## 현재 버전 확인

```bash
npm version
```

또는:

```bash
node -p "require('./package.json').version"
```

