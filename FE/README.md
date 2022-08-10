# frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

0725 이병헌 집에서 git 잘 되나 테스트

0810 be 연결
일반 유저가 방 나갈 때
(PATCH) ​/api​/v1​/studyroom​/exit 스터디 룸 나가기
에서 nextOwnerEmail에는 빈 문자열, roomSeq에는 방 번호를 넘겨줌

방장 유저가 방 나갈 때
(PATCH) ​/api​/v1​/studyroom​/exit 스터디 룸 나가기
에서 nextOwnerEmail에는 다음 방장 이메일 문자열, roomSeq에는 방 번호를 넘겨줌

스터디룸 폭파할 때 
(PATCH) ​/api​/v1​/studyroom​/exit 스터디 룸 나가기
에서 nextOwnerEmail에는 다음 방장이 없으므로 빈 문자열, roomSeq에는 방 번호를 넘겨줌
(PATCH) ​/api​/v1​/studyroom​/{roomSeq} 스터디 룸 삭제
에서 roomSeq에 방 번호를 넘겨줌

하나의 면접이 끝날 때(finishInterview)
(POST) ​/api​/v1​/video 내 영상 저장
에서 면접자의 이메일, videoTitle(방 이름?), videoUrl(recording 후 나옴)을 넘겨줌

하나의 면접에 대한 피드백까지 모두 끝날 때(FBComplete)
(POST) ​/api​/v1​/studyroom​/interview 스터디 룸 면접 종료
에서 피드백, roomSeq, 위의 finishInterview에서 받은 videoSeq를 넘겨줌

내 영상 다시보기
(GET) ​/api​/v1​/video​/{videoSeq} 영상 및 피드백 다시보기
에서 videoSeq
