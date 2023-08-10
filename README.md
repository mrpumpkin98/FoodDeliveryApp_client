# 첫 시작(setting)

[공식문서](https://reactnative.dev/)

- 초기 세팅: [반드시 따라하기](https://reactnative.dev/docs/environment-setup)
- java 17 버전 설치하면 안 됨(11버전 설치할 것), 환경 변수 설정도 잘 해 놓을 것(JAVA_HOME)
- Android SDK 30이 있어야 함. 가상기기는 Nexus 5로 받을 것
- [adb](https://developer.android.com/studio/releases/platform-tools) 설치 필요, ANDROID_HOME 환경변수도
- [m1 mac용 설정](https://qnrjs42.blog/react-native/m1-arm64-setting)
- [읽어보면 좋은 벨로퍼트님의 글](https://ridicorp.com/story/react-native-1year-review/)

```shell
npx react-native init FoodDeliveryApp --template react-native-template-typescript
```

```shell
npm run android # 안드로이드 실행 명령어
npm run ios # 아이폰 실행 명령어
```

```shell
npm start
```

## [ 폴더 구조 ]

- android: 안드로이드 네이티브 폴더
- ios: ios 네이티브 폴더
- node_modules: 노드 라이브러리
- app.json: name은 앱 컴포넌트 이름이니 함부로 바꾸면 안 됨, 이거 바꾸면 네이티브 컴포넌트 이름도 다 바꿔야함, displayName은 앱 이름 변경용
  - ios/FoodDeliveryApp/AppDelegate.m 의 moduleName
  - android/app/src/main/java/com/fooddeliveryapp/MainActivity.java 의 getMainComponentName
- babel.config.js: 바벨 설정
- index.js: 메인 파일
- App.tsx: 기본 App 컴포넌트
- metro.config.js: 메트로 설정 파일(웹팩 대신 사용)
- tsconfig.json: 타입스크립트 설정
- android/app/src/main/java/com/fooddeliveryapp/MainActivity.java: 안드로이드 액티비티에서 js엔진 통해 리액트 코드 실행 + bridge로 소통

## [ 앱 실행 후 ]

- cmd + R로 리로딩
- cmd + D로 디버그 메뉴
- Debugging with Chrome으로 개발자 도구 사용 가능
- Configure Bundler로 메트로 서버 포트 변경 가능
- Show Perf Monitor로 프레임 측정 가능

[Flipper](https://fbflipper.com/) 페이스북이 만든 모바일앱 디버거도 좋음(다만 연결 시 에러나는 사람 다수 발견)

- setup doctor 문제 해결할 것

```shell
npm i react-native-flipper redux-flipper rn-async-storage-flipper @react-native-async-storage/async-storage --force
npx pod-install # 아이폰 전용
```

- flipper-plugin-async-storage
- flipper-plugin-redux-debugger
- Layout, Network, Images, Database(sqlite), React Devtools, Hermes Debugger 사용 가능

## [ 앱 이름 변경 ]

\android\app\src\main\res\values\strings.xml

app.json의 displayName

\ios\FoodDeliveryApp\Info.plist의 CFBundleDisplayName

**단!** 0.68버전부터는 app.json, strings.xml, CFBundleDisplayName을 한글로하면 튕기는 문제 발생. 그럴때는 전부 영어로 되돌리고
ios에서는 [링크](https://thddudco.tistory.com/16) 따라서 다국어 설정으로 한국어 설정할 것.
또한 안드로이드에서는 \android\app\src\main\res\values\strings.xml은 영어로 두고 \android\app\src\main\res\values-ko\strings.xml 을 새로 만들어 여기서 한글로 변경할 것

android/gradle.properties

```
FLIPPER_VERSION=0.145.0
```

플리퍼 버전을 0.145.0으로 높일 것.

## [ 리액트 네이티브 폴더 구조 ]

- src 폴더 생성(지금 바로 생성 안 하고 폴더 안에 파일이 들 때 생성해도 됨)
- src/assets: 이미지, 폰트 등
- src/constants: 상수
- src/pages: 페이지 단위 컴포넌트
- src/components: 기타 컴포넌트
- src/contexts: context api 모음
- src/hooks: 커스텀 훅 모음
- src/modules: 네이티브 모듈
- src/store: 리덕스 스토어 세팅
- src/slices: 리덕스 슬라이스
- types: 타입 정의

# 코딩 시작!

## [ App.tsx 분석 ]

- `View`가 div, `Text`가 span이라고 생각하기(1대1 매칭은 아님)
- css는 `dp` 단위(density-independent pixels, 다양한 화면 크기에 영향받지 않음)
- [css 속성 리스트](https://github.com/vhpoet/react-native-styling-cheat-sheet): 좀 오래됨
- flex에서는 flexDirection이 Column이 default
