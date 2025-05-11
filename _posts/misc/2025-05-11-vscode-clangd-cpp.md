---
layout: post
title: VSCode에서 clangd로 C/C++ 개발하기
categories:
  - 기타
---

최근에 clangd라는 아주 빠른 LSP를 발견했는데, Windows에서 GCC 헤더(bits/stdc++.h)를 사용하는 데 어려움을 좀 겪어서, 해결했던 과정을 공유하고자 해요.

준비물:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701) (선택)

GCC나 clangd 설치는 아래에서 모두 설명해 드릴게요.

# MinGW 설치하기 (msys2)

윈도우에서 GCC를 사용하기 위해서는 MinGW를 설치해야 해요. \
Visual Studio Code의 [공식 문서](https://code.visualstudio.com/docs/cpp/config-mingw#_installing-the-mingww64-toolchain)에 잘 설명되어 있어요.

먼저 [msys2](https://www.msys2.org/)를 설치합니다. \
![install msys2](/assets/images/2025-05-11-cpp-on-vscode/msys2-install-button.png)
버튼을 눌러 설치기를 다운받은 후 실행합니다.
![msys2 setup](/assets/images/2025-05-11-cpp-on-vscode/msys2-installer.png)
설치가 완료되면 `Run MSYS2 now.`를 체크하고 닫아서 **MSYS2 UCRT64**를 켜 줍시다. \
모르고 닫았다면 Window키를 눌러 검색하고 켜 주면 돼요. \
이제 열린 터미널에 GCC 설치 명령어를 입력하면 돼요.

1.  일반적인 C/C++ 개발자의 경우 (추천) \
    `pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain`
    를 입력하여 필요한 개발 도구들을 모두 설치합니다.
2.  PS 용도로만 GCC를 사용할 경우 \
    `pacman -S --needed mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gdb`
    를 입력하여 gcc, g++, gdb만 설치합니다.

지금 뭘 하고 있는지 잘 모른다면 1번 명령어를 실행하면 돼요. \
저는 PS 용도로만 GCC를 사용할 것이므로 2번 명령어를 실행할게요.

![paste command](/assets/images/2025-05-11-cpp-on-vscode/paste-command.png)
Ctrl + V가 작동하지 않으면 우클릭으로 붙여넣기 해 주면 돼요.

![proceed installation](/assets/images/2025-05-11-cpp-on-vscode/proceed-installation.png)
Y를 입력하여 모두 설치해 주면 돼요.

![check installation](/assets/images/2025-05-11-cpp-on-vscode/check-installation.png)
설치가 완료되면 `gcc --version`, `g++ --version`, `gdb --version`을 입력하여 제대로 설치되었는지 테스트 해 봅시다.

나중에 GCC를 업데이트 해야 하는 경우 공식 문서의 [Updating MSYS2](https://www.msys2.org/docs/updating/)를 참고하면 돼요.

# VSCode 확장 설치하기

먼저 C/C++ 확장을 설치합니다. Extension Pack이 아니라 C/C++만 설치하는 것에 유의하세요. \
Intellisense용은 아니고, 디버깅 용도로만 사용할 거예요. \
![install C/C++ extension](/assets/images/2025-05-11-cpp-on-vscode/install-ext-c_cpp.png)

이제 clangd 확장을 설치합시다. \
![install clangd extension](/assets/images/2025-05-11-cpp-on-vscode/install-ext-clangd.png)

확장을 설치하고 나면 clangd를 설치해 줘야 해요. Ctrl + Shift + P를 눌러 커맨드 팔레트를 열어줍시다. \
![install clangd](/assets/images/2025-05-11-cpp-on-vscode/install-clangd.png)
`clangd: Download language server`를 선택하면 clangd 확장이 알아서 언어 서버를 vscode 내부에 설치하고, path 설정까지 해요.

이제 C/C++ 확장의 Intellisense 기능을 꺼 줄 거예요. \
![disable intellisense popup](/assets/images/2025-05-11-cpp-on-vscode/disable-intellisense-popup.png)
이러한 팝업이 있다면 `Disable IntelliSense`를 눌러주면 돼요.

모르고 닫았다면 설정에서 `Intelli Sense Engine`을 `disabled`로 설정해 주면 돼요.
![disable intellisense](/assets/images/2025-05-11-cpp-on-vscode/disable-intellisense.png)

# clangd config 설정

좋아요, 그럼 이제 신나게 C++ 코딩을 해 볼까요? 먼저 bits/stdc++.h 헤더를 불러와 볼게요. \
![cannot find header](/assets/images/2025-05-11-cpp-on-vscode/cannot-find-header.png)
어라? bits/stdc++.h를 찾을 수 없다고 하네요? 왜 그럴까요?

한번 [공식 문서](https://clangd.llvm.org/guides/system-headers#target-triple)를 찾아봅시다. \
![target triple](/assets/images/2025-05-11-cpp-on-vscode/clangd-target-triple.png)
아하! target을 지정해서 clang이 헤더 파일을 찾을 수 있도록 도와줄 수 있다고 하네요. \
target 지정은 clangd config 파일에서 가능한데요, 아까처럼 Ctrl + Shift + P로 커맨드 팔레트를 열어 config 파일을 열어줍시다.

![open config.yaml](/assets/images/2025-05-11-cpp-on-vscode/clangd-open-config.png)
현재 작업하고 있는 폴더에만 설정을 적용하고 싶다면 project config을, 모든 폴더에 적용하고 싶다면 user config을 열면 돼요. \
clangd는 project config을 user config보다 우선으로 적용해요. \
저는 user config에 작성할게요.

project config을 선택하면 해당 폴더에 .clangd 파일을 만들어서 열게 될 거고, \
user config을 선택하면 AppData 내부의 config.yaml을 열게 될 거에요.

![write config](/assets/images/2025-05-11-cpp-on-vscode/clangd-write-config.png)
[공식 문서](https://clangd.llvm.org/config)를 참고해서 적으면 돼요.

```yaml
CompileFlags:
  Add:
    - --target=x86_64-w64-mingw32
```

만약 C/C++ 버전을 지정하고 싶으면 아래처럼 작성할 수도 있어요.

```yaml
CompileFlags:
  Add:
    - --target=x86_64-w64-mingw32

---

If:
  PathMatch: [".*\.c$"]
CompileFlags:
  Add:
    - "-std=gnu17"

---

If:
  PathMatch: [".*\.cpp$", ".*\.cc$", ".*\.cxx$", ".*\.hpp$", ".*\.hh$", ".*\.hxx$"]
CompileFlags:
  Add:
    - "-std=gnu++23"
```

이제 다시 커맨드 팔레트를 열고 clangd 서버를 다시 실행하면 해결될 거예요.
![restart clangd](/assets/images/2025-05-11-cpp-on-vscode/restart-clangd.png)

---

# 마치며

문제를 해결해 보면서 공식 문서를 열심히 읽는게 정말 중요하다는 것을 느꼈어요. \
공식 문서에는 정말 자세하게 여러 내용들이 나와 있더라고요. \
ChatGPT보다 공식 문서가 낫네요.

다만 아직 macOS에서는 clangd가 GCC 헤더를 인식하도록 하는 방법을 찾지 못했어요. 공식 문서를 읽으면서 4시간동안 여러 시도를 해 봤지만 해결되지 않더라고요.
혹시 해결법 아시는 분 있으시면 말해주세요!