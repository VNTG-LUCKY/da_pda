# GitHub에 올리기 (PowerShell 단계별)

프로젝트 폴더(`da_pda`)에서 **PowerShell**을 열고, 아래 명령어를 **순서대로 하나씩** 실행하세요.

---

## 1. 프로젝트 폴더로 이동

```powershell
cd C:\Users\HDPARK\Desktop\da_pda
```

---

## 2. Git 상태 확인

```powershell
git status
```

- 이미 Git 저장소면 변경/추가된 파일 목록이 보입니다.
- `fatal: not a git repository` 가 나오면 **4단계**로 가서 저장소를 만든 뒤, **2단계**부터 다시 진행하세요.

---

## 3. GitHub에서 새 저장소 만들기 (웹에서 한 번만)

1. 브라우저에서 **https://github.com** 접속 후 로그인
2. 우측 상단 **+** → **New repository** 클릭
3. **Repository name** 에 예: `da_pda` 입력
4. **Public** 선택 (또는 Private)
5. **"Add a README file"** 등은 체크하지 말고 **Create repository** 클릭
6. 생성된 페이지에 나오는 **저장소 주소**를 복사  
   - 예: `https://github.com/내아이디/da_pda.git`

---

## 4. Git 저장소가 아직 없다면 (처음 한 번만)

`git status` 에서 `not a git repository` 가 나왔을 때만 실행하세요.

```powershell
git init
```

---

## 5. 원격(remote) 연결 확인

```powershell
git remote -v
```

- 아무것도 안 나오면 **원격이 없는 것**입니다. 아래 6단계에서 `origin` 추가.
- `origin` 이 이미 있으면 **6단계는 건너뛰고** 7단계로 가세요.

---

## 6. GitHub 원격 주소 추가 (처음 한 번만)

아래 `https://github.com/내아이디/da_pda.git` 부분을 **본인 저장소 주소**로 바꿔서 실행하세요.

```powershell
git remote add origin https://github.com/내아이디/da_pda.git
```

이미 `origin` 이 있는데 주소만 바꾸고 싶다면:

```powershell
git remote set-url origin https://github.com/내아이디/da_pda.git
```

---

## 7. 올릴 파일 스테이징 (전체)

```powershell
git add .
```

특정 파일만 올리고 싶다면 (예: 특정 폴더만):

```powershell
git add client/server
git add *.md
```

---

## 8. 스테이징 상태 다시 확인

```powershell
git status
```

- 초록색(또는 초록 글씨)으로 나오는 파일들이 이번에 커밋에 포함됩니다.

---

## 9. 커밋 (버전 하나 만들기)

```powershell
git commit -m "첫 업로드"
```

이미 커밋이 여러 번 있었다면 예:

```powershell
git commit -m "적재위치 등록 LIST 헤더 가운데 정렬, 본수 앞자리 0 제거"
```

---

## 10. GitHub에 올리기 (Push)

**처음 Push 할 때** (브랜치 이름이 `main` 인 경우):

```powershell
git branch -M main
git push -u origin main
```

이미 `main` 이고 upstream 이 설정돼 있으면:

```powershell
git push
```

- 로그인 창이 뜨면 GitHub 계정으로 로그인하거나, **Personal Access Token** 을 비밀번호 자리에 입력하세요.

---

## 11. (선택) 브랜치 이름이 master 인 경우

```powershell
git branch -M main
git push -u origin main
```

---

## 자주 쓰는 명령어 정리

| 목적           | 명령어 |
|----------------|--------|
| 상태 확인      | `git status` |
| 전체 스테이징 | `git add .` |
| 커밋           | `git commit -m "메시지"` |
| 푸시           | `git push` |
| 원격 목록      | `git remote -v` |
| 풀(가져오기)   | `git pull origin main` |

---

## 오류가 났을 때

- **"Permission denied" / "Authentication failed"**  
  - GitHub 로그인 또는 **Settings → Developer settings → Personal access tokens** 에서 토큰 생성 후, 비밀번호 대신 토큰 입력

- **"failed to push some refs"**  
  - 원격에 이미 커밋이 있으면 먼저 가져오기:  
    `git pull origin main --rebase`  
    그 다음:  
    `git push origin main`

- **커밋을 취소하고 싶을 때 (아직 push 안 했을 때)**  
  `git reset --soft HEAD~1`  
  → 마지막 커밋만 취소, 파일 변경 내용은 그대로 유지

---

이 문서는 프로젝트 루트의 **GITHUB-UPLOAD.md** 입니다. 필요하면 수정해서 사용하세요.
